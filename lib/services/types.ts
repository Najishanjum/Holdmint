export type VaultType = "spend" | "tax" | "savings";

export interface WorkerProfileData {
  owner: string;
  displayName: string;
  mint: string;
  spendBps: number;
  taxBps: number;
  savingsBps: number;
  taxPayee: string;
  hasPendingRules: boolean;
  pendingSpendBps?: number;
  pendingTaxBps?: number;
  pendingSavingsBps?: number;
  pendingRulesEffectiveTs?: number;
  hasPendingPayee: boolean;
  pendingPayee?: string;
  pendingPayeeEffectiveTs?: number;
  savingsUnlockTs: number;
  rulesCooldownSecs: number;
  payeeDelaySecs: number;
  totalReceived: bigint;
  totalTaxReserved: bigint;
  paymentCount: number;
  projectedTaxNeed: bigint;
  isSimulated: boolean;
}

export interface VaultBalances {
  spend: bigint;
  tax: bigint;
  savings: bigint;
  inbox: bigint;
  total: bigint;
}

export interface PaymentRecordItem {
  id: string;
  payer: string;
  payerName: string;
  invoiceRef?: string;
  grossAmount: bigint;
  spendAmount: bigint;
  taxAmount: bigint;
  savingsAmount: bigint;
  timestamp: number;
  status: "confirmed" | "simulated" | "pending" | "confirming" | "failed";
  txSignature?: string;
  isSimulated: boolean;
  memo?: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  company: string;
  notes?: string;
  totalPaid: bigint;
  paymentCount: number;
  lastPaymentDate?: string;
}

export interface PaymentLinkItem {
  id: string;
  title: string;
  reference: string;
  fixedAmount?: bigint;
  memo?: string;
  status: "active" | "paid" | "expired" | "archived";
  dueDate?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type:
    | "payment_received"
    | "payment_confirmed"
    | "payment_failed"
    | "rules_proposed"
    | "rules_ready"
    | "payee_proposed"
    | "payee_ready"
    | "savings_unlocked"
    | "deadline_approaching"
    | "export_completed";
  isRead: boolean;
  timestamp: number;
  actionUrl?: string;
}
