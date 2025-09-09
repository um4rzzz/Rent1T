"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

type Props = {
  text: string;              // e.g. "Rent anything, anywhere."
  dotColor?: string;         // default currentColor
  jumpHeight?: number;       // px
  stagger?: number;          // seconds
  replayOnView?: boolean;    // default true
  inViewAmount?: number;     // default 0.6
  className?: string;        // additional CSS classes
};

interface TextPosition {
  x: number;
  y: number;
  char: string;
  index: number;
}

export default function RollingDotHeadline({
  text,
  dotColor = "currentColor",
  jumpHeight = 14,
  stagger = 0.08,
  replayOnView = true,
  inViewAmount = 0.6,
  className = "",
}: Props) {
  const hasFinalDot = text.trim().endsWith(".");
  const baseText = useMemo(
    () => (hasFinalDot ? text.trim().slice(0, -1) : text),
    [text, hasFinalDot]
  );
  const chars = useMemo(() => Array.from(baseText), [baseText]);

  const rootRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: inViewAmount, margin: "0px 0px -10% 0px" });

  const [textPositions, setTextPositions] = useState<TextPosition[]>([]);
  const [tick, setTick] = useState(0);      // remount key for restart
  const [periodVisible, setPeriodVisible] = useState(!hasFinalDot); // if no dot requested, show immediately
  const [showDot, setShowDot] = useState(hasFinalDot);              // only show rolling dot if we have a final dot

  // measure text positions for multi-line support
  useEffect(() => {
    if (!measureRef.current) return;
    
    const updatePositions = () => {
      const spans = measureRef.current!.querySelectorAll('span');
      const positions: TextPosition[] = [];
      
      spans.forEach((span, index) => {
        const rect = span.getBoundingClientRect();
        const containerRect = measureRef.current!.getBoundingClientRect();
        positions.push({
          x: rect.left - containerRect.left,
          y: rect.top - containerRect.top,
          char: span.textContent || '',
          index
        });
      });
      
      setTextPositions(positions);
    };
    
    // Wait for layout to settle
    const timeoutId = setTimeout(updatePositions, 100);
    const ro = new ResizeObserver(() => {
      setTimeout(updatePositions, 50);
    });
    
    ro.observe(measureRef.current);
    return () => {
      clearTimeout(timeoutId);
      ro.disconnect();
    };
  }, [baseText, tick]);

  // replay on view
  useEffect(() => {
    if (!replayOnView || !hasFinalDot) return;
    if (inView) {
      setPeriodVisible(false);
      setShowDot(true);
      setTick((t) => t + 1); // restart animations
    }
  }, [inView, replayOnView, hasFinalDot]);

  // durations
  const totalDuration = Math.max(0.6, chars.length * stagger + 0.4);

  // reduced motion: render final state
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    return (
      <span aria-label={text} className={className}>
        {text}
      </span>
    );
  }

  return (
    <div ref={rootRef} aria-label={text} style={{ position: "relative", display: "block" }} className={className}>
      <div key={tick} ref={measureRef} style={{ position: "relative" }}>
        {chars.map((ch, i) => (
          <motion.span
            key={i + ch}
            initial={{ y: 0 }}
            animate={{ y: [0, -jumpHeight, 0] }}
            transition={{ delay: i * stagger, duration: 0.5, ease: "easeOut" }}
            style={{ 
              display: "inline-block", 
              marginRight: ch === " " ? "0.25ch" : 0,
              position: "relative",
              zIndex: 2, // Text above the dot
            }}
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        ))}

        {/* The period appears only after the rolling dot finishes */}
        {periodVisible && hasFinalDot && (
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ 
              display: "inline-block",
              position: "relative",
              zIndex: 2, // Period above the dot
            }}
          >
            .
          </motion.span>
        )}

        {/* Rolling dot that becomes the period - follows staircase path */}
        {showDot && hasFinalDot && textPositions.length > 0 && (
          <motion.div
            initial={{ 
              x: textPositions[0]?.x - 12 || -12, 
              y: textPositions[0]?.y + 20 || 20, 
              rotate: 0 
            }}
            animate={{ 
              x: textPositions[textPositions.length - 1]?.x + 8 || 0,
              y: textPositions[textPositions.length - 1]?.y + 20 || 20,
              rotate: 720 
            }}
            transition={{ 
              duration: totalDuration, 
              ease: "easeInOut",
              times: textPositions.map((_, i) => i / (textPositions.length - 1))
            }}
            onAnimationComplete={() => {
              setShowDot(false);      // hide dot
              setPeriodVisible(true); // show period at the end
            }}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "0.5em",
              height: "0.5em",
              borderRadius: "50%",
              background: "#ffffff", // White dot
              border: "2px solid #000000", // Black border for visibility
              filter: "drop-shadow(0 2px 6px rgba(0,0,0,.5))",
              pointerEvents: "none",
              transformOrigin: "center",
              zIndex: -1, // Put dot behind text
            }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}

export { RollingDotHeadline };
