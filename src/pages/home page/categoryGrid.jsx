import React from "react";
import { Container, Box, Heading, SimpleGrid, HStack } from "@chakra-ui/react";

export default function CategoryGrid() {
  const items = [
    { name: "Cars", count: "2,400+" },
    { name: "Homes", count: "1,100+" },
    { name: "Cameras", count: "900+" },
    { name: "Tools", count: "1,800+" },
    { name: "Events", count: "300+" },
    { name: "Boats", count: "120+" },
    { name: "Office", count: "400+" },
    { name: "Furniture", count: "2,000+" },
  ];
  return (
    <section id="browse" aria-label="Categories">
      <Container py={{ base: 8, md: 12 }}>
        <Heading as="h2" size="5xl" fontWeight="semibold">Explore top categories</Heading>
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={{ base: 4, md: 6 }} mt={6}>
          {items.map((c) => (
            <Box key={c.name} bg="surface" borderRadius="2xl" borderWidth="1px" overflow="hidden" _hover={{ transform: "translateY(-4px)" }} transition="all 0.15s ease">
              <Box aria-hidden w="full" pt="75%" bg="accent" opacity={0.15} />
              <Box p={4}>
                <HStack justify="space-between">
                  <Heading as="h3" size="md" fontWeight="medium">{c.name}</Heading>
                  <Box as="span" opacity={0.8}>{c.count} items</Box>
                </HStack>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </section>
  );
}


