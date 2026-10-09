-- Tax Vault Supabase Schema & Row-Level Security Policies
-- Precision 6-decimal integer USDC accounting (amounts in base units: 1 USDC = 1,000,000)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    owner_pubkey TEXT NOT NULL UNIQUE,
    display_name TEXT DEFAULT 'Alex Morgan',
    email TEXT,
    spend_bps INTEGER NOT NULL DEFAULT 7000 CHECK (spend_bps >= 0 AND spend_bps <= 10000),
    tax_bps INTEGER NOT NULL DEFAULT 2500 CHECK (tax_bps >= 500 AND tax_bps <= 10000),
    savings_bps INTEGER NOT NULL DEFAULT 500 CHECK (savings_bps >= 0 AND savings_bps <= 10000),
    tax_payee_pubkey TEXT NOT NULL,
    savings_unlock_ts BIGINT NOT NULL DEFAULT 0,
    rules_cooldown_secs BIGINT NOT NULL DEFAULT 86400,
    payee_delay_secs BIGINT NOT NULL DEFAULT 259200,
    projected_tax_need_base_units BIGINT NOT NULL DEFAULT 2500000000, -- $2,500.00
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT total_bps_check CHECK (spend_bps + tax_bps + savings_bps = 10000)
);

-- 2. Worker Preferences
CREATE TABLE IF NOT EXISTS public.worker_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    jurisdiction_mode TEXT NOT NULL DEFAULT 'US' CHECK (jurisdiction_mode IN ('US', 'IN')),
    currency_display TEXT NOT NULL DEFAULT 'USDC',
    dark_mode BOOLEAN NOT NULL DEFAULT true,
    email_notifications BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 3. Client Profiles
CREATE TABLE IF NOT EXISTS public.client_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    company TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 4. Payment Links
CREATE TABLE IF NOT EXISTS public.payment_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.client_profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    reference TEXT NOT NULL UNIQUE,
    fixed_amount_base_units BIGINT, -- NULL for flexible client payment
    memo TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paid', 'expired', 'archived')),
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 5. Payment Records
CREATE TABLE IF NOT EXISTS public.payment_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    worker_pubkey TEXT NOT NULL,
    payer_pubkey TEXT NOT NULL,
    payer_name TEXT NOT NULL DEFAULT 'Client',
    invoice_ref TEXT,
    gross_amount_base_units BIGINT NOT NULL CHECK (gross_amount_base_units > 0),
    spend_amount_base_units BIGINT NOT NULL,
    tax_amount_base_units BIGINT NOT NULL,
    savings_amount_base_units BIGINT NOT NULL,
    tx_signature TEXT,
    demo_tx_id TEXT,
    is_simulated BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirming', 'confirmed', 'failed', 'simulated')),
    block_timestamp BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT payment_accounting_check CHECK (spend_amount_base_units + tax_amount_base_units + savings_amount_base_units = gross_amount_base_units)
);

-- 6. Rule Change History
CREATE TABLE IF NOT EXISTS public.rule_change_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    prev_spend_bps INTEGER NOT NULL,
    prev_tax_bps INTEGER NOT NULL,
    prev_savings_bps INTEGER NOT NULL,
    proposed_spend_bps INTEGER NOT NULL,
    proposed_tax_bps INTEGER NOT NULL,
    proposed_savings_bps INTEGER NOT NULL,
    proposed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    effective_at TIMESTAMPTZ NOT NULL,
    applied_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'cancelled')),
    tx_signature TEXT,
    is_simulated BOOLEAN NOT NULL DEFAULT false
);

-- 7. Payee Change History
CREATE TABLE IF NOT EXISTS public.payee_change_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    prev_payee_pubkey TEXT NOT NULL,
    proposed_payee_pubkey TEXT NOT NULL,
    proposed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    effective_at TIMESTAMPTZ NOT NULL,
    applied_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'cancelled')),
    tx_signature TEXT,
    is_simulated BOOLEAN NOT NULL DEFAULT false
);

-- 8. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('payment_received', 'payment_confirmed', 'payment_failed', 'rules_proposed', 'rules_ready', 'payee_proposed', 'payee_ready', 'savings_unlocked', 'deadline_approaching', 'export_completed')),
    action_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 9. Export Jobs
CREATE TABLE IF NOT EXISTS public.export_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    format TEXT NOT NULL DEFAULT 'csv',
    record_count INTEGER NOT NULL,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 10. Demo Sessions (for tracking ephemeral live simulation without leaking)
CREATE TABLE IF NOT EXISTS public.demo_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now() + INTERVAL '2 hours')
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rule_change_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payee_change_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_jobs ENABLE ROW LEVEL SECURITY;

-- Profiles: Authenticated users can only read and update their own profile
CREATE POLICY "Users can manage own profile"
    ON public.profiles FOR ALL
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Worker Preferences: Authenticated users can only manage own preferences
CREATE POLICY "Users can manage own preferences"
    ON public.worker_preferences FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Client Profiles: Scoped strictly to authenticated owner
CREATE POLICY "Users can manage own clients"
    ON public.client_profiles FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Payment Links: Worker can manage, Public can view active minimal invoice details without auth
CREATE POLICY "Workers can manage payment links"
    ON public.payment_links FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view active payment links"
    ON public.payment_links FOR SELECT
    USING (status = 'active');

-- Payment Records: Workers can read their own records
CREATE POLICY "Workers can read own payment records"
    ON public.payment_records FOR SELECT
    USING (auth.uid() = user_id);

-- Notifications: Workers can read and update their notifications
CREATE POLICY "Workers can manage own notifications"
    ON public.notifications FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Rule and Payee Change History: Scoped to owner
CREATE POLICY "Workers can read own rule history"
    ON public.rule_change_history FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Workers can read own payee history"
    ON public.payee_change_history FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
