# Tax Vault — Non-Custodial Solana Income & Tax Splitter

> **"Earn freely. Save automatically. Protect your tax money."**  
> *Tax money that can't be spent by accident: enforced at the source, locked in a vault, released only to an approved tax payee.*

[![Solana Devnet](https://img.shields.io/badge/Solana-Devnet-14F195?logo=solana)](https://solana.com)
[![Anchor Framework](https://img.shields.io/badge/Anchor-0.30.1-blue)](https://anchor-lang.com)
[![Next.js 14](https://img.shields.io/badge/Next.js-14_App_Router-black)](https://nextjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---    
        hh
## 1. Product Overview

**Tax Vault** is a non-custodial financial application on Solana built for freelancers, independent developers, designers, and creators receiving USDC from clients.

When a client pays an invoice, the Tax Vault Solana smart contract automatically routes the payment into three worker-controlled vaults:
1. **Spend Vault** (#34D399 - Emerald green): Completely liquid operational capital for day-to-day freelancer expenses.
2. **Tax Vault** (#F5B44A - Amber): Smart-contract protected. Tokens can **only** be released to an approved tax payee designated by the worker.
3. **Savings Vault** (#7C8CFF - Periwinkle): Time-locked treasury reserves with configurable lock durations (30, 90, 180 days).

---   

## 2. Non-Negotiable Boundaries & Disclaimers
- **Estimate, not tax advice**: All percentage allocations and readiness indicators are user-defined planning targets, not statutory tax calculations.
- **Non-custodial**: Tax Vault maintains zero keys and zero custody of funds.
- **Unaudited Devnet Software**: Deployed on Solana Devnet for demonstration, hackathon evaluation, and protocol testing with Mock USDC.
- **Direct Wallet Transfer Boundary**: Generic token transfers sent directly to personal hot wallets cannot be intercepted by Solana programs. Payments must be routed through Tax Vault payment links or transferred to the designated Vault Inbox PDA.

---

## 3. Key Features

- **Atomic Split Engine**: 6-decimal integer base units (`$1.00 = 1_000_000` base units). Division remainders are strictly allocated to Spend.
- **Approved Payee Protection**: Tax Vault rejects any withdrawal attempt to unauthorized personal hot wallets.
- **Timelock Cooldown Safeguards**: 24-hour cooldown on rule changes and 72-hour delay on payee updates.
- **Live Payment Simulator**: Persistent side-drawer to simulate $100, $500, $1,000, and custom incoming payments.
- **Tax Readiness Indicator**: Real-time circular metric tracking tax reserves against self-projected estimates.
- **Statutory Deadlines Calendar**: Toggle between US (IRS 1040-ES) and India (Income Tax Department advance tax) schedules.
- **Client Payment Pages (`/pay/[workerPubkey]`)**: Clean invoice view with dynamic QR codes that keeps private split percentages hidden from clients.
- **Accountant Export & CSV Ledger**: Full payment audit trail with one-click CSV export and printable summary sheet.

---

## 4. Repository Structure

```
holdmint/
├── app/
│   ├── page.tsx                     # Landing page with live simulator
│   ├── how-it-works/page.tsx        # Product mechanics explanation
│   ├── security/page.tsx            # Security model & boundaries
│   ├── faq/page.tsx                 # Frequently asked questions
│   ├── pay/[workerPubkey]/page.tsx  # Client payment invoice & QR
│   ├── demo/page.tsx                # 2-minute guided protocol walkthrough
│   ├── privacy/page.tsx             # Privacy policy placeholder
│   ├── terms/page.tsx               # Terms of service placeholder
│   ├── app/
│   │   ├── page.tsx                 # Overview financial dashboard
│   │   ├── onboarding/page.tsx      # 6-step setup wizard
│   │   ├── vaults/page.tsx          # Spend, Tax, Savings & Inbox sweeper
│   │   ├── rules/page.tsx           # Split percentages & timelocks
│   │   ├── payments/page.tsx        # Transaction history & filters
│   │   ├── clients/page.tsx         # Clients & payment link generator
│   │   ├── analytics/page.tsx       # Recharts statistical analytics
│   │   ├── deadlines/page.tsx       # US & India tax calendar
│   │   ├── payees/page.tsx          # Approved payee governance
│   │   ├── export/page.tsx          # CSV export & accountant sheet
│   │   ├── notifications/page.tsx   # In-app notifications
│   │   └── settings/page.tsx        # Identity & reset demo data
│   └── api/
│       ├── health/route.ts          # Application health check
│       ├── demo/payment/route.ts    # Server-authorized demo payer
│       └── export/route.ts          # Server-side CSV report generator
├── components/                      # Typed reusable UI components
├── config/                          # Tax deadlines & site metadata
├── lib/
│   ├── solana/                      # IDL, web3.js client & connection
│   ├── services/                    # Typed service contracts
│   ├── demo/                        # Seed data & deterministic mock adapter
│   ├── store/                       # Unified React Context balance store
│   └── utils/                       # 6-decimal integer USDC math & formatting
├── programs/
│   └── tax_vault/                   # Full Solana Anchor Rust program
├── tests/                           # Vitest smart contract test suite
├── supabase/
│   └── migrations/                  # PostgreSQL schema & RLS policies
└── docs/                            # Architecture, threat model, demo script
```

---

## 5. Getting Started

### Prerequisites
- Node.js 18+ (tested on Node.js v24)
- npm or pnpm

### Installation
```bash
# Clone and install dependencies
git clone https://github.com/your-username/tax-vault.git
cd tax-vault
npm install
```

### Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### Running Smart Contract Test Suite
```bash
npm run test
```
*Executes all 17 automated tests verifying basis point validation, checked math, PDA derivation, and authorization boundaries.*

### Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Roadmap
- [ ] Card and ACH-to-USDC client on-ramp
- [ ] IRS Direct Pay / EFTPS tax remittance integration
- [ ] INR off-ramp for Indian freelancers
- [ ] Push and SMS statutory tax deadline reminders
- [ ] Formal independent smart contract security audit
- [ ] Production Solana Mainnet-Beta deployment
for usdc payment this is in development mode
