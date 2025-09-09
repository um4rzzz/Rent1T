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

  const [width, setWidth] = useState(0);
  const [tick, setTick] = useState(0);      // remount key for restart
  const [periodVisible, setPeriodVisible] = useState(!hasFinalDot); // if no dot requested, show immediately
  const [showDot, setShowDot] = useState(hasFinalDot);              // only show rolling dot if we have a final dot

  // measure text width
  useEffect(() => {
    if (!measureRef.current) return;
    const update = () => setWidth(measureRef.current!.getBoundingClientRect().width);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(measureRef.current);
    return () => ro.disconnect();
  }, [baseText]);

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
      <span aria-label={text} style={{ whiteSpace: "nowrap" }} className={className}>
        {text}
      </span>
    );
  }

  return (
    <div ref={rootRef} aria-label={text} style={{ position: "relative", display: "inline-block" }} className={className}>
      <div key={tick} ref={measureRef} style={{ position: "relative", whiteSpace: "nowrap" }}>
        {chars.map((ch, i) => (
          <motion.span
            key={i + ch}
            initial={{ y: 0 }}
            animate={{ y: [0, -jumpHeight, 0] }}
            transition={{ delay: i * stagger, duration: 0.5, ease: "easeOut" }}
            style={{ display: "inline-block", marginRight: ch === " " ? "0.25ch" : 0 }}
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
            style={{ display: "inline-block" }}
          >
            .
          </motion.span>
        )}

        {/* Rolling dot that becomes the period */}
        {showDot && hasFinalDot && (
          <motion.div
            initial={{ x: -12, rotate: 0 }}
            animate={{ x: width, rotate: 720 }}
            transition={{ duration: totalDuration, ease: "easeInOut" }}
            onAnimationComplete={() => {
              setShowDot(false);      // hide dot
              setPeriodVisible(true); // show period at the end
            }}
            style={{
              position: "absolute",
              left: 0,
              bottom: -8,            // tweak to sit just under baseline
              width: "0.5em",
              height: "0.5em",
              borderRadius: "50%",
              background: dotColor,
              filter: "drop-shadow(0 2px 6px rgba(0,0,0,.35))",
              pointerEvents: "none",
            }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}

export { RollingDotHeadline };
