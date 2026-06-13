-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

--------------------------------------------------
-- USERS
--------------------------------------------------

CREATE TABLE users (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

--------------------------------------------------
-- CATEGORIES
--------------------------------------------------

CREATE TABLE categories (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL,

    type VARCHAR(20) NOT NULL
        CHECK(type IN ('income','expense')),

    is_system BOOLEAN NOT NULL DEFAULT FALSE,

    user_id UUID,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_category_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_user_category
        UNIQUE(user_id, name)
);

--------------------------------------------------
-- TRANSACTIONS
--------------------------------------------------

CREATE TABLE transactions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    category_id UUID,

    amount NUMERIC(15,2) NOT NULL
        CHECK(amount > 0),

    transaction_type VARCHAR(20) NOT NULL
        CHECK(transaction_type IN ('income','expense','refund')),

    currency CHAR(3) NOT NULL
        CHECK(length(currency)=3)
        CHECK(currency = UPPER(currency))
        DEFAULT 'USD',

    description TEXT,

    transaction_date DATE NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_transaction_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_transaction_category
        FOREIGN KEY(category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL
);

--------------------------------------------------
-- BUDGETS
--------------------------------------------------

CREATE TABLE budgets (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    category_id UUID NOT NULL,

    amount NUMERIC(15,2) NOT NULL
        CHECK(amount > 0),

    budget_period DATE NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_budget_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_budget_category
        FOREIGN KEY(category_id)
        REFERENCES categories(id)
        ON DELETE CASCADE
);

--------------------------------------------------
-- RECEIPTS
--------------------------------------------------

CREATE TABLE receipts (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    transaction_id UUID NOT NULL UNIQUE,

    file_url TEXT NOT NULL,

    uploaded_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_receipt_transaction
        FOREIGN KEY(transaction_id)
        REFERENCES transactions(id)
        ON DELETE CASCADE
);

--------------------------------------------------
-- INDEXES
--------------------------------------------------

CREATE INDEX idx_users_email
ON users(email);

CREATE INDEX idx_transactions_user
ON transactions(user_id);

CREATE INDEX idx_transactions_category
ON transactions(category_id);

CREATE INDEX idx_transactions_date
ON transactions(transaction_date);

CREATE INDEX idx_budget_user
ON budgets(user_id);

CREATE INDEX idx_budget_period
ON budgets(budget_period);