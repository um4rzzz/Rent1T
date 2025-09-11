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
  w: number;
  h: number;
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
  const BASELINE_RATIO = 0.82;
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
  const [lineEnds, setLineEnds] = useState<Array<{ x: number; y: number }>>([]);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia && window.matchMedia("(max-width: 640px)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 640px)");
    const handler = () => setIsMobile(mql.matches);
    mql.addEventListener?.("change", handler);
    handler();
    return () => {
      mql.removeEventListener?.("change", handler);
    };
  }, []);

  // measure text positions for multi-line support
  useEffect(() => {
    if (!measureRef.current) return;
    
    const updatePositions = () => {
      const spans = measureRef.current!.querySelectorAll('span[data-char]');
      const positions: TextPosition[] = [];
      
      spans.forEach((span, index) => {
        const rect = span.getBoundingClientRect();
        const containerRect = measureRef.current!.getBoundingClientRect();
        positions.push({
          x: rect.left - containerRect.left,
          y: rect.top - containerRect.top,
          w: rect.width,
          h: rect.height,
          char: span.textContent || '',
          index
        });
      });
      
      setTextPositions(positions);

      // Group into lines by y threshold
      const sorted = [...positions].sort((a, b) => a.y - b.y || a.x - b.x);
      const threshold = 8; // px
      const lines: TextPosition[][] = [];
      sorted.forEach((p) => {
        const current = lines[lines.length - 1];
        if (!current) {
          lines.push([p]);
        } else {
          const y0 = current[0].y;
          if (Math.abs(p.y - y0) <= threshold) {
            current.push(p);
          } else {
            lines.push([p]);
          }
        }
      });

      const ends = lines.map((line) => {
        const last = line[line.length - 1];
        return {
          x: last.x + last.w,
          y: last.y + last.h * BASELINE_RATIO,
        };
      });
      setLineEnds(ends);
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

  // Build mobile 3-line structure when required
  const renderMobile = isMobile;

  // Keyframes for the rolling dot
  let dotInitial = { x: -12, y: 0, rotate: 0 } as { x: number; y: number; rotate: number };
  const dotAnimate = { x: [] as number[], y: [] as number[], rotate: [0, 90, 180, 270, 360, 450, 540, 630, 720] };
  const dotTimes: number[] = [];

  if (textPositions.length > 0) {
    if (renderMobile && lineEnds.length >= 1) {
      const first = textPositions[0];
      const startX = Math.min(...textPositions.map(p => p.x)) - 12;
      const firstBaseline = first.y + first.h * BASELINE_RATIO;
      const y1 = lineEnds[0]?.y ?? firstBaseline;
      const y2 = lineEnds[1]?.y ?? y1;
      const y3 = lineEnds[2]?.y ?? y2;
      const end1X = lineEnds[0]?.x ?? (first.x + first.w);
      const end2X = lineEnds[1]?.x ?? end1X;
      const end3X = lineEnds[2]?.x ?? end2X;

      dotInitial = { x: startX, y: y1, rotate: 0 };
      dotAnimate.x = [startX, end1X, end1X, end2X, end2X, end3X];
      dotAnimate.y = [y1, y1, y2, y2, y3, y3];
      dotTimes.push(0, 0.33, 0.34, 0.66, 0.67, 1);
    } else {
      // Desktop/simple path
      const first = textPositions[0];
      const last = textPositions[textPositions.length - 1];
      const startX = first.x - 12;
      const yStart = first.y + first.h * BASELINE_RATIO;
      const endX = last.x + last.w;
      const yEnd = last.y + last.h * BASELINE_RATIO;
      dotInitial = { x: startX, y: yStart, rotate: 0 };
      dotAnimate.x = [startX, endX];
      dotAnimate.y = [yStart, yEnd];
      dotTimes.push(0, 1);
    }
  }

  return (
    <div ref={rootRef} aria-label={text} style={{ position: "relative", display: "block" }} className={className}>
      <div key={tick} ref={measureRef} style={{ position: "relative" }}>
        {renderMobile ? (
          <div style={{ position: "relative" }}>
            <div style={{ position: "relative" }}>
              {Array.from("Rent").map((ch, i) => (
                <motion.span
                  key={`m1-${i}-${ch}`}
                  data-char
                  initial={{ y: 0 }}
                  animate={{ y: [0, -jumpHeight, 0] }}
                  transition={{ delay: i * stagger, duration: 0.5, ease: "easeOut" }}
                  style={{ display: "inline-block", position: "relative", zIndex: 2 }}
                >
                  {ch}
                </motion.span>
              ))}
            </div>
            <br />
            <div style={{ position: "relative" }}>
              {Array.from("anything,").map((ch, i) => (
                <motion.span
                  key={`m2-${i}-${ch}`}
                  data-char
                  initial={{ y: 0 }}
                  animate={{ y: [0, -jumpHeight, 0] }}
                  transition={{ delay: (i + 6) * stagger, duration: 0.5, ease: "easeOut" }}
                  style={{ display: "inline-block", position: "relative", zIndex: 2 }}
                >
                  {ch}
                </motion.span>
              ))}
            </div>
            <br />
            <div style={{ position: "relative", display: "inline-block" }}>
              {Array.from("anywhere").map((ch, i) => (
                <motion.span
                  key={`m3-${i}-${ch}`}
                  data-char
                  initial={{ y: 0 }}
                  animate={{ y: [0, -jumpHeight, 0] }}
                  transition={{ delay: (i + 16) * stagger, duration: 0.5, ease: "easeOut" }}
                  style={{ display: "inline-block", position: "relative", zIndex: 2 }}
                >
                  {ch}
                </motion.span>
              ))}
              {periodVisible && hasFinalDot && (
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{ display: "inline-block", position: "relative", zIndex: 2 }}
                >
                  .
                </motion.span>
              )}
            </div>
          </div>
        ) : (
          chars.map((ch, i) => (
            <motion.span
              key={i + ch}
              data-char
              initial={{ y: 0 }}
              animate={{ y: [0, -jumpHeight, 0] }}
              transition={{ delay: i * stagger, duration: 0.5, ease: "easeOut" }}
              style={{ 
                display: "inline-block", 
                marginRight: ch === " " ? "0.25ch" : 0,
                position: "relative",
                zIndex: 2,
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          ))
        )}

        {/* Desktop period */}
        {!renderMobile && periodVisible && hasFinalDot && (
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ display: "inline-block", position: "relative", zIndex: 2 }}
          >
            .
          </motion.span>
        )}

        {/* Rolling dot that becomes the period - keyframes and baseline aligned */}
        {showDot && hasFinalDot && textPositions.length > 0 && (
          <motion.div
            initial={dotInitial}
            animate={{ x: dotAnimate.x, y: dotAnimate.y, rotate: dotAnimate.rotate }}
            transition={{ duration: totalDuration, ease: "easeInOut", times: dotTimes }}
            onAnimationComplete={() => {
              setShowDot(false);
              setPeriodVisible(true);
            }}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "0.5em",
              height: "0.5em",
              borderRadius: "50%",
              background: dotColor,
              filter: "drop-shadow(0 2px 6px rgba(0,0,0,.35))",
              pointerEvents: "none",
              transformOrigin: "center",
              transform: "translateZ(0)",
              zIndex: 1,
            }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}

export { RollingDotHeadline };
