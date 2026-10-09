# Tax Vault — Build Status

## Milestone Status Overview
- [x] **Milestone 0**: Workspace inspection & planning.
- [x] **Milestone 1**: Project scaffolding, TypeScript configuration, dependencies, and design tokens (`#0B0F14`, `#121821`, `#34D399`, `#F5B44A`, `#7C8CFF`, `#F2677A`).
- [x] **Milestone 2**: Solana Anchor smart contract (`programs/tax_vault/src/lib.rs`, `state.rs`, `errors.rs`), Anchor IDL (`lib/solana/idl/tax_vault.json`), and smart contract test suite (`tests/tax_vault.spec.ts`, `tests/math.spec.ts`).
- [x] **Milestone 3**: Typed service architecture (`lib/services/types.ts`), demo adapter, seed data (`lib/demo/seed-data.ts`), and precision 6-decimal integer USDC accounting (`lib/utils/format-usdc.ts`).
- [x] **Milestone 4**: Shared design system components (`AppShell`, `Sidebar`, `Topbar`, `MobileBottomNav`, `ConnectModal`, `DemoDrawer`, `VaultCard`, `SplitDonut`, `ReadinessRing`, `DeadlineCard`, `PendingRuleBanner`, `PaymentTable`, `PaymentDetailsDrawer`, `IncomeTimeline`, `TaxDisclaimer`, `NetworkBadge`, `ThemeToggle`).
- [x] **Milestone 5**: Public routes:
  - `/` Landing page (with live split simulator and interactive preview)
  - `/how-it-works`
  - `/security`
  - `/faq`
  - `/privacy` & `/terms`
  - `/demo` (Guided 2-minute interactive protocol walkthrough)
  - `/pay/[workerPubkey]` (Client invoice, dynamic QR code, and payment page)
- [x] **Milestone 6**: Authenticated App Dashboard & Subroutes:
  - `/app` (Overview dashboard with persistent disclaimers, sparklines, split donut, tax readiness ring, income timeline)
  - `/app/onboarding` (Multi-step onboarding wizard)
  - `/app/vaults` (Spend, Tax, Savings vaults management and permissionless inbox sweeper)
  - `/app/rules` (Split percentages, cooldown, pending changes, precision split tester)
  - `/app/payments` (Transaction history, filters, pagination, details drawer)
  - `/app/clients` (Client management & payment links)
  - `/app/analytics` (Income analytics with Recharts)
  - `/app/deadlines` (US & India tax deadlines with verification status)
  - `/app/payees` (Approved tax payee management & 72h timelock)
  - `/app/export` (CSV export & printable accountant summary)
  - `/app/notifications` (In-app notifications center)
  - `/app/settings` (Profile, network, preferences, reset demo data)
- [x] **Milestone 7**: Supabase migrations, RLS policies (`supabase/migrations/20260101_init.sql`), Server API routes (`/api/health`, `/api/demo/payment`, `/api/export`).
- [x] **Milestone 8**: Quality gates, automated test execution (all 17 tests passed), documentation (`README.md`, `docs/architecture.md`, `docs/threat-model.md`, `docs/demo-script.md`).

---
*Status: All Milestones Implemented and Verified.*
