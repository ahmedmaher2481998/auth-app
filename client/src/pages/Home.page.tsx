import type React from "react"
import { Box, Heading, Text, Button, VStack, Container, Spinner } from "@chakra-ui/react"
import { useAuth } from "../contexts/auth.context"
import { useQuery } from "@tanstack/react-query"
import api from "../services/api.service"

const HomePage: React.FC = () => {
  const { user, logout, isLoading: authLoading } = useAuth()

  const {
    data: protectedData,
    isLoading: dataLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["protectedData"],
    queryFn: async () => {
      const response = await api.get("/users/profile")
      return response.data
    },
    enabled: !authLoading // Only run query when auth is ready
  })

  if (authLoading) {
    return (
      <Container maxW="container.md" py={8}>
        <VStack spacing={4} align="center">
          <Spinner size="xl" color="blue.500" />
          <Text>Loading authentication...</Text>
        </VStack>
      </Container>
    )
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing="4" align="stretch">
        <Heading as="h1" size="xl">
          Welcome to the Home Page
        </Heading>
        <Text fontSize="lg">Hello, {user?.email}!</Text>
        {dataLoading && <Text>Loading protected data...</Text>}
        {error && (
          <Box>
            <Text color="red.500">
              Error loading protected data: {error instanceof Error ? error.message : "Unknown error"}
            </Text>
            <Button onClick={() => refetch()} mt={2} colorScheme="blue" size="sm">
              Retry
            </Button>
          </Box>
        )}
        {protectedData && (
          <Box p={4} borderRadius="md" bg="gray.50">
            <Heading as="h2" size="md" mb={2}>
              Protected Data:
            </Heading>
            <Text as="pre" whiteSpace="pre-wrap" fontSize="sm">
              {JSON.stringify(protectedData, null, 2)}
            </Text>
          </Box>
        )}
        <Button onClick={logout} colorScheme="red" size="lg">
          Logout
        </Button>
      </VStack>
    </Container>
  )
}

export default HomePage

