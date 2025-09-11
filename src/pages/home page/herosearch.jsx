import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Container, Box, Heading, Input, Button, SimpleGrid, HStack, IconButton, Grid, GridItem, Text } from "@chakra-ui/react";

function CalendarPortal({ children, onClose }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
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

function RangeCalendar({ fromDate, toDate, setFromDate, setToDate, onApply, onClose, onReset }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const start = new Date(year, month, 1);
  const startDay = start.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const fmt = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const isSelected = (d) => {
    if (!fromDate && !toDate) return false;
    const s = fromDate ? new Date(fromDate).getTime() : NaN;
    const e = toDate ? new Date(toDate).getTime() : NaN;
    const x = d.getTime();
    if (!isNaN(s) && isNaN(e)) return x === s;
    if (!isNaN(s) && !isNaN(e)) return x >= s && x <= e;
    return false;
  };

  const onPick = (d) => {
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

export default function HeroSearch() {
  const [what, setWhat] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [dates, setDates] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [calOpen, setCalOpen] = useState(false);

  const whatOptions = ["Homes", "Cars", "Cameras", "Tools", "Yachts", "Boats", "Events", "Office"];
  const onSubmit = (e) => { e.preventDefault(); alert("Demo search submitted"); };

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
              <div className="search-field__wrap">
                <Input className="search-field" id="what" list="what-list" placeholder="What" value={what} onChange={(e)=>setWhat(e.target.value)} aria-describedby="what-help" />
              </div>
              <datalist id="what-list">
                {whatOptions.map((opt) => (<option key={opt} value={opt} />))}
              </datalist>
            </Box>
            <Box position="relative">
              <div className="search-field__wrap">
                <Input className="search-field" id="dates" placeholder="Dates" value={dates} readOnly onClick={() => setCalOpen(true)} />
              </div>
              {calOpen && (
                <CalendarPortal onClose={() => setCalOpen(false)}>
                  <RangeCalendar
                    fromDate={fromDate}
                    toDate={toDate}
                    setFromDate={setFromDate}
                    setToDate={setToDate}
                    onApply={() => { setDates(fromDate && toDate ? `${fromDate} – ${toDate}` : fromDate || toDate); setCalOpen(false); }}
                    onClose={() => setCalOpen(false)}
                    onReset={() => setDates("")}
                  />
                </CalendarPortal>
              )}
            </Box>
            <HStack>
              <div className="search-field__wrap">
                <Input className="search-field" id="priceMin" inputMode="numeric" pattern="[0-9]*" placeholder="Min $" value={priceMin} onChange={(e)=>setPriceMin(e.target.value)} />
              </div>
              <div className="search-field__wrap">
                <Input className="search-field" id="priceMax" inputMode="numeric" pattern="[0-9]*" placeholder="Max $" value={priceMax} onChange={(e)=>setPriceMax(e.target.value)} />
              </div>
            </HStack>
            <Button className="button" type="submit">Search</Button>
          </SimpleGrid>
        </Box>
      </Container>
    </section>
  );
}