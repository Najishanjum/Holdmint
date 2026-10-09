# Tax Vault — Implementation Plan

## 1. Product Overview & Architecture
Tax Vault is a non-custodial Solana financial application built for freelancers and contractors receiving USDC. It enforces splits at the point of receipt into three worker-controlled vaults:
- **Spend Vault** (#34D399 - Emerald green): Unrestricted access for daily operational expenses.
- **Tax Vault** (#F5B44A - Amber): Smart contract protected; release restricted solely to approved tax payees.
- **Savings Vault** (#7C8CFF - Periwinkle): Time-locked according to worker configuration (30, 90, 180+ days).

### Core Boundaries & Disclaimers:
- Estimate, not tax advice.
- Non-custodial & Unaudited devnet application.
- Funds in ordinary wallets are never intercepted unless sent to designated Vault Inboxes.

---

## 2. Directory Structure
```
c:/Users/Lenovo/Downloads/HoldMint/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (Landing page)
│   ├── globals.css (Design system & color tokens)
│   ├── how-it-works/page.tsx
│   ├── security/page.tsx
│   ├── faq/page.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── pay/[workerPubkey]/page.tsx (Public Client Invoice)
│   ├── demo/page.tsx (Interactive guided walkthrough)
│   ├── app/
│   │   ├── layout.tsx (Dashboard Shell with sidebar & topbar)
│   │   ├── page.tsx (Overview Dashboard)
│   │   ├── onboarding/page.tsx
│   │   ├── vaults/page.tsx
│   │   ├── rules/page.tsx
│   │   ├── payments/page.tsx
│   │   ├── clients/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── deadlines/page.tsx
│   │   ├── payees/page.tsx
│   │   ├── export/page.tsx
│   │   ├── notifications/page.tsx
│   │   └── settings/page.tsx
│   └── api/
│       ├── health/route.ts
│       ├── demo/payment/route.ts
│       └── export/route.ts
├── components/
│   ├── AppShell.tsx
│   ├── Sidebar.tsx
│   ├── Topbar.tsx
│   ├── MobileBottomNav.tsx
│   ├── ConnectModal.tsx
│   ├── DemoDrawer.tsx
│   ├── VaultCard.tsx
│   ├── SplitDonut.tsx
│   ├── ReadinessRing.tsx
│   ├── DeadlineCard.tsx
│   ├── PendingRuleBanner.tsx
│   ├── PaymentTable.tsx
│   ├── PaymentDetailsDrawer.tsx
│   ├── SplitRuleEditor.tsx
│   ├── PayeeManager.tsx
│   ├── TransactionPreview.tsx
│   ├── TaxDisclaimer.tsx
│   ├── ExportPanel.tsx
│   └── ThemeToggle.tsx
├── config/
│   ├── tax-deadlines.ts
│   └── site.ts
├── lib/
│   ├── solana/
│   │   ├── connection.ts
│   │   ├── wallet.ts
│   │   ├── tax-vault-client.ts
│   │   └── idl/tax_vault.json
│   ├── services/
│   │   ├── types.ts
│   │   ├── profile-service.ts
│   │   ├── payment-service.ts
│   │   ├── vault-service.ts
│   │   ├── rules-service.ts
│   │   └── notification-service.ts
│   ├── demo/
│   │   ├── seed-data.ts
│   │   └── demo-adapter.ts
│   ├── store/
│   │   └── vault-store.ts
│   └── utils/
│       ├── format-usdc.ts
│       └── cn.ts
├── programs/
│   └── tax_vault/
│       ├── Cargo.toml
│       └── src/
│           ├── lib.rs
│           ├── state.rs
│           ├── errors.rs
│           └── instructions/
├── tests/
│   ├── tax_vault.spec.ts (Smart contract test suite)
│   └── math.spec.ts (Property & rounding test suite)
├── supabase/
│   └── migrations/20260101_init.sql
├── docs/
│   ├── architecture.md
│   ├── threat-model.md
│   ├── demo-script.md
│   └── implementation-plan.md
└── package.json
```

---

## 3. Milestones & Execution Plan
1. **Milestone 1**: Scaffolding, Design Tokens, Package Setup, and Core Config.
2. **Milestone 2**: Solana Anchor Smart Contract in `programs/tax_vault` & comprehensive test suite in `tests/`.
3. **Milestone 3**: Typed Services, State Management, Demo Adapter & Seed Data with 6-decimal integer USDC accounting.
4. **Milestone 4**: Shared UI Components & Design System with dark/light themes.
5. **Milestone 5**: Public Pages: Landing page with live simulator, How it works, Security, FAQ, and Client Payment Invoice `/pay/[workerPubkey]`.
6. **Milestone 6**: Authenticated App Dashboard, Onboarding, Vaults, Rules, Payments, Clients, Analytics, Deadlines, Payees, Export, and Settings.
7. **Milestone 7**: Supabase Migrations, Server APIs (`/api/health`, `/api/demo/payment`, `/api/export`), verification, testing & documentation.
