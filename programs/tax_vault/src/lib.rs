use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

pub mod errors;
pub mod state;

use errors::TaxVaultError;
use state::*;

declare_id!("TaxVauLt111111111111111111111111111111111111");

pub const BPS_DENOMINATOR: u64 = 10_000;
pub const MIN_TAX_BPS_SAFEGUARD: u16 = 500; // 5% absolute minimum safety threshold

#[program]
pub mod tax_vault {
    use super::*;

    /// Initialize a new WorkerProfile with Spend, Tax, and Savings rule parameters.
    pub fn init_profile(
        ctx: Context<InitProfile>,
        spend_bps: u16,
        tax_bps: u16,
        savings_bps: u16,
        tax_payee: Pubkey,
        savings_unlock_ts: i64,
        rules_cooldown_secs: i64,
        payee_delay_secs: i64,
    ) -> Result<()> {
        let total_bps = (spend_bps as u64)
            .checked_add(tax_bps as u64)
            .and_then(|v| v.checked_add(savings_bps as u64))
            .ok_or(TaxVaultError::MathOverflow)?;

        require!(total_bps == BPS_DENOMINATOR, TaxVaultError::InvalidBasisPointsSum);
        require!(tax_bps >= MIN_TAX_BPS_SAFEGUARD, TaxVaultError::TaxBelowMinimumSafeguard);

        let profile = &mut ctx.accounts.profile;
        profile.owner = ctx.accounts.owner.key();
        profile.mint = ctx.accounts.mint.key();
        profile.spend_bps = spend_bps;
        profile.tax_bps = tax_bps;
        profile.savings_bps = savings_bps;
        profile.tax_payee = tax_payee;
        profile.has_pending_rules = false;
        profile.pending_spend_bps = 0;
        profile.pending_tax_bps = 0;
        profile.pending_savings_bps = 0;
        profile.pending_rules_effective_ts = 0;
        profile.has_pending_payee = false;
        profile.pending_payee = Pubkey::default();
        profile.pending_payee_effective_ts = 0;
        profile.savings_unlock_ts = savings_unlock_ts;
        profile.rules_cooldown_secs = rules_cooldown_secs;
        profile.payee_delay_secs = payee_delay_secs;
        profile.total_received = 0;
        profile.total_tax_reserved = 0;
        profile.payment_count = 0;
        profile.bump = ctx.bumps.profile;

        Ok(())
    }

    /// Propose a rule split change subject to worker's configured cooldown.
    pub fn set_rules(
        ctx: Context<WorkerSignerContext>,
        spend_bps: u16,
        tax_bps: u16,
        savings_bps: u16,
    ) -> Result<()> {
        let total_bps = (spend_bps as u64)
            .checked_add(tax_bps as u64)
            .and_then(|v| v.checked_add(savings_bps as u64))
            .ok_or(TaxVaultError::MathOverflow)?;

        require!(total_bps == BPS_DENOMINATOR, TaxVaultError::InvalidBasisPointsSum);
        require!(tax_bps >= MIN_TAX_BPS_SAFEGUARD, TaxVaultError::TaxBelowMinimumSafeguard);

        let profile = &mut ctx.accounts.profile;
        let clock = Clock::get()?;
        let effective_ts = clock
            .unix_timestamp
            .checked_add(profile.rules_cooldown_secs)
            .ok_or(TaxVaultError::MathOverflow)?;

        profile.has_pending_rules = true;
        profile.pending_spend_bps = spend_bps;
        profile.pending_tax_bps = tax_bps;
        profile.pending_savings_bps = savings_bps;
        profile.pending_rules_effective_ts = effective_ts;

        emit!(RulesProposed {
            profile: profile.key(),
            proposed_spend_bps: spend_bps,
            proposed_tax_bps: tax_bps,
            proposed_savings_bps: savings_bps,
            effective_ts,
        });

        Ok(())
    }

    /// Apply proposed rules once the cooldown has passed.
    pub fn apply_rules(ctx: Context<WorkerSignerContext>) -> Result<()> {
        let profile = &mut ctx.accounts.profile;
        require!(profile.has_pending_rules, TaxVaultError::NoPendingRules);

        let clock = Clock::get()?;
        require!(
            clock.unix_timestamp >= profile.pending_rules_effective_ts,
            TaxVaultError::RulesCooldownNotElapsed
        );

        profile.spend_bps = profile.pending_spend_bps;
        profile.tax_bps = profile.pending_tax_bps;
        profile.savings_bps = profile.pending_savings_bps;
        profile.has_pending_rules = false;
        profile.pending_rules_effective_ts = 0;

        emit!(RulesApplied {
            profile: profile.key(),
            active_spend_bps: profile.spend_bps,
            active_tax_bps: profile.tax_bps,
            active_savings_bps: profile.savings_bps,
        });

        Ok(())
    }

