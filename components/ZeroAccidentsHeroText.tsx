"use client";

import React, { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const WORDS = [
  { word: "ZERO", letters: ["Z", "E", "R", "O"] },
  {
    word: "ACCIDENTS.",
    letters: ["A", "C", "C", "I", "D", "E", "N", "T", "S", "."],
  },
];

export const ZeroAccidentsHeroText = memo(function ZeroAccidentsHeroText() {
  const shouldReduceMotion = useReducedMotion();

  // Letter entrance animation: clip reveal rising ~35px with staggered ease-out
  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 35,
    },
    visible: (customIndex: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.52,
        delay: 0.08 + customIndex * 0.026,
        // Premium weighted ease-out (smooth deceleration into solid stop)
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  // Subtle post-reveal ink shimmer pass (runs once, ~380ms)
  const shimmerVariants = {
    hidden: {
      opacity: 1,
    },
    visible: {
      opacity: [1, 1, 0.82, 1],
      transition: {
        times: [0, 0.72, 0.86, 1],
        duration: 1.35,
        ease: "easeInOut",
      },
    },
  };

  let letterCounter = 0;

  return (
    <span className="inline-block relative">
      {/* Accessible screen reader text */}
      <span className="sr-only">ZERO ACCIDENTS.</span>

      {/* Visual kinetic typography presentation */}
      <motion.span
        aria-hidden="true"
        className="inline-block"
        variants={shouldReduceMotion ? undefined : shimmerVariants}
        initial={shouldReduceMotion ? false : "hidden"}
        animate={shouldReduceMotion ? false : "visible"}
      >
        {WORDS.map((item, wordIdx) => {
          return (
            <React.Fragment key={item.word}>
              <span className="inline-block whitespace-nowrap overflow-hidden align-bottom pb-[0.06em] -mb-[0.06em]">
                {item.letters.map((char, charIdx) => {
                  const currentIndex = letterCounter++;
                  return (
                    <motion.span
                      key={`${item.word}-${charIdx}-${char}`}
                      className="inline-block"
                      custom={currentIndex}
                      variants={shouldReduceMotion ? undefined : letterVariants}
                      initial={shouldReduceMotion ? false : "hidden"}
                      animate={shouldReduceMotion ? false : "visible"}
                    >
                      {char}
                    </motion.span>
                  );
                })}
              </span>
              {wordIdx < WORDS.length - 1 && (
                <span className="inline-block select-none">{"\u00A0"}</span>
              )}
            </React.Fragment>
          );
        })}
      </motion.span>
    </span>
  );
});
