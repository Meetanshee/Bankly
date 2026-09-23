CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    account_number VARCHAR(10) UNIQUE NOT NULL,
    account_holder_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    account_type VARCHAR(20) NOT NULL,
    balance NUMERIC(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL,
    transaction_type VARCHAR(20) NOT NULL,
    amount NUMERIC(15,2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (account_id)
        REFERENCES accounts(id)
        ON DELETE CASCADE
);