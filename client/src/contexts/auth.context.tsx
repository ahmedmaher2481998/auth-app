"use client"

import type React from "react"
import { createContext, useState, useContext } from "react"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"
import { login, register, logout } from "../services/api.service"
import { useToast } from "@chakra-ui/react"

interface User {
  id: string
  email: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(Cookies.get("accessToken") ? true : false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const handleLogout = () => {
    console.log("%c handleLogout", "color: red; font-weight: bold;")
    Cookies.remove("accessToken")
    Cookies.remove("refreshToken")
    setUser(null)
    setIsAuthenticated(false)
    navigate("/login")
  }
  
  const loginHandler = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await login(email, password)
      const { accessToken, refreshToken: newRefreshToken, user, atExpiry } = response.data
      console.log("%c loginHandler",accessToken, "color: red; font-weight: bold;")
      Cookies.set("accessToken", accessToken, { 
        secure: true, 
        sameSite: "strict",
      })
      Cookies.set('atExpiry', new Date(atExpiry).toISOString(), { 
        secure: true, 
        sameSite: "strict" 
      })
      Cookies.set("refreshToken", newRefreshToken, { 
        secure: true, 
        sameSite: "strict" 
      })
      setUser(user)
      setIsAuthenticated(true)
      navigate("/")
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.email}!`,
        status: "success",
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      console.error("Login failed:", error)
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const registerHandler = async (email: string, password: string, name: string) => {
    try {
      await register(email, password, name)
      navigate("/login")
      toast({
        title: "Registration successful",
        description: "Please log in with your new account",
        status: "success",
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      console.error("Registration failed:", error)
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again with a different email",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
      throw error
    }
  }

  const logoutHandler = async () => {
    try {
      await logout()
      handleLogout()
    } catch (error) {
      console.error("Logout failed:", error)
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login: loginHandler,
    register: registerHandler,
    logout: logoutHandler,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
