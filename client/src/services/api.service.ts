import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"
import Cookies from "js-cookie"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface User {
  id: string
  email: string
}

interface AuthResponse {
  status: string
  message: string
  data: {
    user: User
    accessToken: string
    refreshToken: string
    atExpiry: Date
  }
}

interface RefreshResponse {
  accessToken: string
  atExpiry: Date
  user: User
}

interface ErrorResponse {
  message: string
}

class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message)
    this.name = "ApiError"
  }
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
  _initial?: boolean
  _retryCount?: number
}

const api = axios.create({
  baseURL: API_URL,
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  failedQueue = []
}

const refreshAccessToken = async () => {
  const refreshToken = Cookies.get("refreshToken")
  if (!refreshToken) {
    throw new ApiError("No refresh token available")
  }
  const accessTokenStored = Cookies.get("accessToken")
  if(accessTokenStored) return ;
  const response = await axios.post<RefreshResponse>(`${API_URL}/auth/refresh`, { refreshToken })
  const { accessToken, atExpiry } = response.data
  
  Cookies.set("accessToken", accessToken, { 
    secure: true, 
    sameSite: "strict",
    expires: new Date(atExpiry)
  })
  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`
  
  return accessToken
}

api.interceptors.request.use(
  async (config) => {
    const accessToken = Cookies.get("accessToken")
    console.log(`send request with token: ${accessToken}`);
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(new ApiError(error.message)),
)

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig
    
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        try {
          console.log("%c isRefreshing", "color: red; font-weight: bold;")
          const token = await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
          originalRequest.headers["Authorization"] = `Bearer ${token}`
          return api(originalRequest)
        } catch (err) {
          return Promise.reject(err)
        }
      }

      originalRequest._retry = true
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1
      isRefreshing = true

      try {
        if (originalRequest._retryCount >= 3) {
          Cookies.remove("accessToken")
          Cookies.remove("refreshToken")
          window.location.href = "/login"
          throw new ApiError("Failed to refresh token after 3 attempts")
        }

        const accessToken = await refreshAccessToken()
        processQueue(null, accessToken)
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        Cookies.remove("accessToken")
        Cookies.remove("refreshToken")
        window.location.href = "/login"
        throw new ApiError(
          refreshError instanceof Error ? refreshError.message : "Failed to refresh authentication token",
        )
      } finally {
        isRefreshing = false
      }
    }
    
    const message = error.response?.data?.message || error.message || "An unexpected error occurred"
    throw new ApiError(message, error.response?.status)
  },
)

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/login", { email, password })
    const { accessToken } = response.data.data
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new ApiError(error.response?.data?.message || "Login failed", error.response?.status)
    }
    throw error
  }
}

export const register = async (email: string, password: string, name: string): Promise<void> => {
  try {
    await api.post("/auth/register", { email, password, name })
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new ApiError(error.response?.data?.message || "Registration failed", error.response?.status)
    }
    throw error
  }
}

export const logout = async (): Promise<void> => {
  try {
    const refreshToken = Cookies.get("refreshToken")
    if (!refreshToken) {
      throw new ApiError("No refresh token available")
    }
    await api.post("/auth/logout", { refreshToken })
    api.defaults.headers.common["Authorization"] = ""
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new ApiError(error.response?.data?.message || "Logout failed", error.response?.status)
    }
    throw error
  }
}

export default api
