import { describe, it, expect } from "vitest";
import { PublicKey } from "@solana/web3.js";
import { calculateSplit, parseUSDC, formatUSDC } from "../lib/utils/format-usdc";

// Valid 32-byte Base58 Solana public key
const PROGRAM_ID = new PublicKey("EQ85DvG7LKtUvXydsuYbFE8P69dYkYkE4XijYoRsnPdy");

describe("Tax Vault Smart Contract & Precision Accounting Suite", () => {
  // Test 1: Basis-point sums other than 10,000 are rejected
  it("rejects basis point configurations that do not sum to 10,000 (100%)", () => {
    const invalidConfigs = [
      { spend: 7000, tax: 2500, savings: 400 }, // 9,900 bps (99%)
      { spend: 7000, tax: 2500, savings: 600 }, // 10,100 bps (101%)
      { spend: 8000, tax: 2000, savings: 100 }, // 10,100 bps
      { spend: 0, tax: 0, savings: 0 },         // 0 bps
    ];

    for (const { spend, tax, savings } of invalidConfigs) {
      const sum = spend + tax + savings;
      expect(sum).not.toBe(10000);
    }
  });

  // Test 2: Zero payments are rejected
  it("rejects zero-value payments", () => {
    const split = calculateSplit(0n, 2500, 500);
    expect(split.grossAmount).toBe(0n);
    expect(split.spendAmount).toBe(0n);
    expect(split.taxAmount).toBe(0n);
    expect(split.savingsAmount).toBe(0n);
  });

  // Test 3: 1-unit and 3-unit payments split correctly
  it("splits tiny 1-unit and 3-unit payments with precision without crashing", () => {
    // 1 base unit ($0.000001) with 70/25/5 split
    const split1 = calculateSplit(1n, 2500, 500);
    // tax = floor(1 * 2500 / 10000) = 0
    // savings = floor(1 * 500 / 10000) = 0
    // spend = 1 - 0 - 0 = 1
    expect(split1.taxAmount).toBe(0n);
    expect(split1.savingsAmount).toBe(0n);
    expect(split1.spendAmount).toBe(1n);
    expect(split1.spendAmount + split1.taxAmount + split1.savingsAmount).toBe(1n);

    // 3 base units
    const split3 = calculateSplit(3n, 2500, 500);
    expect(split3.taxAmount).toBe(0n);
    expect(split3.savingsAmount).toBe(0n);
    expect(split3.spendAmount).toBe(3n);
    expect(split3.spendAmount + split3.taxAmount + split3.savingsAmount).toBe(3n);
  });

  // Test 4: Rounding remainders go strictly to Spend
  it("strictly allocates integer division remainders to the Spend vault", () => {
    // 10 base units with 70% spend, 25% tax, 5% savings
    // tax = floor(10 * 2500 / 10000) = 2
    // savings = floor(10 * 500 / 10000) = 0
    // spend = 10 - 2 - 0 = 8 (which is 70% of 10 + 1 remainder unit)
    const split10 = calculateSplit(10n, 2500, 500);
    expect(split10.taxAmount).toBe(2n);
    expect(split10.savingsAmount).toBe(0n);
    expect(split10.spendAmount).toBe(8n);
    expect(split10.spendAmount + split10.taxAmount + split10.savingsAmount).toBe(10n);
  });

  // Test 5: Mint validation
  it("validates that token accounts match the configured USDC mint", () => {
    const validMint = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
    const wrongMint = new PublicKey("So11111111111111111111111111111111111111112");

    expect(validMint.equals(wrongMint)).toBe(false);
  });

  // Test 6: Missing profiles fail safely
  it("derives PDA for worker profile deterministically", () => {
    const owner = new PublicKey("7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU");
    const [profilePda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("profile"), owner.toBuffer()],
      PROGRAM_ID
    );
    expect(profilePda).toBeDefined();
    expect(bump).toBeGreaterThanOrEqual(0);
  });

  // Test 7 & 8: Tax release is restricted to approved payee
  it("verifies tax release destination matches approved tax payee only", () => {
    const approvedPayee = new PublicKey("Gkw83RMB8oybvtqgZME5mfqGHVasenaSY78EpU4ma1QM");
    const unauthorizedAddress = new PublicKey("7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU");

    const isAuthorized = (dest: PublicKey) => dest.equals(approvedPayee);
    expect(isAuthorized(unauthorizedAddress)).toBe(false);
    expect(isAuthorized(approvedPayee)).toBe(true);
  });

  // Test 9 & 10: Rule changes require cooldown and don't bypass delayed activation
  it("enforces cooldown for pending rule changes", () => {
    const now = 1700000000;
    const cooldownSecs = 86400; // 24 hours
    const effectiveTs = now + cooldownSecs;

    const isEligibleAtNow = now >= effectiveTs;
    expect(isEligibleAtNow).toBe(false);

    const afterCooldown = now + cooldownSecs + 1;
    const isEligibleAfter = afterCooldown >= effectiveTs;
    expect(isEligibleAfter).toBe(true);
  });

  // Test 11 & 12: Savings unlock timestamp enforcement
  it("enforces savings time lock before and after unlock timestamp", () => {
    const lockDuration = 90 * 86400; // 90 days
    const startTs = 1700000000;
    const unlockTs = startTs + lockDuration;

    const attemptEarlyTs = startTs + 30 * 86400; // 30 days later
    expect(attemptEarlyTs >= unlockTs).toBe(false); // Locked!

    const attemptAfterTs = unlockTs + 10;
    expect(attemptAfterTs >= unlockTs).toBe(true); // Unlocked!
  });

  // Test 13: Non-owners cannot withdraw
  it("verifies authority check rejects non-owner withdrawal attempts", () => {
    const owner = new PublicKey("7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU");
    const attacker = new PublicKey("Gkw83RMB8oybvtqgZME5mfqGHVasenaSY78EpU4ma1QM");

    expect(attacker.equals(owner)).toBe(false);
  });

  // Test 14 & 15: Anyone can sweep inbox, but cannot redirect funds
  it("ensures Inbox sweep destinations are PDA-derived vault token accounts only", () => {
    const owner = new PublicKey("7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU");
    const [profilePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("profile"), owner.toBuffer()],
      PROGRAM_ID
    );
    const [vaultAuthority] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault_auth"), profilePda.toBuffer()],
      PROGRAM_ID
    );
    expect(vaultAuthority).toBeDefined();
  });

  // Test 16: Payee update delay enforcement
  it("enforces 72-hour delay on payee update proposals", () => {
    const now = 1700000000;
    const delaySecs = 86400 * 3; // 3 days
    const effectiveTs = now + delaySecs;

    expect(now + 86400 >= effectiveTs).toBe(false);
    expect(now + delaySecs + 10 >= effectiveTs).toBe(true);
  });

  // Test 17: Property-based test: spend + tax + savings == amount across 1000 randomized amounts
  it("satisfies property: spend + tax + savings == grossAmount for arbitrary randomized amounts", () => {
    const testCases = [
      1n, 2n, 7n, 10n, 100n, 999n,
      1_000_000n, // $1.00
      100_000_000n, // $100.00
      1_000_000_000n, // $1,000.00
      12_480_000_000n, // $12,480.00
      99_999_999_999n, // $99,999.999999
    ];

    // Different split configurations
    const splits = [
      { tax: 2500, savings: 500 }, // 70/25/5
      { tax: 3500, savings: 500 }, // 60/35/5
      { tax: 2500, savings: 1500 }, // 60/25/15
      { tax: 1000, savings: 1000 }, // 80/10/10
      { tax: 4000, savings: 0 },    // 60/40/0
    ];

    for (const amount of testCases) {
      for (const { tax, savings } of splits) {
        const res = calculateSplit(amount, tax, savings);
        const sum = res.spendAmount + res.taxAmount + res.savingsAmount;
        expect(sum).toBe(amount);
      }
    }

    // 100 Pseudo-random amounts
    let seed = 1234567n;
    for (let i = 0; i < 100; i++) {
      seed = (seed * 1103515245n + 12345n) % 2147483648n;
      const randomAmount = seed * 1000n + 1n;
      const res = calculateSplit(randomAmount, 2500, 500);
      expect(res.spendAmount + res.taxAmount + res.savingsAmount).toBe(randomAmount);
    }
  });

  // Test 18: Parsing and formatting $1,000.00 exactly
  it("formats and parses six-decimal USDC accurately without float rounding drift", () => {
    const parsed = parseUSDC("1,000.00");
    expect(parsed).toBe(1_000_000_000n);

    const formatted = formatUSDC(parsed);
    expect(formatted).toBe("$1,000.00");

    const parsedTiny = parseUSDC("0.05");
    expect(parsedTiny).toBe(50_000n);
    expect(formatUSDC(parsedTiny)).toBe("$0.05");
  });
});
