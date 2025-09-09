import { Box, Button, Container, Flex, Input, SimpleGrid, Text } from "@chakra-ui/react";
import { useState } from "react";

export function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const emailValid = /.+@.+\..+/.test(email);
  return (
    <Box as="footer" mt={8} borderTopWidth="1px" borderColor="accent">
      <Container>
        <SimpleGrid columns={{ base: 2, sm: 4 }} gap={6} py={10}>
          <Box>
            <Text fontWeight="medium">Explore</Text>
            <Flex direction="column" gap={1} mt={2} opacity={0.8} fontSize="lg">
              <a href="#browse">Categories</a>
              <a href="#">Top cities</a>
              <a href="#">New</a>
            </Flex>
          </Box>
          <Box>
            <Text fontWeight="medium">Help</Text>
            <Flex id="help" direction="column" gap={1} mt={2} opacity={0.8} fontSize="lg">
              <a href="#">Support</a>
              <a href="#">Safety</a>
              <a href="#">Cancellation</a>
            </Flex>
          </Box>
          <Box>
            <Text fontWeight="medium">Company</Text>
            <Flex direction="column" gap={1} mt={2} opacity={0.8} fontSize="lg">
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="#">Press</a>
            </Flex>
          </Box>
          <Box>
            <Text fontWeight="medium">Legal</Text>
            <Flex direction="column" gap={1} mt={2} opacity={0.8} fontSize="lg">
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
              <a href="#">Licenses</a>
            </Flex>
          </Box>
        </SimpleGrid>
        <Flex py={6} gap={4} direction={{ base: "column", md: "row" }} align={{ md: "center" }} justify={{ md: "space-between" }}>
          <Flex as="form" gap={2} onSubmit={(e) => { e.preventDefault(); if (emailValid) alert("Thanks! (demo)"); }}>
            <Input aria-label="Email address" placeholder="Email for updates" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <Button className="button" type="submit" disabled={!emailValid}>Subscribe</Button>
          </Flex>
          <Flex gap={3} opacity={0.8} fontSize="lg">
            <select aria-label="Language" style={{ height: 44, padding: "0 8px", borderRadius: 6, background: "transparent" }}>
              <option>English</option>
            </select>
            <select aria-label="Currency" style={{ height: 44, padding: "0 8px", borderRadius: 6, background: "transparent" }}>
              <option>USD</option>
            </select>
            <Text ml="auto">© {year} Rent1T</Text>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}