    /// Propose changing the approved tax payee.
    pub fn propose_payee(ctx: Context<WorkerSignerContext>, new_payee: Pubkey) -> Result<()> {
        let profile = &mut ctx.accounts.profile;
        let clock = Clock::get()?;
        let effective_ts = clock
            .unix_timestamp
            .checked_add(profile.payee_delay_secs)
            .ok_or(TaxVaultError::MathOverflow)?;

        profile.has_pending_payee = true;
        profile.pending_payee = new_payee;
        profile.pending_payee_effective_ts = effective_ts;

        Ok(())
    }

    /// Apply proposed approved tax payee once delay has elapsed.
    pub fn apply_payee(ctx: Context<WorkerSignerContext>) -> Result<()> {
        let profile = &mut ctx.accounts.profile;
        require!(profile.has_pending_payee, TaxVaultError::NoPendingPayee);

        let clock = Clock::get()?;
        require!(
            clock.unix_timestamp >= profile.pending_payee_effective_ts,
            TaxVaultError::PayeeDelayNotElapsed
        );

        profile.tax_payee = profile.pending_payee;
        profile.has_pending_payee = false;
        profile.pending_payee_effective_ts = 0;

        Ok(())
    }

    /// Process an incoming payment from a client and split atomically into Spend, Tax, and Savings.
    pub fn pay_worker(ctx: Context<PayWorker>, amount: u64) -> Result<()> {
        require!(amount > 0, TaxVaultError::ZeroPaymentAmount);

        let profile = &mut ctx.accounts.profile;

        // Checked integer calculation:
        // tax = floor(amount * tax_bps / 10000)
        let tax_amount = (amount as u128)
            .checked_mul(profile.tax_bps as u128)
            .ok_or(TaxVaultError::MathOverflow)?
            .checked_div(BPS_DENOMINATOR as u128)
            .ok_or(TaxVaultError::MathOverflow)? as u64;

        // savings = floor(amount * savings_bps / 10000)
        let savings_amount = (amount as u128)
            .checked_mul(profile.savings_bps as u128)
            .ok_or(TaxVaultError::MathOverflow)?
            .checked_div(BPS_DENOMINATOR as u128)
            .ok_or(TaxVaultError::MathOverflow)? as u64;

        // Remainder strictly to spend: spend = amount - tax - savings
        let spend_amount = amount
            .checked_sub(tax_amount)
            .and_then(|v| v.checked_sub(savings_amount))
            .ok_or(TaxVaultError::MathOverflow)?;

        // Transfer client tokens to Spend Vault
        if spend_amount > 0 {
            token::transfer(
                CpiContext::new(
                    ctx.accounts.token_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.payer_token_account.to_account_info(),
                        to: ctx.accounts.spend_vault.to_account_info(),
                        authority: ctx.accounts.payer.to_account_info(),
                    },
                ),
                spend_amount,
            )?;
        }

