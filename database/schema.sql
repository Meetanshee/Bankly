CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    account_number VARCHAR(10) UNIQUE NOT NULL,

    account_holder_name VARCHAR(100) NOT NULL,

    account_type VARCHAR(20) NOT NULL
        CHECK (account_type IN ('SAVINGS', 'CURRENT')),

    balance NUMERIC(15,2) NOT NULL DEFAULT 0
        CHECK (balance >= 0),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT accounts_account_number_format
        CHECK (account_number ~ '^[0-9]{10}$'),

    CONSTRAINT fk_accounts_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);



CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,

    account_id INTEGER NOT NULL,

    transaction_type VARCHAR(20) NOT NULL
        CHECK (transaction_type IN ('DEPOSIT', 'WITHDRAW')),

    amount NUMERIC(15,2) NOT NULL
        CHECK (amount > 0),

    available_balance NUMERIC(15,2) NOT NULL
        CHECK (available_balance >= 0),

    transaction_date TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_transactions_account
        FOREIGN KEY (account_id)
        REFERENCES accounts(id)
        ON DELETE CASCADE
);