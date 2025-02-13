import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { ChakraProvider } from "@chakra-ui/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "./contexts/auth.context"
import PrivateRoute from "./components/PrivateRoute"
import LoginPage from "./pages/Login.page"
import RegisterPage from "./pages/Register.page"
import HomePage from "./pages/Home.page"
import { baseTheme } from '@chakra-ui/theme'

const queryClient = new QueryClient()

function App() {
  return (
    <Router>
      {/* @ts-ignore */}
      <ChakraProvider value={baseTheme}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <HomePage />
                  </PrivateRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </Router>
  )
}

export default App

