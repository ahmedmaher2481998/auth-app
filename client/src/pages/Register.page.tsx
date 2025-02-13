import type React from "react"
import { useForm } from "react-hook-form"
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  Text,
  Link as ChakraLink,
  FormErrorMessage,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import { useAuth } from "../contexts/auth.context"

interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  name: string
}

const RegisterPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>()
  const { register: registerUser } = useAuth()

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.email, data.password, data.name)
    } catch (error) {
      console.error("Registration failed:", error)
    }
  }

  return (
    <Box maxWidth="400px" margin="auto" mt={8} p={4}>
      <VStack spacing="4" align="stretch">
        <Heading as="h1" size="xl" textAlign="center">
          Register
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing="4">
          <FormControl isInvalid={!!errors.email}>
              <FormLabel>Name</FormLabel>
              <Input type="text" {...register("name", { required: "Name is required" })} />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input type="email" {...register("email", { required: "Email is required" })} />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.confirmPassword}>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === watch("password") || "Passwords do not match",
                })}
              />
              <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
            </FormControl>
            <Button type="submit" colorScheme="blue" width="full">
              Register
            </Button>
          </VStack>
        </form>
        <Text textAlign="center">
          Already have an account?{" "}
          <ChakraLink as={RouterLink} to="/login" color="blue.500">
            Login here
          </ChakraLink>
        </Text>
      </VStack>
    </Box>
  )
}

export default RegisterPage

