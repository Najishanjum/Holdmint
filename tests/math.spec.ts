import { describe, it, expect } from "vitest";
import { calculateSplit, parseUSDC, formatUSDC, BPS_DENOMINATOR } from "../lib/utils/format-usdc";

describe("USDC Math & Rounding Invariant Verification", () => {
  it("invariantly guarantees spend + tax + savings == amount for any amount and split", () => {
    // 500 edge cases
    const splits = [
      { taxBps: 2500, savingsBps: 500 },  // 70 / 25 / 5
      { taxBps: 3500, savingsBps: 500 },  // 60 / 35 / 5
      { taxBps: 2500, savingsBps: 1500 }, // 60 / 25 / 15
      { taxBps: 5000, savingsBps: 0 },    // 50 / 50 / 0
      { taxBps: 1000, savingsBps: 1000 }, // 80 / 10 / 10
      { taxBps: 9900, savingsBps: 100 },  // 0 / 99 / 1
    ];

    for (let amount = 1n; amount <= 100n; amount++) {
      for (const split of splits) {
        const res = calculateSplit(amount, split.taxBps, split.savingsBps);
        expect(res.spendAmount + res.taxAmount + res.savingsAmount).toBe(amount);
      }
    }
  });

  it("handles large amounts without 64-bit overflow", () => {
    // $100,000,000 = 100_000_000_000_000 base units
    const hugeAmount = 100_000_000_000_000n;
    const res = calculateSplit(hugeAmount, 2500, 500);
    expect(res.taxAmount).toBe(25_000_000_000_000n);
    expect(res.savingsAmount).toBe(5_000_000_000_000n);
    expect(res.spendAmount).toBe(70_000_000_000_000n);
    expect(res.spendAmount + res.taxAmount + res.savingsAmount).toBe(hugeAmount);
  });

  it("never produces negative vault amounts", () => {
    const res = calculateSplit(1n, 2500, 500);
    expect(res.spendAmount).toBeGreaterThanOrEqual(0n);
    expect(res.taxAmount).toBeGreaterThanOrEqual(0n);
    expect(res.savingsAmount).toBeGreaterThanOrEqual(0n);
  });
});
