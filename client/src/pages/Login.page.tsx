import type React from "react"
import { useForm } from "react-hook-form"
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link as ChakraLink,
  FormErrorMessage,
} from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import { useAuth } from "../contexts/auth.context"

interface LoginFormData {
  email: string
  password: string
}

const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()
  const { login } = useAuth()

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password)
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  return (
    <Box maxWidth="400px" margin="auto" mt={8} p={4}>
      <VStack spacing="4" align="stretch">
        <Heading as="h1" size="xl" textAlign="center">
          Login
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing="4">
            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input type="email" {...register("email", { required: "Email is required" })} />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input type="password" {...register("password", { required: "Password is required" })} />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>
            <Button type="submit" colorScheme="blue" width="full">
              Login
            </Button>
          </VStack>
        </form>
        <Text textAlign="center">
          Don't have an account?{" "}
          <ChakraLink as={RouterLink} to="/register" color="blue.500">
            Register here
          </ChakraLink>
        </Text>
      </VStack>
    </Box>
  )
}

export default LoginPage

