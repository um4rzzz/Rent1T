import React, { useMemo, useState } from "react";
import { Container, Box, Heading, SimpleGrid, HStack, Button } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

export default function FeaturedListings() {
  const [openId, setOpenId] = useState(null);
  const listings = useMemo(() => [
    { id: 1, title: "Cozy studio in downtown", price: 95, location: "Austin, TX", rating: 4.9, instant: true },
    { id: 2, title: "Canon R6 kit with lenses", price: 45, location: "Seattle, WA", rating: 4.8 },
    { id: 3, title: "Tesla Model Y Performance", price: 140, location: "San Jose, CA", rating: 4.7, instant: true },
  ], []);
  return (
    <section aria-label="Featured listings">
      <Container py={{ base: 8, md: 12 }}>
        <Heading as="h2" size="lg" fontWeight="semibold">Featured listings</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={{ base: 6, md: 8 }} mt={6}>
          {listings.map((l) => (
            <Box as="button" className="no-phase" key={l.id} textAlign="left" onClick={() => setOpenId(l.id)} borderWidth="1px" borderRadius="2xl" bg="surface" overflow="hidden" _hover={{ transform: "translateY(-4px)" }} transition="all 0.15s ease" aria-label={`Open details for ${l.title}`}>
              <Box aria-hidden w="full" pt="75%" bg="accent" opacity={0.1} />
              <Box p={4}>
                <HStack gap={2}>
                  <Heading as="h3" size="md" fontWeight="medium">{l.title}</Heading>
                  {l.instant && (<Box ml="auto" as="span" bg="accent" color="#0B1410" borderRadius="full" px={2} fontSize="xs">Instant book</Box>)}
                </HStack>
                <HStack mt={2} opacity={0.8} gap={3}>
                  <Box as="span">${l.price}/day</Box>
                  <Box as="span">{l.location}</Box>
                  <Box as="span" aria-label={`Rating ${l.rating} out of 5`}>★ {l.rating}</Box>
                </HStack>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
        <AnimatePresence>
          {openId !== null && (
            <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div role="dialog" aria-modal="true" aria-label="Listing details" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} className="w-full max-w-lg rounded-2xl bg-[var(--bg)] p-5 shadow-xl">
                <div className="aspect-[16/9] w-full skeleton rounded-xl" aria-hidden />
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">Quick preview</h3>
                    <p className="text-md opacity-80">Seamless path to booking—this is a stubbed demo modal.</p>
                  </div>
                  <button className="focus-ring p-2 rounded" aria-label="Close" onClick={() => setOpenId(null)}>✕</button>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button className="button focus-ring px-4 py-2 rounded-lg border">Share</button>
                  <Button className="button h-11 px-6 rounded-full bg-[var(--brand)] text-black hover:bg-[var(--brand-600)]">Continue to book</Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </section>
  );
}


