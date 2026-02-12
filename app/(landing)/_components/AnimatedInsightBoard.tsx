"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useMemo, useState } from "react";

import styles from "../landing.module.css";

const insightLines = [
  "Best expectancy appears in first 90 minutes.",
  "Loss clusters spike after third consecutive trade.",
  "A+ setups outperform average entries by 1.8R.",
];

export default function AnimatedInsightBoard() {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const gradientId = useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion();

  const currentLine = useMemo(() => insightLines[lineIndex], [lineIndex]);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const isComplete = charIndex >= currentLine.length;

    const timer = window.setTimeout(
      () => {
        if (isComplete) {
          setCharIndex(0);
          setLineIndex((prev) => (prev + 1) % insightLines.length);
          return;
        }

        setCharIndex((prev) => prev + 1);
      },
      isComplete ? 1250 : 34,
    );

    return () => window.clearTimeout(timer);
  }, [charIndex, currentLine, reduceMotion]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#080c12] p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">
          Equity Curve
        </p>
        <p className={`${styles.mono} text-xs text-emerald-300`}>
          +12.7% this month
        </p>
      </div>

      <div className="relative">
        <svg viewBox="0 0 420 170" className="h-[170px] w-full">
          <defs>
            <linearGradient id={`${gradientId}-line`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6bf4c0" />
              <stop offset="100%" stopColor="#8dc5ff" />
            </linearGradient>
            <linearGradient id={`${gradientId}-fill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6bf4c0" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#6bf4c0" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d="M0 140 C40 120 55 122 90 98 C130 68 150 78 190 66 C230 53 250 42 290 38 C330 34 355 10 420 18 L420 170 L0 170 Z"
            fill={`url(#${gradientId}-fill)`}
          />
          <path
            d="M0 140 C40 120 55 122 90 98 C130 68 150 78 190 66 C230 53 250 42 290 38 C330 34 355 10 420 18"
            fill="none"
            stroke="rgba(90,110,140,0.45)"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <motion.path
            d="M0 140 C40 120 55 122 90 98 C130 68 150 78 190 66 C230 53 250 42 290 38 C330 34 355 10 420 18"
            fill="none"
            stroke={`url(#${gradientId}-line)`}
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0.6 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: reduceMotion ? 0 : 2.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
          <motion.circle
            r="5"
            fill="#9bd6ff"
            stroke="#041018"
            strokeWidth="1.5"
            animate={{
              cx: [0, 90, 190, 290, 420],
              cy: [140, 98, 66, 38, 18],
              scale: [0.9, 1.05, 1, 1.05, 1],
            }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: 6,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                  }
            }
          />
        </svg>

        <motion.div
          className={styles.scanLine}
          animate={reduceMotion ? { y: 6 } : { y: [160, 6] }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 3.8, ease: "linear", repeat: Number.POSITIVE_INFINITY }
          }
        />
      </div>

      <div className="mt-3 grid grid-cols-5 gap-2">
        {[36, 44, 58, 63, 79].map((height, index) => (
          <motion.div
            key={height}
            className={styles.volumeBarLive}
            style={{ height: `${height}%` }}
            animate={{ scaleY: [0.4, 1, 0.58, 1], opacity: [0.4, 1, 0.55, 1] }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: 2.4,
                    delay: index * 0.14,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }
            }
          />
        ))}
      </div>

      <p className="mt-3 rounded-xl border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-xs text-emerald-100">
        {reduceMotion ? currentLine : currentLine.slice(0, charIndex)}
        <span className={styles.typeCursor} aria-hidden>
          |
        </span>
      </p>
    </div>
  );
}
