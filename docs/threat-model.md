# Tax Vault — Threat Model & Security Architecture

## 1. Overview
Tax Vault is a non-custodial Solana financial protocol designed to solve the "accidental tax spending" dilemma for freelancers and contractors receiving USDC. The system splits incoming payments into three accounts: Spend Vault (unrestricted), Tax Vault (locked to approved payee), and Savings Vault (time-locked).

---

## 2. Trust Boundaries & Custody Guarantees
- **Non-Custodial Design**: The smart contract does not grant platform administrators or operators access to user funds. Token accounts are owned exclusively by the Program-Derived Address (PDA) authority derived from the worker's profile.
- **Worker Key Ownership**: Only the worker wallet matching `WorkerProfile.owner` can propose rule changes, update payees, or execute withdrawals.
- **Payee Release Restriction**: Instructions for releasing funds from the Tax Vault strictly require `destination_token_account.owner == profile.tax_payee`. Personal worker hot wallets cannot receive tax releases directly.

---

## 3. Threat Vectors & Mitigations

### 3.1 Accidental or Coerced Tax Spending
- **Threat**: A worker under financial pressure tries to withdraw their locked tax balance to pay discretionary expenses.
- **Mitigation**: The `release_tax` instruction rejects any destination that does not match the active `profile.tax_payee` on-chain.

### 3.2 Sudden Payee Compromise or Redirection
- **Threat**: An attacker compromises the worker's key and tries to immediately change the tax payee to an attacker wallet.
- **Mitigation**: The `propose_payee` instruction imposes a mandatory **72-hour timelock delay**. Funds cannot be released to a newly proposed payee until the delay has elapsed.

### 3.3 Flash Rule Manipulation
- **Threat**: A worker attempts to change their tax allocation to 0% right before a large payment is processed, then revert it later.
- **Mitigation**: The `set_rules` instruction imposes a **24-hour cooldown** before proposed rules can be applied. The minimum tax safeguard enforces an absolute minimum of 5% tax.

### 3.4 Direct Wallet Transfer Interception Limitation
- **Threat**: Client sends USDC directly to the worker's personal address instead of the payment link.
- **Limitation**: The Solana runtime cannot intercept arbitrary generic token transfers. Funds sent directly to a personal wallet are not split. Clients must use payment links or send funds to the designated Vault Inbox PDA, which can be swept permissionlessly.

### 3.5 Precision Rounding Drift
- **Threat**: Division in integer math causes dust token loss or allocation sum mismatch.
- **Mitigation**: Checked integer division ensures `tax = floor(amt * tax_bps / 10000)`, `savings = floor(amt * savings_bps / 10000)`, and any remainder is strictly allocated to the Spend vault so `spend + tax + savings == gross` invariably holds.

---

## 4. Current Status
- **Environment**: Solana Devnet.
- **Audit Status**: Unaudited devnet software. For demonstration, evaluation, and hackathon review only.
