"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  WorkerProfileData,
  VaultBalances,
  PaymentRecordItem,
  ClientProfile,
  PaymentLinkItem,
  NotificationItem,
} from "../services/types";
import {
  INITIAL_DEMO_PROFILE,
  INITIAL_DEMO_BALANCES,
  INITIAL_DEMO_PAYMENTS,
  INITIAL_DEMO_CLIENTS,
  INITIAL_DEMO_PAYMENT_LINKS,
  INITIAL_DEMO_NOTIFICATIONS,
  DEMO_WORKER_PUBKEY,
} from "../demo/seed-data";
import { calculateSplit, formatUSDC } from "../utils/format-usdc";

interface VaultContextType {
  profile: WorkerProfileData;
  balances: VaultBalances;
  payments: PaymentRecordItem[];
  clients: ClientProfile[];
  paymentLinks: PaymentLinkItem[];
  notifications: NotificationItem[];
  isDemoMode: boolean;
  isWalletConnected: boolean;
  walletAddress: string;
  jurisdiction: "US" | "IN";
  isDemoDrawerOpen: boolean;
  isConnectModalOpen: boolean;

  // Actions
  setJurisdiction: (mode: "US" | "IN") => void;
  setIsDemoDrawerOpen: (open: boolean) => void;
  setIsConnectModalOpen: (open: boolean) => void;
  connectWallet: (address?: string) => void;
  disconnectWallet: () => void;
  processPayment: (amount: bigint, payerName?: string, memo?: string) => { success: boolean; split: any };
  withdrawSpend: (amount: bigint) => { success: boolean; error?: string };
  releaseTax: (amount: bigint, targetPayee: string) => { success: boolean; error?: string };
  withdrawSavings: (amount: bigint) => { success: boolean; error?: string };
  proposeRules: (spendBps: number, taxBps: number, savingsBps: number) => { success: boolean; error?: string };
  applyRules: () => { success: boolean; error?: string };
  cancelPendingRules: () => void;
  proposePayee: (newPayee: string) => { success: boolean; error?: string };
  applyPayee: () => { success: boolean; error?: string };
  cancelPendingPayee: () => void;
  sweepInbox: () => { success: boolean; error?: string };
  createPaymentLink: (data: Partial<PaymentLinkItem>) => PaymentLinkItem;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resetDemoData: () => void;
  updateProjectedTaxNeed: (amount: bigint) => void;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

const STORAGE_KEY = "tax_vault_state_v1";

export function VaultProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<WorkerProfileData>(INITIAL_DEMO_PROFILE);
  const [balances, setBalances] = useState<VaultBalances>(INITIAL_DEMO_BALANCES);
  const [payments, setPayments] = useState<PaymentRecordItem[]>(INITIAL_DEMO_PAYMENTS);
  const [clients, setClients] = useState<ClientProfile[]>(INITIAL_DEMO_CLIENTS);
  const [paymentLinks, setPaymentLinks] = useState<PaymentLinkItem[]>(INITIAL_DEMO_PAYMENT_LINKS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_DEMO_NOTIFICATIONS);
  const [isDemoMode] = useState<boolean>(true);
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(true);
  const [walletAddress, setWalletAddress] = useState<string>(DEMO_WORKER_PUBKEY);
  const [jurisdiction, setJurisdiction] = useState<"US" | "IN">("US");
  const [isDemoDrawerOpen, setIsDemoDrawerOpen] = useState<boolean>(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);

