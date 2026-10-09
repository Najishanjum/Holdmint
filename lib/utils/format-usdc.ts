/**
 * Precision USDC Accounting & Formatting Utilities
 *
 * Tax Vault uses integer base units (6 decimals) for all token computations.
 * $1.00 = 1_000_000 base units.
 * Never use floating-point math for on-chain or off-chain balance splits.
 */

export const USDC_DECIMALS = 6;
export const USDC_BASE_UNIT = 1_000_000n;
export const BPS_DENOMINATOR = 10_000n;

/**
 * Parses a decimal string (e.g. "1000.50") into integer base units (e.g. 1000500000n)
 */
export function parseUSDC(amountStr: string | number): bigint {
  const cleanStr = String(amountStr).trim().replace(/,/g, "");
  if (!cleanStr || isNaN(Number(cleanStr))) {
    return 0n;
  }
  const [whole, fraction = ""] = cleanStr.split(".");
  const paddedFraction = (fraction + "000000").slice(0, 6);
  const totalBaseUnits = BigInt(whole || "0") * USDC_BASE_UNIT + BigInt(paddedFraction);
  return totalBaseUnits < 0n ? 0n : totalBaseUnits;
}

/**
 * Formats base units (e.g. 1000500000n) into human-readable currency (e.g. "$1,000.50")
 */
export function formatUSDC(
  baseUnits: bigint | number | string,
  options: {
    showCents?: boolean;
    prefix?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  const {
    showCents = true,
    prefix = "$",
    minimumFractionDigits = showCents ? 2 : 0,
    maximumFractionDigits = 2,
  } = options;

  let val: bigint;
  try {
    val = typeof baseUnits === "bigint" ? baseUnits : BigInt(Math.floor(Number(baseUnits)));
  } catch {
    val = 0n;
  }

  const isNegative = val < 0n;
  const absVal = isNegative ? -val : val;

  const whole = absVal / USDC_BASE_UNIT;
  const fraction = absVal % USDC_BASE_UNIT;

  // Format whole number with commas
  const wholeFormatted = whole.toLocaleString("en-US");

  if (!showCents && maximumFractionDigits === 0) {
    return `${isNegative ? "-" : ""}${prefix}${wholeFormatted}`;
  }

  // Fraction up to maximumFractionDigits
  const fracStr = fraction.toString().padStart(6, "0");
  const cents = fracStr.slice(0, maximumFractionDigits);

  return `${isNegative ? "-" : ""}${prefix}${wholeFormatted}.${cents}`;
}

export interface SplitResult {
  grossAmount: bigint;
  spendAmount: bigint;
  taxAmount: bigint;
  savingsAmount: bigint;
  taxBps: number;
  savingsBps: number;
  spendBps: number;
}

/**
 * Precise split calculation with checked integer arithmetic.
 * Any rounding remainder is strictly allocated to Spend.
 */
export function calculateSplit(
  amountBaseUnits: bigint,
  taxBps: number,
  savingsBps: number
): SplitResult {
  if (amountBaseUnits <= 0n) {
    return {
      grossAmount: 0n,
      spendAmount: 0n,
      taxAmount: 0n,
      savingsAmount: 0n,
      taxBps,
      savingsBps,
      spendBps: 10000 - taxBps - savingsBps,
    };
  }

  const taxBpsBig = BigInt(taxBps);
  const savingsBpsBig = BigInt(savingsBps);
  const spendBps = 10000 - taxBps - savingsBps;

  // tax = floor(amount * tax_bps / 10000)
  const taxAmount = (amountBaseUnits * taxBpsBig) / BPS_DENOMINATOR;
  // savings = floor(amount * savings_bps / 10000)
  const savingsAmount = (amountBaseUnits * savingsBpsBig) / BPS_DENOMINATOR;
  // remainder goes to spend
  const spendAmount = amountBaseUnits - taxAmount - savingsAmount;

  return {
    grossAmount: amountBaseUnits,
    spendAmount,
    taxAmount,
    savingsAmount,
    taxBps,
    savingsBps,
    spendBps,
  };
}

/**
 * Truncate public key for presentation e.g. "7xK...4e9Z"
 */
export function truncateAddress(address: string, chars = 4): string {
  if (!address) return "";
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
