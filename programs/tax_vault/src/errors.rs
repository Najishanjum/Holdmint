use anchor_lang::prelude::*;

#[error_code]
pub enum TaxVaultError {
    #[msg("Basis points must sum to exactly 10,000 (100.00%)")]
    InvalidBasisPointsSum,

    #[msg("Tax basis points cannot be below the minimum configured safeguard")]
    TaxBelowMinimumSafeguard,

    #[msg("Payment amount must be greater than zero base units")]
    ZeroPaymentAmount,

    #[msg("Invalid token mint: account mint does not match profile mint")]
    InvalidMint,

    #[msg("Unauthorized: Signer does not match profile owner")]
    UnauthorizedOwner,

    #[msg("Tax funds can only be released to the worker's active approved tax payee")]
    UnauthorizedTaxPayee,

    #[msg("Savings vault funds are time-locked and cannot be withdrawn prior to the unlock timestamp")]
    SavingsLocked,

    #[msg("The cooldown period for proposed rule changes has not elapsed yet")]
    RulesCooldownNotElapsed,

    #[msg("No pending rule changes exist on this profile")]
    NoPendingRules,

    #[msg("The change delay for the proposed tax payee has not elapsed yet")]
    PayeeDelayNotElapsed,

    #[msg("No pending payee change exists on this profile")]
    NoPendingPayee,

    #[msg("Arithmetic overflow or underflow occurred during token allocation")]
    MathOverflow,

    #[msg("Insufficient balance in the specified vault")]
    InsufficientBalance,

    #[msg("Inbox is empty; no tokens available to sweep")]
    InboxEmpty,
}
