import { useMemo, useState, useEffect } from "react";
 
import { Container, Box, Heading, Input, Button, SimpleGrid, HStack, IconButton, Grid, GridItem, Text } from "@chakra-ui/react";
import { createPortal } from "react-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeSync } from "@/components/ThemeSync";

 

function HeroSearch() {
  const [what, setWhat] = useState("");
  
  const [dates, setDates] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [calOpen, setCalOpen] = useState(false);

  function CalendarPortal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
      setMounted(true);
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden"; // scroll lock
      const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
      window.addEventListener("keydown", onKey);
      return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
    }, [onClose]);
    if (!mounted) return null;
    return createPortal(
      <Box position="fixed" inset={0} zIndex={3000} onClick={onClose}>
        <Box position="absolute" inset={0} bg="blackAlpha.400" />
        <Box position="relative" display="flex" alignItems="flex-start" justifyContent="center" pt={{ base: 24, md: 32 }}>
          <Box role="dialog" aria-modal="true" bg="surface" borderWidth="1px" p={3} borderRadius="lg" boxShadow="2xl" onClick={(e)=>e.stopPropagation()} tabIndex={-1}>
            {children}
          </Box>
        </Box>
      </Box>,
      document.body
    );
  }

  function RangeCalendar({ onApply, onClose, onReset }: { onApply: () => void; onClose: () => void; onReset: () => void }) {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth()); // 0-11

    const start = new Date(year, month, 1);
    const startDay = start.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);

    const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const isSelected = (d: Date) => {
      if (!fromDate && !toDate) return false;
      const s = fromDate ? new Date(fromDate).getTime() : NaN;
      const e = toDate ? new Date(toDate).getTime() : NaN;
      const x = d.getTime();
      if (!isNaN(s) && isNaN(e)) return x === s;
      if (!isNaN(s) && !isNaN(e)) return x >= s && x <= e;
      return false;
    };

    const onPick = (d: Date) => {
      if (!fromDate || (fromDate && toDate)) {
        setFromDate(fmt(d));
        setToDate("");
      } else {
        const s = new Date(fromDate);
        if (d < s) {
          setToDate(fromDate);
          setFromDate(fmt(d));
        } else {
          setToDate(fmt(d));
        }
      }
    };

    return (
      <Box>
        <HStack justify="space-between" mb={2}>
          <IconButton className="calendar-button" aria-label="Prev" size="sm" onClick={() => setMonth((m) => (m === 0 ? (setYear(year - 1), 11) : m - 1))}>‹</IconButton>
          <Text fontWeight="medium">{start.toLocaleString(undefined, { month: "long", year: "numeric" })}</Text>
          <IconButton className="calendar-button" aria-label="Next" size="sm" onClick={() => setMonth((m) => (m === 11 ? (setYear(year + 1), 0) : m + 1))}>›</IconButton>
        </HStack>
        <Grid templateColumns="repeat(7, 1fr)" gap={1}>
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map((d) => (
            <GridItem key={d} textAlign="center" fontSize="sm" opacity={0.6}>{d}</GridItem>
          ))}
          {cells.map((cell, i) => (
            <GridItem key={i}>
              {cell ? (
                <Button className="calendar-button" variant="ghost" w="100%" h={9} onClick={() => onPick(cell)} bg={isSelected(cell) ? "accent" : undefined} color={isSelected(cell) ? "#0B0B0C" : undefined}>
                  {cell.getDate()}
                </Button>
              ) : (
                <Box h={9} />
              )}
            </GridItem>
          ))}
        </Grid>
        <HStack mt={3} justify="center" gap={2}>
          <Button className="calendar-button" size="sm" variant="outline" onClick={() => { setFromDate(""); setToDate(""); onReset(); }}>Reset</Button>
          <Button className="calendar-button" size="sm" variant="ghost" onClick={onClose}>Close</Button>
          <Button className="calendar-button" size="sm" onClick={onApply}>Apply</Button>
        </HStack>
      </Box>
    );
  }
  
  const onSubmit = (e: React.FormEvent) => { e.preventDefault(); alert("Demo search submitted"); };
  return (
    <section aria-label="Hero">
      <Box position="absolute" inset={0} zIndex={-10}>
        <Box h="64svh" minH="420px" w="full" overflow="hidden" borderBottomRadius="28px">
          <Box h="full" w="full" bg="surface" />
        </Box>
      </Box>
      <Container py={{ base: 8, md: 12 }}>
        <Heading as="h1" size="7xl" fontWeight="extrabold">
          Rent anything, anywhere.
        </Heading>
        <Box as="form" onSubmit={onSubmit} bg="surface" p={{ base: 4, md: 6 }} borderRadius="2xl" borderWidth="1px" backdropFilter="blur(4px)">
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 5 }} gap={4}>
            <Box gridColumn={{ lg: "span 2" }}>
              <Input id="what" list="what-list" placeholder="What" value={what} onChange={(e)=>setWhat(e.target.value)} aria-describedby="what-help" />
              
            </Box>
            <Box position="relative">
              <Input id="dates" placeholder="Dates" value={dates} readOnly onClick={() => setCalOpen(true)} />
              {calOpen && (
                <CalendarPortal onClose={() => setCalOpen(false)}>
                  <RangeCalendar
                    onApply={() => { setDates(fromDate && toDate ? `${fromDate} – ${toDate}` : fromDate || toDate); setCalOpen(false); }}
                    onClose={() => setCalOpen(false)}
                    onReset={() => setDates("")}
                  />
                </CalendarPortal>
              )}
            </Box>
            
            <Button className="button" type="submit">Search</Button>
          </SimpleGrid>
        </Box>
        {/* trust badges removed per request */}
      </Container>
    </section>
  );
}

function CategoryGrid() {
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
        <Heading as="h2" size="lg" fontWeight="semibold">Explore top categories</Heading>
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

type Listing = { id: number; title: string; price: number; location: string; rating: number; instant?: boolean };

function FeaturedListings() {
  const [openId, setOpenId] = useState<number | null>(null);
  const listings: Listing[] = useMemo(() => [
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
        
      </Container>
    </section>
  );
}

function PrimaryCTABand() {
  return (
    <section aria-label="Call to action">
      <Container py={{ base: 10, md: 14 }}>
        <Box borderRadius="2xl" bg="accent" color={{ base: "#0B0B0C", _dark: "#FFFFFF" }} p={{ base: 6, md: 8 }} display="flex" flexDir={{ base: "column", md: "row" }} alignItems="center" justifyContent="space-between" gap={4}>
          <Box>
            <Heading as="h3" size="lg" fontWeight="semibold" color={{ base: "#0B0B0C", _dark: "#FFFFFF" }}>Ready to rent smarter?</Heading>
            <Box as="p" fontSize="lg" opacity={0.9} color={{ base: "#0B0B0C", _dark: "#FFFFFF" }}>Join thousands of happy renters and owners today.</Box>
          </Box>
          <Button className="button">Get started</Button>
        </Box>
      </Container>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div id="top" className="min-h-screen">
      <ThemeSync />
      <Header />
      <main>
        <HeroSearch />
        <CategoryGrid />
        <FeaturedListings />
        <PrimaryCTABand />
      </main>
      <Footer />
    </div>
  );
}
