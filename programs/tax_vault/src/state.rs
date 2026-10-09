use anchor_lang::prelude::*;

#[account]
pub struct WorkerProfile {
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub spend_bps: u16,
    pub tax_bps: u16,
    pub savings_bps: u16,
    pub tax_payee: Pubkey,
    
    // Delayed rule transitions
    pub has_pending_rules: bool,
    pub pending_spend_bps: u16,
    pub pending_tax_bps: u16,
    pub pending_savings_bps: u16,
    pub pending_rules_effective_ts: i64,

    // Delayed payee updates
    pub has_pending_payee: bool,
    pub pending_payee: Pubkey,
    pub pending_payee_effective_ts: i64,

    // Savings lock & configurations
    pub savings_unlock_ts: i64,
    pub rules_cooldown_secs: i64,
    pub payee_delay_secs: i64,

    // Cumulative accounting
    pub total_received: u64,
    pub total_tax_reserved: u64,
    pub payment_count: u64,

    pub bump: u8,
}

impl WorkerProfile {
    pub const LEN: usize = 8 + // discriminator
        32 + // owner
        32 + // mint
        2 +  // spend_bps
        2 +  // tax_bps
        2 +  // savings_bps
        32 + // tax_payee
        1 +  // has_pending_rules
        2 +  // pending_spend_bps
        2 +  // pending_tax_bps
        2 +  // pending_savings_bps
        8 +  // pending_rules_effective_ts
        1 +  // has_pending_payee
        32 + // pending_payee
        8 +  // pending_payee_effective_ts
        8 +  // savings_unlock_ts
        8 +  // rules_cooldown_secs
        8 +  // payee_delay_secs
        8 +  // total_received
        8 +  // total_tax_reserved
        8 +  // payment_count
        1 +  // bump
        64;  // padding for future upgrades
}

#[account]
pub struct PaymentRecord {
    pub profile: Pubkey,
    pub payer: Pubkey,
    pub gross_amount: u64,
    pub spend_amount: u64,
    pub tax_amount: u64,
    pub savings_amount: u64,
    pub timestamp: i64,
    pub payment_seq: u64,
}

impl PaymentRecord {
    pub const LEN: usize = 8 + // discriminator
        32 + // profile
        32 + // payer
        8 +  // gross_amount
        8 +  // spend_amount
        8 +  // tax_amount
        8 +  // savings_amount
        8 +  // timestamp
        8 +  // payment_seq
        32;  // padding
}

#[event]
pub struct PaymentReceived {
    pub profile: Pubkey,
    pub payer: Pubkey,
    pub gross_amount: u64,
    pub spend_amount: u64,
    pub tax_amount: u64,
    pub savings_amount: u64,
    pub timestamp: i64,
    pub payment_seq: u64,
}

#[event]
pub struct TaxReleased {
    pub profile: Pubkey,
    pub payee: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct RulesProposed {
    pub profile: Pubkey,
    pub proposed_spend_bps: u16,
    pub proposed_tax_bps: u16,
    pub proposed_savings_bps: u16,
    pub effective_ts: i64,
}

#[event]
pub struct RulesApplied {
    pub profile: Pubkey,
    pub active_spend_bps: u16,
    pub active_tax_bps: u16,
    pub active_savings_bps: u16,
}
