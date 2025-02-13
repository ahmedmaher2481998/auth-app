import type React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/auth.context"
import Cookies from "js-cookie"
interface PrivateRouteProps {
  children: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const RT = Cookies.get("refreshToken")
  if (!isAuthenticated && !RT) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}

export default PrivateRoute

