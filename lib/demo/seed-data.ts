import { WorkerProfileData, VaultBalances, PaymentRecordItem, ClientProfile, PaymentLinkItem, NotificationItem } from "../services/types";
import { parseUSDC, calculateSplit } from "../utils/format-usdc";

export const DEMO_WORKER_PUBKEY = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU";
export const DEMO_PAYEE_PUBKEY = "Gkw83RMB8oybvtqgZME5mfqGHVasenaSY78EpU4ma1QM";
export const DEMO_USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

export const INITIAL_DEMO_PROFILE: WorkerProfileData = {
  owner: DEMO_WORKER_PUBKEY,
  displayName: "Alex Morgan",
  mint: DEMO_USDC_MINT,
  spendBps: 7000,
  taxBps: 2500,
  savingsBps: 500,
  taxPayee: DEMO_PAYEE_PUBKEY,
  hasPendingRules: false,
  pendingSpendBps: 0,
  pendingTaxBps: 0,
  pendingSavingsBps: 0,
  pendingRulesEffectiveTs: 0,
  hasPendingPayee: false,
  pendingPayee: "",
  pendingPayeeEffectiveTs: 0,
  savingsUnlockTs: Math.floor(Date.now() / 1000) + 90 * 86400, // 90 days lock
  rulesCooldownSecs: 86400, // 24 hours
  payeeDelaySecs: 86400 * 3, // 72 hours
  totalReceived: 12_480_000_000n, // $12,480.00
  totalTaxReserved: 3_120_000_000n, // $3,120.00
  paymentCount: 14,
  projectedTaxNeed: 2_500_000_000n, // $2,500.00
  isSimulated: true,
};

export const INITIAL_DEMO_BALANCES: VaultBalances = {
  spend: 2_136_000_000n, // $2,136.00
  tax: 1_860_000_000n,   // $1,860.00
  savings: 372_000_000n, // $372.00
  inbox: 0n,
  total: 4_368_000_000n, // $4,368.00
};

// Deterministic seed records matching requirements exactly
const rawPayments = [
  { name: "Acme Studio", amount: "1000.00", daysAgo: 1, ref: "INV-2026-014", memo: "Brand Identity Design" },
  { name: "Northstar Labs", amount: "500.00", daysAgo: 2, ref: "INV-2026-013", memo: "Solana Smart Contract Review" },
  { name: "Pixel Works", amount: "1250.00", daysAgo: 4, ref: "INV-2026-012", memo: "Design System Implementation" },
  { name: "DevCraft Inc.", amount: "800.00", daysAgo: 6, ref: "INV-2026-011", memo: "Frontend Development Sprint" },
  { name: "Orbit Design", amount: "2000.00", daysAgo: 8, ref: "INV-2026-010", memo: "Mobile App Wireframes & Prototypes" },
  { name: "Hyperion Tech", amount: "2400.00", daysAgo: 11, ref: "INV-2026-009", memo: "Full-Stack Web3 Integration" },
  { name: "Stellar Labs", amount: "650.00", daysAgo: 14, ref: "INV-2026-008", memo: "Component Refactoring" },
  { name: "Horizon Media", amount: "780.00", daysAgo: 17, ref: "INV-2026-007", memo: "Content Platform API" },
  { name: "Apex Interactive", amount: "450.00", daysAgo: 19, ref: "INV-2026-006", memo: "Landing Page Optimization" },
  { name: "Velocity Systems", amount: "950.00", daysAgo: 22, ref: "INV-2026-005", memo: "Anchor IDL Testing Suite" },
  { name: "Quantum Studios", amount: "350.00", daysAgo: 24, ref: "INV-2026-004", memo: "Iconography & Vector Assets" },
  { name: "Aura Digital", amount: "400.00", daysAgo: 26, ref: "INV-2026-003", memo: "User Research & Interviews" },
  { name: "CloudCraft Co", amount: "500.00", daysAgo: 28, ref: "INV-2026-002", memo: "DevOps CI/CD Automation" },
  { name: "Pulse Labs", amount: "450.00", daysAgo: 30, ref: "INV-2026-001", memo: "Technical Documentation" },
];

