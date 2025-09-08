import { Box, Button, Container, Flex, HStack, Link } from "@chakra-ui/react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <Box as="header" position="sticky" top={0} zIndex={50} backdropFilter="blur(4px)" bg="bg" borderBottomWidth="1px" borderColor="accent">
      <Container>
        <Flex py={4} align="center" justify="space-between">
          <Link href="#top" aria-label="Rent1T home" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="bold">Rent1T</Link>
          <HStack gap={6} display={{ base: "none", md: "flex" }} color="text" fontSize="lg">
            <Link href="#browse">Browse</Link>
            <Link href="#how">How it Works</Link>
            <Link href="#owners">For Owners</Link>
            <Link href="#help">Help</Link>
          </HStack>
          <HStack gap={3} display={{ base: "none", md: "flex" }}>
            <ThemeToggle />
            <Button bg="#0B0B0C" color="#FFFFFF" _hover={{ boxShadow: "0 0 0 2px #0B0B0C", transform: "translateY(-1px)" }}>Sign in</Button>
            <Button bg="#0B0B0C" color="#FFFFFF" _hover={{ boxShadow: "0 0 0 2px #0B0B0C", transform: "translateY(-1px)" }}>List your item</Button>
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
              <Link href="#browse" onClick={() => setOpen(false)}>Browse</Link>
              <Link href="#how" onClick={() => setOpen(false)}>How it Works</Link>
              <Link href="#owners" onClick={() => setOpen(false)}>For Owners</Link>
              <Link href="#help" onClick={() => setOpen(false)}>Help</Link>
              <Flex gap={3} pt={2}>
                <ThemeToggle />
                <Button bg="#0B0B0C" color="#FFFFFF" _hover={{ boxShadow: "0 0 0 2px #0B0B0C", transform: "translateY(-1px)" }}>Sign in</Button>
                <Button bg="#0B0B0C" color="#FFFFFF" _hover={{ boxShadow: "0 0 0 2px #0B0B0C", transform: "translateY(-1px)" }}>List your item</Button>
              </Flex>
            </Flex>
          </Box>
        )}
      </Container>
    </Box>
  );
}


