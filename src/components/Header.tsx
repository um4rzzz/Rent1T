import { Box, Button, Container, Flex, HStack, Link as ChakraLink } from "@chakra-ui/react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import NextLink from "next/link";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <Box as="header" position="sticky" top={0} zIndex={50} backdropFilter="blur(4px)" bg="bg" borderBottomWidth="1px" borderColor="accent">
      <Container>
        <Flex py={4} align="center" justify="space-between">
          <ChakraLink href="#top" aria-label="Rent1T home" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="bold">Rent1T</ChakraLink>
          <HStack gap={6} display={{ base: "none", md: "flex" }} color="text" fontSize="lg">
            <ChakraLink href="#browse">Browse</ChakraLink>
            <ChakraLink href="#how">How it Works</ChakraLink>
            <ChakraLink href="#owners">For Owners</ChakraLink>
            <ChakraLink href="#help">Help</ChakraLink>
          </HStack>
          <HStack gap={3} display={{ base: "none", md: "flex" }}>
            <ThemeToggle />
            <NextLink href="/signup" passHref legacyBehavior><Button as="a" className="button">Sign in</Button></NextLink>
            <Button className="button">List your item</Button>
          </HStack>
          <Button aria-label="Open menu" display={{ base: "inline-flex", md: "none" }} onClick={() => setOpen(true)} variant="ghost">
            ☰
          </Button>
        </Flex>
        {open && (
          <Box pb={4} display={{ md: "none" }}>
            <Flex direction="column" gap={3}>
              <Flex justify="flex-end">
                <Button aria-label="Close menu" onClick={() => setOpen(false)} variant="ghost">✕</Button>
              </Flex>
              <ChakraLink href="#browse" onClick={() => setOpen(false)}>Browse</ChakraLink>
              <ChakraLink href="#how" onClick={() => setOpen(false)}>How it Works</ChakraLink>
              <ChakraLink href="#owners" onClick={() => setOpen(false)}>For Owners</ChakraLink>
              <ChakraLink href="#help" onClick={() => setOpen(false)}>Help</ChakraLink>
              <Flex gap={3} pt={2}>
                <ThemeToggle />
                <NextLink href="/signup" passHref legacyBehavior><Button as="a" className="button">Sign in</Button></NextLink>
                <Button className="button">List your item</Button>
              </Flex>
            </Flex>
          </Box>
        )}
      </Container>
    </Box>
  );
}