export const INITIAL_DEMO_PAYMENTS: PaymentRecordItem[] = rawPayments.map((p, idx) => {
  const gross = parseUSDC(p.amount);
  const split = calculateSplit(gross, 2500, 500); // 70/25/5
  const timestamp = Date.now() - p.daysAgo * 86400 * 1000;
  return {
    id: `demo-tx-${14 - idx}`,
    payer: `Payer${idx + 1}Xyz1111111111111111111111111111111111`,
    payerName: p.name,
    invoiceRef: p.ref,
    grossAmount: gross,
    spendAmount: split.spendAmount,
    taxAmount: split.taxAmount,
    savingsAmount: split.savingsAmount,
    timestamp,
    status: "simulated",
    demoTxId: `SIM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    isSimulated: true,
    memo: p.memo,
  };
});

export const INITIAL_DEMO_CLIENTS: ClientProfile[] = [
  { id: "cli-1", name: "Acme Studio", email: "billing@acmestudio.com", company: "Acme Studio Inc.", totalPaid: 1_000_000_000n, paymentCount: 1, lastPaymentDate: "Yesterday" },
  { id: "cli-2", name: "Northstar Labs", email: "finance@northstarlabs.io", company: "Northstar Labs", totalPaid: 500_000_000n, paymentCount: 1, lastPaymentDate: "2 days ago" },
  { id: "cli-3", name: "Pixel Works", email: "accounts@pixelworks.design", company: "Pixel Works Co.", totalPaid: 1_250_000_000n, paymentCount: 1, lastPaymentDate: "4 days ago" },
  { id: "cli-4", name: "Orbit Design", email: "alex@orbitdesign.co", company: "Orbit Design LLC", totalPaid: 2_000_000_000n, paymentCount: 1, lastPaymentDate: "8 days ago" },
  { id: "cli-5", name: "Hyperion Tech", email: "pay@hyperion.tech", company: "Hyperion Technologies", totalPaid: 2_400_000_000n, paymentCount: 1, lastPaymentDate: "11 days ago" },
];

export const INITIAL_DEMO_PAYMENT_LINKS: PaymentLinkItem[] = [
  { id: "link-1", title: "Acme Studio - Q1 Retainer", reference: "TV-ACME-001", fixedAmount: 1_000_000_000n, memo: "Design retainer for February", status: "active", createdAt: "2026-02-01" },
  { id: "link-2", title: "General Consulting (Open Amount)", reference: "TV-OPEN-FLEX", fixedAmount: undefined, memo: "Hourly consulting invoice", status: "active", createdAt: "2026-02-05" },
  { id: "link-3", title: "Orbit Design - Milestone 2", reference: "TV-ORBIT-M2", fixedAmount: 2_000_000_000n, memo: "Final deliverable approval", status: "active", createdAt: "2026-02-10" },
];

export const INITIAL_DEMO_NOTIFICATIONS: NotificationItem[] = [
  { id: "notif-1", title: "Payment Received", description: "Received 1,000.00 USDC from Acme Studio. Routed to Spend ($700), Tax ($250), and Savings ($50).", type: "payment_received", isRead: false, timestamp: Date.now() - 3600000, actionUrl: "/app/payments" },
  { id: "notif-2", title: "Tax Vault Protected", description: "Tax reserve is currently $1,860.00. Tax readiness is at 74% of your $2,500 estimate.", type: "deadline_approaching", isRead: false, timestamp: Date.now() - 86400000, actionUrl: "/app/deadlines" },
  { id: "notif-3", title: "Upcoming US Q1 Tax Deadline", description: "IRS 1040-ES Q1 deadline is approaching on April 15, 2025.", type: "deadline_approaching", isRead: true, timestamp: Date.now() - 172800000, actionUrl: "/app/deadlines" },
];
