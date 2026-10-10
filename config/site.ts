export const siteConfig = {
  name: "HoldMint",
  tagline: "Earn freely. Save automatically. Protect your tax money.",
  description:
    "Non-custodial Solana financial application that splits incoming USDC payments into Spend, Tax, and Savings vaults at the source of payment.",
  disclaimer: "Estimate, not tax advice · Non-custodial · Unaudited, devnet",
  persistentNotice: "Non-custodial · Unaudited · Devnet",
  network: "Solana Devnet",
  usdcDecimals: 6,
  minTaxBps: 1000, // 10% minimum recommended tax safeguard
  defaultRulesCooldownSecs: 86400, // 24-hour delay for safety
  defaultPayeeDelaySecs: 86400 * 3, // 3-day delay for payee update
};
