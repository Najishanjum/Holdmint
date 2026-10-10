"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface HowItWorksStepsProps {
  headlineText?: string;
  subtitleText?: string;
}

const STEPS_DATA = [
  {
    step: "01",
    stepBadgeClass: "bg-[#050505] text-white",
    title: "CONNECT & CHOOSE SPLIT",
    description:
      "Connect your Solana wallet and configure your Spend, Tax, and Savings percentages. Designate your worker-approved tax payee address.",
  },
  {
    step: "02",
    stepBadgeClass: "bg-[#E8FF00] text-[#050505] border-2 border-[#050505]",
    title: "SHARE INVOICE LINK OR INBOX",
    description:
      "Send clients a clean payment link with QR code, or share your designated Program-Derived Inbox token account for direct transfers.",
  },
  {
    step: "03",
    stepBadgeClass: "bg-[#5919F6] text-white",
    title: "AUTOMATED ATOMIC ROUTING",
    description:
      "Incoming USDC is automatically separated into Spend, locked Tax, and time-locked Savings vaults before you even have a chance to spend it.",
  },
];

export function HowItWorksSteps({
  headlineText = "THREE STEPS. ENFORCED AT THE SOURCE.",
  subtitleText = "Non-custodial Solana engineering protecting your quarterly tax liability",
}: HowItWorksStepsProps) {
  const shouldReduceMotion = useReducedMotion();
  const words = headlineText.split(" ");

  // Grid container: controls staggered entrance of the 3 cards
  const gridVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.2,
        delayChildren: shouldReduceMotion ? 0 : 0.15,
      },
    },
  };

  // Card items: rise from below and settle into view one by one on scroll
  const cardVariants = {
    hidden: shouldReduceMotion
      ? { opacity: 1, y: 0 }
      : {
          opacity: 0,
          y: 45,
          scale: 0.97,
        },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="py-20 border-b-2 border-[#050505] bg-[#09090B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header with Word-by-Word Animation */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-14">
          <motion.span
            className="text-xs font-mono font-bold text-[#E8FF00] uppercase tracking-wider inline-block"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            HOW IT WORKS
          </motion.span>

          {/* Word-by-Word Kinetic Headline */}
          <h2 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-white leading-tight">
            {/* Screen reader full text */}
            <span className="sr-only">{headlineText}</span>

            {/* Visual Word-by-Word Spans */}
            <span aria-hidden="true" className="inline-block">
              {words.map((word, idx) => (
                <span
                  key={`${word}-${idx}`}
                  className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em] mr-[0.25em] last:mr-0"
                >
                  <motion.span
                    className="inline-block"
                    initial={shouldReduceMotion ? false : { opacity: 0, y: "115%" }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.52,
                      delay: shouldReduceMotion ? 0 : 0.05 + idx * 0.07,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </span>
          </h2>

          {/* Subtitle entrance */}
          <motion.p
            className="text-sm text-[#B8B5C5] font-sans"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.55,
              delay: shouldReduceMotion ? 0 : 0.05 + words.length * 0.07,
              ease: "easeOut",
            }}
          >
            {subtitleText}
          </motion.p>
        </div>

        {/* 3 Step Cards: Staggered Scroll Reveal */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {STEPS_DATA.map((item) => (
            <motion.div
              key={item.step}
              variants={cardVariants}
              whileHover={{
                y: -4,
                transition: { duration: 0.2, ease: "easeOut" },
              }}
              className="bg-white text-[#050505] p-6 rounded-[6px] border-2 border-[#050505] neo-shadow space-y-3 cursor-default"
            >
              <div
                className={`w-10 h-10 rounded-[4px] ${item.stepBadgeClass} font-display font-black text-xl flex items-center justify-center`}
              >
                {item.step}
              </div>
              <h3 className="font-display font-black text-xl uppercase tracking-tight text-[#050505]">
                {item.title}
              </h3>
              <p className="text-xs text-[#696574] leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
