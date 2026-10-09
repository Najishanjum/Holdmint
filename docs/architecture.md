# Tax Vault — Technical Architecture

```
                                      +--------------------------+
                                      |     Client / Payer       |
                                      +-------------+------------+
                                                    |
                                      USDC Payment  | pay_worker(amt)
                                                    v
+--------------------------------------------------------------------------------------------+
|                                    Tax Vault Solana Program                                |
|                                                                                            |
|   +-----------------------+              PDA Seeds: ["profile", owner]                     |
|   |     WorkerProfile     | <-----------------------------------------+                    |
|   | - spend_bps (7000)    |                                           |                    |
|   | - tax_bps   (2500)    |              PDA Seeds: ["vault_auth", profile]                |
|   | - savings_bps (500)   |                                           |                    |
|   | - tax_payee (Pubkey)  |                                           |                    |
|   +-----------+-----------+                                           |                    |
|               |                                                       |                    |
|               | Checked Integer Split:                                |                    |
|               | tax     = floor(amount * tax_bps / 10000)             |                    |
|               | savings = floor(amount * savings_bps / 10000)         |                    |
|               | spend   = amount - tax - savings                      |                    |
|               |                                                       v                    |
|               +-------------------------------+---------------+-----------------------+    |
|                                               |               |                       |    |
|                                               v               v                       v    |
|                                      +----------------+----------------+----------------+  |
|                                      |  Spend Vault   |   Tax Vault    |  Savings Vault |  |
|                                      |  (PDA Token)   |  (PDA Token)   |  (PDA Token)   |  |
|                                      +--------+-------+--------+-------+--------+-------+  |
+-----------------------------------------------|----------------|----------------|----------+
                                                |                |                |
                                    withdraw_spend()       release_tax()    withdraw_savings()
                                    [Unrestricted]         [Payee ONLY]     [After unlock_ts]
                                                |                |                |
                                                v                v                v
                                        +---------------+----------------+----------------+
                                        | Worker Wallet | Approved Payee | Worker Wallet  |
                                        +---------------+----------------+----------------+
```

## System Components
1. **Frontend**: Next.js 14 App Router, TypeScript (Strict), Tailwind CSS, Framer Motion, Recharts, Lucide Icons, next-themes.
2. **Solana Anchor Program**: `programs/tax_vault` with PDA token vault accounts, checked u128 math, timelock safeguards.
3. **Database / Persistence**: Supabase PostgreSQL schema with Row-Level Security (RLS) policies (`supabase/migrations/`).
4. **State Management**: Unified React Context store with LocalStorage persistence and 6-decimal integer USDC accounting.
5. **Testing Suite**: Automated Vitest test suite executing smart-contract math invariants, PDA validations, and authorization boundaries.
