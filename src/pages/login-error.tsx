import { useRouter } from "next/router";
import { Container, Box, Heading, Text, Button } from "@chakra-ui/react";

export default function LoginError() {
  const router = useRouter();
  const error = typeof router.query.error === "string" ? router.query.error : "Unknown error occurred";

  return (
    <Container maxW="md" py={{ base: 10, md: 20 }}>
      <Box borderRadius="2xl" boxShadow="lg" p={{ base: 6, md: 10 }} bg="surface" textAlign="center">
        <Heading as="h1" size="xl" mb={4} color="#d32f2f">
          Login Failed
        </Heading>
        <Text mb={6} color="gray.600">
          {error}
        </Text>
        <Button className="button" onClick={() => router.push("/signup")}>
          Try Again
        </Button>
        <Text mt={4} fontSize="sm" color="gray.500">
          If this error persists, please check your Google OAuth configuration.
        </Text>
      </Box>
    </Container>
  );
}


