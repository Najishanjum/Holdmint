# Tax Vault — Two-Minute Live Demo Script

**Total Duration**: 2 minutes (120 seconds)  
**Presenter Tone**: Calm, confident fintech product walkthrough.  
**Key Persona**: Freelance Solana software engineer / consultant receiving client USDC payments.

---

### [0:00 – 0:15] Introduction
> *"Freelancers often receive income first and think about taxes later. When quarterly estimated taxes are due, the cash has often been spent by accident. Tax Vault fixes this at the source by routing incoming USDC payments into three worker-controlled vaults: Spend, Tax, and Savings."*
- **Action**: Show landing page at `/` or dashboard at `/app`. Highlight the three animated vault cards.

---

### [0:15 – 0:30] Configure the Split
> *"In the Rules tab, I configure my split: 70% Spend for daily operational expenses, 25% to the locked Tax Vault, and 5% to time-locked Savings. Notice that any rule changes are protected by a 24-hour timelock cooldown, preventing impulsive changes."*
- **Action**: Navigate to `/app/rules`. Move sliders or select the 'Balanced' preset.

---

### [0:30 – 0:55] Receive $1,000 Client Payment
> *"Let's simulate a $1,000 USDC payment from Acme Studio. Our smart-contract engine executes an atomic split using 6-decimal integer arithmetic."*
- **Action**: Open the Live Simulator drawer (or navigate to `/demo`). Execute a $1,000 payment.
- **Result**:
  - Spend Vault receives **$700.00**
  - Tax Vault receives **$250.00**
  - Savings Vault receives **$50.00**
  - Dashboard balances and timeline update in real-time.

---

### [0:55 – 1:10] Withdraw Liquid Spend
> *"My Spend Vault is completely liquid. I can withdraw $200 right now to my personal Solana wallet for everyday expenses without delay or restriction."*
- **Action**: Click 'Withdraw to Wallet' on the Spend Vault card and confirm.

---

### [1:10 – 1:30] Demonstrate Smart-Contract Tax Protection
> *"Now for the core protection: what happens if I try to withdraw from the Tax Vault to my personal wallet? Let's try it."*
- **Action**: Click 'Release to Payee' on the Tax Vault card. Enter an unauthorized address.
- **Contract Response**: 
  > *"The transaction is instantly rejected on-chain with `UnauthorizedTaxPayee`. Tax funds can ONLY be released to my pre-approved tax payee address."*
- **Action**: Submit the release to the approved payee address. The transaction succeeds.

---

### [1:30 – 1:45] Show Savings Time Lock
> *"In the Savings Vault, my funds are subject to a 90-day time lock. Withdrawals prior to the unlock timestamp are prohibited on-chain, helping me build a solid treasury reserve."*
- **Action**: Point out the countdown badge and lock timestamp on the Savings Vault card.

---

### [1:45 – 2:00] US / India Modes and Accountant Exports
> *"In our Deadlines tab, I can toggle between US IRS quarterly dates and Indian Advance Tax schedules with verified source links. Finally, in Export, I can download a complete CSV audit ledger and generate a printable accountant summary sheet."*
- **Action**: Toggle US/IN in `/app/deadlines`, then download the CSV report at `/app/export`.
- **Closing**:
  > *"Tax Vault doesn't calculate or file your taxes. It helps you separate and protect the money you set aside. Non-custodial, enforced at the source."*