  // Sync state to local storage safely
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile) {
          setProfile({
            ...parsed.profile,
            totalReceived: BigInt(parsed.profile.totalReceived || "0"),
            totalTaxReserved: BigInt(parsed.profile.totalTaxReserved || "0"),
            projectedTaxNeed: BigInt(parsed.profile.projectedTaxNeed || "2500000000"),
          });
        }
        if (parsed.balances) {
          setBalances({
            spend: BigInt(parsed.balances.spend || "0"),
            tax: BigInt(parsed.balances.tax || "0"),
            savings: BigInt(parsed.balances.savings || "0"),
            inbox: BigInt(parsed.balances.inbox || "0"),
            total: BigInt(parsed.balances.total || "0"),
          });
        }
        if (parsed.payments && Array.isArray(parsed.payments)) {
          setPayments(
            parsed.payments.map((p: any) => ({
              ...p,
              grossAmount: BigInt(p.grossAmount || "0"),
              spendAmount: BigInt(p.spendAmount || "0"),
              taxAmount: BigInt(p.taxAmount || "0"),
              savingsAmount: BigInt(p.savingsAmount || "0"),
            }))
          );
        }
        if (parsed.clients) setClients(parsed.clients);
        if (parsed.paymentLinks) {
          setPaymentLinks(
            parsed.paymentLinks.map((l: any) => ({
              ...l,
              fixedAmount: l.fixedAmount ? BigInt(l.fixedAmount) : undefined,
            }))
          );
        }
        if (parsed.notifications) setNotifications(parsed.notifications);
      }
    } catch {
      // Fallback to initial seeds
    }
  }, []);

  const saveToStorage = (
    newProfile: WorkerProfileData,
    newBalances: VaultBalances,
    newPayments: PaymentRecordItem[],
    newClients: ClientProfile[],
    newLinks: PaymentLinkItem[],
    newNotifs: NotificationItem[]
  ) => {
    try {
      const serialize = {
        profile: {
          ...newProfile,
          totalReceived: newProfile.totalReceived.toString(),
          totalTaxReserved: newProfile.totalTaxReserved.toString(),
          projectedTaxNeed: newProfile.projectedTaxNeed.toString(),
        },
        balances: {
          spend: newBalances.spend.toString(),
          tax: newBalances.tax.toString(),
          savings: newBalances.savings.toString(),
          inbox: newBalances.inbox.toString(),
          total: newBalances.total.toString(),
        },
        payments: newPayments.map((p) => ({
          ...p,
          grossAmount: p.grossAmount.toString(),
          spendAmount: p.spendAmount.toString(),
          taxAmount: p.taxAmount.toString(),
          savingsAmount: p.savingsAmount.toString(),
        })),
        clients: newClients,
        paymentLinks: newLinks.map((l) => ({
          ...l,
          fixedAmount: l.fixedAmount ? l.fixedAmount.toString() : undefined,
        })),
        notifications: newNotifs,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialize));
    } catch (e) {
      console.warn("Storage sync failed", e);
    }
  };

  const connectWallet = (address?: string) => {
    setIsWalletConnected(true);
    setWalletAddress(address || DEMO_WORKER_PUBKEY);
    setIsConnectModalOpen(false);
  };

  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress("");
  };

  const processPayment = (amount: bigint, payerName = "Demo Payer", memo = "Services rendered") => {
    const split = calculateSplit(amount, profile.taxBps, profile.savingsBps);

    const newBalances: VaultBalances = {
      spend: balances.spend + split.spendAmount,
      tax: balances.tax + split.taxAmount,
      savings: balances.savings + split.savingsAmount,
      inbox: balances.inbox,
      total: balances.total + amount,
    };

    const newProfile: WorkerProfileData = {
      ...profile,
      totalReceived: profile.totalReceived + amount,
      totalTaxReserved: profile.totalTaxReserved + split.taxAmount,
      paymentCount: profile.paymentCount + 1,
    };

    const newPayment: PaymentRecordItem = {
      id: `demo-tx-${Date.now()}`,
      payer: "DemoPayerXyz11111111111111111111111111111111",
      payerName,
      invoiceRef: `INV-2026-${String(profile.paymentCount + 1).padStart(3, "0")}`,
      grossAmount: amount,
      spendAmount: split.spendAmount,
      taxAmount: split.taxAmount,
      savingsAmount: split.savingsAmount,
      timestamp: Date.now(),
      status: "simulated",
      isSimulated: true,
      memo,
    };

    const newPayments = [newPayment, ...payments];

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: "Payment Received (Simulated)",
      description: `Received ${formatUSDC(amount)} from ${payerName}. Routed to Spend (${formatUSDC(split.spendAmount)}), Tax (${formatUSDC(split.taxAmount)}), and Savings (${formatUSDC(split.savingsAmount)}).`,
      type: "payment_received",
      isRead: false,
      timestamp: Date.now(),
      actionUrl: "/app/payments",
    };
    const newNotifs = [newNotif, ...notifications];

    setBalances(newBalances);
    setProfile(newProfile);
    setPayments(newPayments);
    setNotifications(newNotifs);

    saveToStorage(newProfile, newBalances, newPayments, clients, paymentLinks, newNotifs);
    return { success: true, split };
  };

  const withdrawSpend = (amount: bigint) => {
    if (amount <= 0n) return { success: false, error: "Amount must be greater than zero" };
    if (amount > balances.spend) return { success: false, error: "Insufficient available Spend vault balance" };

    const newBalances = {
      ...balances,
      spend: balances.spend - amount,
      total: balances.total - amount,
    };
    setBalances(newBalances);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: "Spend Vault Withdrawal",
      description: `Withdrew ${formatUSDC(amount)} from Spend Vault to your primary wallet.`,
      type: "payment_confirmed",
      isRead: false,
      timestamp: Date.now(),
      actionUrl: "/app/vaults",
    };
    const newNotifs = [newNotif, ...notifications];
    setNotifications(newNotifs);

    saveToStorage(profile, newBalances, payments, clients, paymentLinks, newNotifs);
    return { success: true };
  };

  const releaseTax = (amount: bigint, targetPayee: string) => {
    if (amount <= 0n) return { success: false, error: "Amount must be greater than zero" };
    if (amount > balances.tax) return { success: false, error: "Insufficient locked Tax vault balance" };
    if (targetPayee.trim() !== profile.taxPayee.trim()) {
      return {
        success: false,
        error: "Blocked: Tax vault funds can ONLY be released to your approved tax payee. Unauthorized personal wallet address rejected.",
      };
    }

    const newBalances = {
      ...balances,
      tax: balances.tax - amount,
      total: balances.total - amount,
    };
    setBalances(newBalances);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: "Tax Released to Approved Payee",
      description: `Released ${formatUSDC(amount)} to approved tax payee (${targetPayee.slice(0, 4)}...${targetPayee.slice(-4)}).`,
      type: "payment_confirmed",
      isRead: false,
      timestamp: Date.now(),
      actionUrl: "/app/vaults",
    };
    const newNotifs = [newNotif, ...notifications];
    setNotifications(newNotifs);

    saveToStorage(profile, newBalances, payments, clients, paymentLinks, newNotifs);
    return { success: true };
  };

  const withdrawSavings = (amount: bigint) => {
    if (amount <= 0n) return { success: false, error: "Amount must be greater than zero" };
    if (amount > balances.savings) return { success: false, error: "Insufficient Savings balance" };

    const nowSecs = Math.floor(Date.now() / 1000);
    if (nowSecs < profile.savingsUnlockTs) {
      return {
        success: false,
        error: `Savings vault is time-locked until ${new Date(profile.savingsUnlockTs * 1000).toLocaleDateString()}. Cannot withdraw prior to unlock.`,
      };
    }

    const newBalances = {
      ...balances,
      savings: balances.savings - amount,
      total: balances.total - amount,
    };
    setBalances(newBalances);
    saveToStorage(profile, newBalances, payments, clients, paymentLinks, notifications);
    return { success: true };
  };

  const proposeRules = (spendBps: number, taxBps: number, savingsBps: number) => {
    if (spendBps + taxBps + savingsBps !== 10000) {
      return { success: false, error: "Basis points must total 10,000 (100.00%)" };
    }
    if (taxBps < 500) {
      return { success: false, error: "Tax allocation cannot be below the 5% minimum safeguard" };
    }

    const now = Math.floor(Date.now() / 1000);
    const effectiveTs = now + profile.rulesCooldownSecs;

    const newProfile: WorkerProfileData = {
      ...profile,
      hasPendingRules: true,
      pendingSpendBps: spendBps,
      pendingTaxBps: taxBps,
      pendingSavingsBps: savingsBps,
      pendingRulesEffectiveTs: effectiveTs,
    };
    setProfile(newProfile);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: "Rule Change Proposed",
      description: `Proposed new split: ${spendBps / 100}% Spend, ${taxBps / 100}% Tax, ${savingsBps / 100}% Savings. Cooldown active until ${new Date(effectiveTs * 1000).toLocaleTimeString()}.`,
      type: "rules_proposed",
      isRead: false,
      timestamp: Date.now(),
      actionUrl: "/app/rules",
    };
    const newNotifs = [newNotif, ...notifications];
    setNotifications(newNotifs);

    saveToStorage(newProfile, balances, payments, clients, paymentLinks, newNotifs);
    return { success: true };
  };

  const applyRules = () => {
    if (!profile.hasPendingRules) return { success: false, error: "No pending rule change exists" };

    const newProfile: WorkerProfileData = {
      ...profile,
      spendBps: profile.pendingSpendBps || profile.spendBps,
      taxBps: profile.pendingTaxBps || profile.taxBps,
      savingsBps: profile.pendingSavingsBps || profile.savingsBps,
      hasPendingRules: false,
      pendingRulesEffectiveTs: 0,
    };
    setProfile(newProfile);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: "New Split Rules Activated",
      description: `Active split updated to ${newProfile.spendBps / 100}% Spend, ${newProfile.taxBps / 100}% Tax, ${newProfile.savingsBps / 100}% Savings for all future payments.`,
      type: "rules_ready",
      isRead: false,
      timestamp: Date.now(),
      actionUrl: "/app/rules",
    };
    const newNotifs = [newNotif, ...notifications];
    setNotifications(newNotifs);

    saveToStorage(newProfile, balances, payments, clients, paymentLinks, newNotifs);
    return { success: true };
  };

  const cancelPendingRules = () => {
    const newProfile: WorkerProfileData = {
      ...profile,
      hasPendingRules: false,
      pendingRulesEffectiveTs: 0,
    };
    setProfile(newProfile);
    saveToStorage(newProfile, balances, payments, clients, paymentLinks, notifications);
  };

  const proposePayee = (newPayee: string) => {
    if (!newPayee || newPayee.length < 32) {
      return { success: false, error: "Invalid Solana public key address" };
    }
    const now = Math.floor(Date.now() / 1000);
    const effectiveTs = now + profile.payeeDelaySecs;

    const newProfile: WorkerProfileData = {
      ...profile,
      hasPendingPayee: true,
      pendingPayee: newPayee,
      pendingPayeeEffectiveTs: effectiveTs,
    };
    setProfile(newProfile);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: "Payee Change Proposed",
      description: `Proposed new approved tax payee: ${newPayee.slice(0, 4)}...${newPayee.slice(-4)}. Subject to 72-hour delay.`,
      type: "payee_proposed",
      isRead: false,
      timestamp: Date.now(),
      actionUrl: "/app/payees",
    };
    const newNotifs = [newNotif, ...notifications];
    setNotifications(newNotifs);

    saveToStorage(newProfile, balances, payments, clients, paymentLinks, newNotifs);
    return { success: true };
  };

  const applyPayee = () => {
    if (!profile.hasPendingPayee || !profile.pendingPayee) {
      return { success: false, error: "No pending payee proposed" };
    }
    const newProfile: WorkerProfileData = {
      ...profile,
      taxPayee: profile.pendingPayee,
      hasPendingPayee: false,
      pendingPayee: "",
      pendingPayeeEffectiveTs: 0,
    };
    setProfile(newProfile);
    saveToStorage(newProfile, balances, payments, clients, paymentLinks, notifications);
    return { success: true };
  };

  const cancelPendingPayee = () => {
    const newProfile: WorkerProfileData = {
      ...profile,
      hasPendingPayee: false,
      pendingPayee: "",
      pendingPayeeEffectiveTs: 0,
    };
    setProfile(newProfile);
    saveToStorage(newProfile, balances, payments, clients, paymentLinks, notifications);
  };

  const sweepInbox = () => {
    if (balances.inbox <= 0n) {
      return { success: false, error: "Inbox is empty (0.00 USDC). Nothing to sweep." };
    }
    const split = calculateSplit(balances.inbox, profile.taxBps, profile.savingsBps);
    const newBalances = {
      spend: balances.spend + split.spendAmount,
      tax: balances.tax + split.taxAmount,
      savings: balances.savings + split.savingsAmount,
      inbox: 0n,
      total: balances.total,
    };
    setBalances(newBalances);
    saveToStorage(profile, newBalances, payments, clients, paymentLinks, notifications);
    return { success: true };
  };

  const createPaymentLink = (data: Partial<PaymentLinkItem>) => {
    const newLink: PaymentLinkItem = {
      id: `link-${Date.now()}`,
      title: data.title || "Custom Invoice",
      reference: `TV-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      fixedAmount: data.fixedAmount,
      memo: data.memo,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
      dueDate: data.dueDate,
    };
    const newLinks = [newLink, ...paymentLinks];
    setPaymentLinks(newLinks);
    saveToStorage(profile, balances, payments, clients, newLinks, notifications);
    return newLink;
  };

  const markNotificationAsRead = (id: string) => {
    const newNotifs = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setNotifications(newNotifs);
    saveToStorage(profile, balances, payments, clients, paymentLinks, newNotifs);
  };

  const markAllNotificationsAsRead = () => {
    const newNotifs = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(newNotifs);
    saveToStorage(profile, balances, payments, clients, paymentLinks, newNotifs);
  };

  const updateProjectedTaxNeed = (amount: bigint) => {
    const newProfile = { ...profile, projectedTaxNeed: amount };
    setProfile(newProfile);
    saveToStorage(newProfile, balances, payments, clients, paymentLinks, notifications);
  };

  const resetDemoData = () => {
    setProfile(INITIAL_DEMO_PROFILE);
    setBalances(INITIAL_DEMO_BALANCES);
    setPayments(INITIAL_DEMO_PAYMENTS);
    setClients(INITIAL_DEMO_CLIENTS);
    setPaymentLinks(INITIAL_DEMO_PAYMENT_LINKS);
    setNotifications(INITIAL_DEMO_NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <VaultContext.Provider
      value={{
        profile,
        balances,
        payments,
        clients,
        paymentLinks,
        notifications,
        isDemoMode,
        isWalletConnected,
        walletAddress,
        jurisdiction,
        isDemoDrawerOpen,
        isConnectModalOpen,
        setJurisdiction,
        setIsDemoDrawerOpen,
        setIsConnectModalOpen,
        connectWallet,
        disconnectWallet,
        processPayment,
        withdrawSpend,
        releaseTax,
        withdrawSavings,
        proposeRules,
        applyRules,
        cancelPendingRules,
        proposePayee,
        applyPayee,
        cancelPendingPayee,
        sweepInbox,
        createPaymentLink,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetDemoData,
        updateProjectedTaxNeed,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export function useVault() {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error("useVault must be used within a VaultProvider");
  }
  return context;
}