        // Transfer client tokens to Tax Vault
        if tax_amount > 0 {
            token::transfer(
                CpiContext::new(
                    ctx.accounts.token_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.payer_token_account.to_account_info(),
                        to: ctx.accounts.tax_vault.to_account_info(),
                        authority: ctx.accounts.payer.to_account_info(),
                    },
                ),
                tax_amount,
            )?;
        }

        // Transfer client tokens to Savings Vault
        if savings_amount > 0 {
            token::transfer(
                CpiContext::new(
                    ctx.accounts.token_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.payer_token_account.to_account_info(),
                        to: ctx.accounts.savings_vault.to_account_info(),
                        authority: ctx.accounts.payer.to_account_info(),
                    },
                ),
                savings_amount,
            )?;
        }

        // Update profile statistics
        profile.total_received = profile
            .total_received
            .checked_add(amount)
            .ok_or(TaxVaultError::MathOverflow)?;
        profile.total_tax_reserved = profile
            .total_tax_reserved
            .checked_add(tax_amount)
            .ok_or(TaxVaultError::MathOverflow)?;
        let payment_seq = profile.payment_count;
        profile.payment_count = profile
            .payment_count
            .checked_add(1)
            .ok_or(TaxVaultError::MathOverflow)?;

        // Record payment
        let clock = Clock::get()?;
        let payment_record = &mut ctx.accounts.payment_record;
        payment_record.profile = profile.key();
        payment_record.payer = ctx.accounts.payer.key();
        payment_record.gross_amount = amount;
        payment_record.spend_amount = spend_amount;
        payment_record.tax_amount = tax_amount;
        payment_record.savings_amount = savings_amount;
        payment_record.timestamp = clock.unix_timestamp;
        payment_record.payment_seq = payment_seq;

        emit!(PaymentReceived {
            profile: profile.key(),
            payer: ctx.accounts.payer.key(),
            gross_amount: amount,
            spend_amount,
            tax_amount,
            savings_amount,
            timestamp: clock.unix_timestamp,
            payment_seq,
        });

        Ok(())
    }

    /// Permissionless Inbox sweep: splits whatever balance is sitting in Inbox according to active rules.
    pub fn sweep_inbox(ctx: Context<SweepInbox>) -> Result<()> {
        let inbox_balance = ctx.accounts.inbox.amount;
        require!(inbox_balance > 0, TaxVaultError::InboxEmpty);

        let profile = &mut ctx.accounts.profile;

        let tax_amount = (inbox_balance as u128)
            .checked_mul(profile.tax_bps as u128)
            .ok_or(TaxVaultError::MathOverflow)?
            .checked_div(BPS_DENOMINATOR as u128)
            .ok_or(TaxVaultError::MathOverflow)? as u64;

        let savings_amount = (inbox_balance as u128)
            .checked_mul(profile.savings_bps as u128)
            .ok_or(TaxVaultError::MathOverflow)?
            .checked_div(BPS_DENOMINATOR as u128)
            .ok_or(TaxVaultError::MathOverflow)? as u64;

        let spend_amount = inbox_balance
            .checked_sub(tax_amount)
            .and_then(|v| v.checked_sub(savings_amount))
            .ok_or(TaxVaultError::MathOverflow)?;

        let profile_key = profile.key();
        let auth_seeds = &[
            b"vault_auth",
            profile_key.as_ref(),
            &[ctx.bumps.vault_authority],
        ];
        let signer_seeds = &[&auth_seeds[..]];

        if spend_amount > 0 {
            token::transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.inbox.to_account_info(),
                        to: ctx.accounts.spend_vault.to_account_info(),
                        authority: ctx.accounts.vault_authority.to_account_info(),
                    },
                    signer_seeds,
                ),
                spend_amount,
            )?;
        }

        if tax_amount > 0 {
            token::transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.inbox.to_account_info(),
                        to: ctx.accounts.tax_vault.to_account_info(),
                        authority: ctx.accounts.vault_authority.to_account_info(),
                    },
                    signer_seeds,
                ),
                tax_amount,
            )?;
        }

        if savings_amount > 0 {
            token::transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.inbox.to_account_info(),
                        to: ctx.accounts.savings_vault.to_account_info(),
                        authority: ctx.accounts.vault_authority.to_account_info(),
                    },
                    signer_seeds,
                ),
                savings_amount,
            )?;
        }

        profile.total_received = profile
            .total_received
            .checked_add(inbox_balance)
            .ok_or(TaxVaultError::MathOverflow)?;
        profile.total_tax_reserved = profile
            .total_tax_reserved
            .checked_add(tax_amount)
            .ok_or(TaxVaultError::MathOverflow)?;

        Ok(())
    }

    /// Worker withdraws funds from Spend Vault to their destination token account.
    pub fn withdraw_spend(ctx: Context<WithdrawSpend>, amount: u64) -> Result<()> {
        require!(amount > 0, TaxVaultError::ZeroPaymentAmount);
        require!(
            ctx.accounts.spend_vault.amount >= amount,
            TaxVaultError::InsufficientBalance
        );

        let profile_key = ctx.accounts.profile.key();
        let auth_seeds = &[
            b"vault_auth",
            profile_key.as_ref(),
            &[ctx.bumps.vault_authority],
        ];
        let signer_seeds = &[&auth_seeds[..]];

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.spend_vault.to_account_info(),
                    to: ctx.accounts.worker_token_account.to_account_info(),
                    authority: ctx.accounts.vault_authority.to_account_info(),
                },
                signer_seeds,
            ),
            amount,
        )?;

        Ok(())
    }

    /// Worker releases tax funds ONLY to the approved tax payee's token account.
    pub fn release_tax(ctx: Context<ReleaseTax>, amount: u64) -> Result<()> {
        require!(amount > 0, TaxVaultError::ZeroPaymentAmount);
        require!(
            ctx.accounts.tax_vault.amount >= amount,
            TaxVaultError::InsufficientBalance
        );

        // Security assertion: Tax payee must match active profile approved payee
        require!(
            ctx.accounts.payee_token_account.owner == ctx.accounts.profile.tax_payee,
            TaxVaultError::UnauthorizedTaxPayee
        );

        let profile_key = ctx.accounts.profile.key();
        let auth_seeds = &[
            b"vault_auth",
            profile_key.as_ref(),
            &[ctx.bumps.vault_authority],
        ];
        let signer_seeds = &[&auth_seeds[..]];

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.tax_vault.to_account_info(),
                    to: ctx.accounts.payee_token_account.to_account_info(),
                    authority: ctx.accounts.vault_authority.to_account_info(),
                },
                signer_seeds,
            ),
            amount,
        )?;

        let clock = Clock::get()?;
        emit!(TaxReleased {
            profile: profile_key,
            payee: ctx.accounts.profile.tax_payee,
            amount,
            timestamp: clock.unix_timestamp,
        });

        Ok(())
    }

    /// Worker withdraws funds from Savings Vault after the unlock timestamp.
    pub fn withdraw_savings(ctx: Context<WithdrawSavings>, amount: u64) -> Result<()> {
        require!(amount > 0, TaxVaultError::ZeroPaymentAmount);
        require!(
            ctx.accounts.savings_vault.amount >= amount,
            TaxVaultError::InsufficientBalance
        );

        let clock = Clock::get()?;
        require!(
            clock.unix_timestamp >= ctx.accounts.profile.savings_unlock_ts,
            TaxVaultError::SavingsLocked
        );

        let profile_key = ctx.accounts.profile.key();
        let auth_seeds = &[
            b"vault_auth",
            profile_key.as_ref(),
            &[ctx.bumps.vault_authority],
        ];
        let signer_seeds = &[&auth_seeds[..]];

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.savings_vault.to_account_info(),
                    to: ctx.accounts.worker_token_account.to_account_info(),
                    authority: ctx.accounts.vault_authority.to_account_info(),
                },
                signer_seeds,
            ),
            amount,
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitProfile<'info> {
    #[account(
        init,
        payer = owner,
        space = WorkerProfile::LEN,
        seeds = [b"profile", owner.key().as_ref()],
        bump
    )]
    pub profile: Account<'info, WorkerProfile>,

    /// CHECK: PDA authority for holding tokens
    #[account(
        seeds = [b"vault_auth", profile.key().as_ref()],
        bump
    )]
    pub vault_authority: AccountInfo<'info>,

    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct WorkerSignerContext<'info> {
    #[account(
        mut,
        seeds = [b"profile", owner.key().as_ref()],
        bump = profile.bump,
        has_one = owner @ TaxVaultError::UnauthorizedOwner
    )]
    pub profile: Account<'info, WorkerProfile>,

    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct PayWorker<'info> {
    #[account(
        mut,
        seeds = [b"profile", profile.owner.as_ref()],
        bump = profile.bump,
        has_one = mint @ TaxVaultError::InvalidMint
    )]
    pub profile: Account<'info, WorkerProfile>,

    /// CHECK: PDA authority for vaults
    #[account(
        seeds = [b"vault_auth", profile.key().as_ref()],
        bump
    )]
    pub vault_authority: AccountInfo<'info>,

    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        constraint = payer_token_account.mint == mint.key() @ TaxVaultError::InvalidMint
    )]
    pub payer_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = spend_vault.mint == mint.key() @ TaxVaultError::InvalidMint,
        constraint = spend_vault.owner == vault_authority.key() @ TaxVaultError::UnauthorizedOwner
    )]
    pub spend_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = tax_vault.mint == mint.key() @ TaxVaultError::InvalidMint,
        constraint = tax_vault.owner == vault_authority.key() @ TaxVaultError::UnauthorizedOwner
    )]
    pub tax_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = savings_vault.mint == mint.key() @ TaxVaultError::InvalidMint,
        constraint = savings_vault.owner == vault_authority.key() @ TaxVaultError::UnauthorizedOwner
    )]
    pub savings_vault: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = payer,
        space = PaymentRecord::LEN,
        seeds = [b"payment", profile.key().as_ref(), &profile.payment_count.to_le_bytes()],
        bump
    )]
    pub payment_record: Account<'info, PaymentRecord>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct SweepInbox<'info> {
    #[account(
        mut,
        seeds = [b"profile", profile.owner.as_ref()],
        bump = profile.bump,
        has_one = mint @ TaxVaultError::InvalidMint
    )]
    pub profile: Account<'info, WorkerProfile>,

    /// CHECK: PDA authority
    #[account(
        seeds = [b"vault_auth", profile.key().as_ref()],
        bump
    )]
    pub vault_authority: AccountInfo<'info>,

    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        constraint = inbox.mint == mint.key() @ TaxVaultError::InvalidMint,
        constraint = inbox.owner == vault_authority.key() @ TaxVaultError::UnauthorizedOwner
    )]
    pub inbox: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = spend_vault.mint == mint.key() @ TaxVaultError::InvalidMint,
        constraint = spend_vault.owner == vault_authority.key() @ TaxVaultError::UnauthorizedOwner
    )]
    pub spend_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = tax_vault.mint == mint.key() @ TaxVaultError::InvalidMint,
        constraint = tax_vault.owner == vault_authority.key() @ TaxVaultError::UnauthorizedOwner
    )]
    pub tax_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = savings_vault.mint == mint.key() @ TaxVaultError::InvalidMint,
        constraint = savings_vault.owner == vault_authority.key() @ TaxVaultError::UnauthorizedOwner
    )]
    pub savings_vault: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct WithdrawSpend<'info> {
    #[account(
        seeds = [b"profile", owner.key().as_ref()],
        bump = profile.bump,
        has_one = owner @ TaxVaultError::UnauthorizedOwner,
        has_one = mint @ TaxVaultError::InvalidMint
    )]
    pub profile: Account<'info, WorkerProfile>,

    /// CHECK: PDA authority
    #[account(
        seeds = [b"vault_auth", profile.key().as_ref()],
        bump
    )]
    pub vault_authority: AccountInfo<'info>,

    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        constraint = spend_vault.mint == mint.key() @ TaxVaultError::InvalidMint,
        constraint = spend_vault.owner == vault_authority.key() @ TaxVaultError::UnauthorizedOwner
    )]
    pub spend_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = worker_token_account.mint == mint.key() @ TaxVaultError::InvalidMint,
        constraint = worker_token_account.owner == owner.key() @ TaxVaultError::UnauthorizedOwner
    )]
    pub worker_token_account: Account<'info, TokenAccount>,

    pub owner: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ReleaseTax<'info> {
    #[account(
        seeds = [b"profile", owner.key().as_ref()],
        bump = profile.bump,
        has_one = owner @ TaxVaultError::UnauthorizedOwner,
        has_one = mint @ TaxVaultError::InvalidMint
    )]
    pub profile: Account<'info, WorkerProfile>,

    /// CHECK: PDA authority
    #[account(
        seeds = [b"vault_auth", profile.key().as_ref()],
        bump
    )]
    pub vault_authority: AccountInfo<'info>,

    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        constraint = tax_vault.mint == mint.key() @ TaxVaultError::InvalidMint,
        constraint = tax_vault.owner == vault_authority.key() @ TaxVaultError::UnauthorizedOwner
    )]
    pub tax_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = payee_token_account.mint == mint.key() @ TaxVaultError::InvalidMint,
        constraint = payee_token_account.owner == profile.tax_payee @ TaxVaultError::UnauthorizedTaxPayee
    )]
    pub payee_token_account: Account<'info, TokenAccount>,

    pub owner: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct WithdrawSavings<'info> {
    #[account(
        seeds = [b"profile", owner.key().as_ref()],
        bump = profile.bump,
        has_one = owner @ TaxVaultError::UnauthorizedOwner,
        has_one = mint @ TaxVaultError::InvalidMint
    )]
    pub profile: Account<'info, WorkerProfile>,

    /// CHECK: PDA authority
    #[account(
        seeds = [b"vault_auth", profile.key().as_ref()],
        bump
    )]
    pub vault_authority: AccountInfo<'info>,

    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        constraint = savings_vault.mint == mint.key() @ TaxVaultError::InvalidMint,
        constraint = savings_vault.owner == vault_authority.key() @ TaxVaultError::UnauthorizedOwner
    )]
    pub savings_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = worker_token_account.mint == mint.key() @ TaxVaultError::InvalidMint,
        constraint = worker_token_account.owner == owner.key() @ TaxVaultError::UnauthorizedOwner
    )]
    pub worker_token_account: Account<'info, TokenAccount>,

    pub owner: Signer<'info>,
    pub token_program: Program<'info, Token>,
}
