import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Container, Box, Heading, HStack, IconButton } from "@chakra-ui/react";

export default function CategoryGrid() {
  const items = useMemo(() => ([
    { name: "Cars", count: "2,400+" },
    { name: "Homes", count: "1,100+" },
    { name: "Cameras", count: "900+" },
    { name: "Tools", count: "1,800+" },
    { name: "Events", count: "300+" },
    { name: "Boats", count: "120+" },
    { name: "Office", count: "400+" },
    { name: "Furniture", count: "2,000+" },
  ]), []);

  const [index, setIndex] = useState(0);
  const wheelLockRef = useRef(0);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const containerRef = useRef(null);
  const [radius, setRadius] = useState(140);
  const [center, setCenter] = useState({ cx: 0, cy: 0 });
  const [cardSize, setCardSize] = useState({ w: 280, h: 162 });
  const V = 0.26; // slight vertical sway for horizontal wheel

  const clampIndex = useCallback((i) => {
    const len = items.length;
    return ((i % len) + len) % len;
  }, [items.length]);

  const prev = useCallback(() => setIndex((i) => clampIndex(i - 1)), [clampIndex]);
  const next = useCallback(() => setIndex((i) => clampIndex(i + 1)), [clampIndex]);

  // Auto-rotation every 4s
  useEffect(() => {
    const id = setInterval(() => { next(); }, 4000);
    return () => clearInterval(id);
  }, [next]);

  // Measure container for radius/center and deterministic card size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      // deterministic card sizing
      const cardW = Math.round(Math.max(240, Math.min(rect.width * 0.28, 360)));
      const cardH = Math.round(cardW * 0.58);
      setCardSize({ w: cardW, h: cardH });
      // radius to avoid overlap: R >= max(rBase, 1.9 * cardW)
      const rBase = Math.min(rect.width, rect.height) * 0.45;
      const rNeeded = 1.9 * cardW;
      const R = Math.max(rBase, rNeeded);
      // center with clearance so top card never clips
      let cx = rect.width / 2;
      let cy = rect.height / 2;
      const topY = cy - R * V; // highest y of the arc
      const paddingTop = 24;
      if (topY - cardH / 2 < paddingTop) {
        cy = paddingTop + cardH / 2 + R * V;
      }
      setRadius(R);
      setCenter({ cx, cy });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Wheel / trackpad controls (prefer horizontal, fallback vertical)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      const now = Date.now();
      if (now - wheelLockRef.current < 350) return;
      wheelLockRef.current = now;
      const hasDX = Math.abs(e.deltaX) >= Math.abs(e.deltaY);
      const dir = hasDX ? e.deltaX : e.deltaY;
      if (dir > 0) next(); else if (dir < 0) prev();
    };
    el.addEventListener("wheel", onWheel, { passive: true });
    return () => el.removeEventListener("wheel", onWheel);
  }, [next, prev]);

  // Touch swipe (horizontal)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const touchStartX = { current: 0 };
    const touchDeltaX = { current: 0 };
    const onStart = (e) => { touchStartX.current = e.touches[0].clientX; touchDeltaX.current = 0; };
    const onMove = (e) => { touchDeltaX.current = e.touches[0].clientX - touchStartX.current; };
    const onEnd = () => {
      const dx = touchDeltaX.current;
      if (Math.abs(dx) > 40) { if (dx < 0) next(); else prev(); }
      touchStartX.current = 0; touchDeltaX.current = 0;
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
    };
  }, [next, prev]);

  const step = (Math.PI * 2) / items.length;
  // Horizontal rotation angle with -90° bias so center sits at top
  const rotationAngle = -index * step - Math.PI / 2;

  // Determine strictly three visible indices: left, center, right
  const leftIdx = clampIndex(index - 1);
  const centerIdx = clampIndex(index);
  const rightIdx = clampIndex(index + 1);

  const cardFor = (c, i) => {
    const isCenter = i === centerIdx;
    const isLeft = i === leftIdx;
    const isRight = i === rightIdx;
    const isVisible = isCenter || isLeft || isRight;

    // Visible fixed angles: left=-60°, center=0°, right=+60° (from top)
    let angle;
    if (isCenter) angle = -Math.PI / 2; // top (0°)
    else if (isLeft) angle = -Math.PI / 2 - Math.PI / 3; // -60° from top
    else if (isRight) angle = -Math.PI / 2 + Math.PI / 3; // +60° from top
    else return null;

    const x = center.cx + radius * Math.cos(angle);
    const y = center.cy + radius * V * Math.sin(angle);

    // Depth/scale/opacity based on role
    const scale = isCenter ? 1.0 : (isLeft || isRight) ? 0.9 : 0.7;
    const opacity = isVisible ? (isCenter ? 1 : 0.85) : 0;
    const z = isCenter ? 100 : (isLeft || isRight) ? 60 : 0;
    const shadow = isCenter ? "0 10px 22px rgba(0,0,0,.20)" : (isLeft || isRight) ? "0 6px 14px rgba(0,0,0,.14)" : "none";
    const rotate = (Math.cos(angle) * 3).toFixed(2);
    return (
      <Box
        key={c.name}
        position="absolute"
        left={0}
        top={0}
        style={{
          transform: `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${rotate}deg) scale(${scale})`,
          opacity,
          zIndex: z,
          transition: "transform 450ms ease, opacity 450ms ease, filter 450ms ease",
          filter: isCenter ? "none" : (isLeft || isRight) ? "saturate(0.95) brightness(0.99)" : "none",
          pointerEvents: isVisible ? "auto" : "none",
          width: `${cardSize.w}px`,
          height: `${cardSize.h}px`,
        }}
        bg="surface"
        borderRadius="2xl"
        borderWidth="1px"
        overflow="hidden"
        boxShadow={shadow}
        aria-current={isCenter ? "true" : undefined}
      >
        <Box aria-hidden w="100%" h="60%" bg="accent" opacity={0.12} />
        <Box p={4}>
          <HStack justify="space-between">
            <Heading as="h3" size="md" fontWeight="medium">{c.name}</Heading>
            <Box as="span" opacity={0.8}>{c.count} items</Box>
          </HStack>
        </Box>
      </Box>
    );
  };

  return (
    <section id="browse" aria-label="Categories">
      <Container py={{ base: 8, md: 12 }}>
        <Heading as="h2" size="5xl" fontWeight="semibold" mb={4}>
          Explore top categories
        </Heading>
        <Box display={{ base: "grid" }} gridTemplateColumns={{ base: "1fr", lg: "1fr" }} alignItems="start" gap={{ base: 0, lg: 0 }}>
          {/* Single centered column for the wheel */}
          <Box justifySelf={{ base: "stretch", lg: "center" }} w="full" maxW={{ base: "100%", lg: "100%" }}>

            {/* Wheel stage constrained to right column */}
            <Box
              ref={containerRef}
              position="relative"
              mt={6}
              height={{ base: "clamp(460px, 52vw, 78vh)", md: "clamp(460px, 52vw, 78vh)" }}
              w="full"
              overflow="hidden"
            >
              <Box position="absolute" inset={0} overflow="visible">
                {cardFor(items[leftIdx], leftIdx)}
                {cardFor(items[centerIdx], centerIdx)}
                {cardFor(items[rightIdx], rightIdx)}
              </Box>

              <HStack position="absolute" insetY={0} justify="space-between" w="full" px={2}>
                <IconButton aria-label="Previous" onClick={prev} borderRadius="full">‹</IconButton>
                <IconButton aria-label="Next" onClick={next} borderRadius="full">›</IconButton>
              </HStack>

              <HStack position="absolute" bottom={2} left="50%" transform="translateX(-50%)" gap={1}>
                {items.map((_, i) => (
                  <Box
                    key={i}
                    as="button"
                    aria-label={`Go to ${i+1}`}
                    onClick={() => setIndex(i)}
                    w={i === index ? 3 : 2}
                    h={i === index ? 3 : 2}
                    borderRadius="full"
                    bg={i === index ? "accent" : "muted"}
                    opacity={i === index ? 1 : 0.6}
                  />
                ))}
              </HStack>
            </Box>
          </Box>
        </Box>
      </Container>
    </section>
  );
}