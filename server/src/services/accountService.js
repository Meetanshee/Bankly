import pool from "../config/db.js";
import generateAccountNumber from "../utils/accountNumberGenerator.js";

// Create a new bank account
export const createAccount = async (
    userId,
    accountHolderName,
    accountType
) => {
    let accountNumber;
    let result;

    while (true) {
        accountNumber = generateAccountNumber();

        const query = `
            INSERT INTO accounts
            (
                user_id,
                account_number,
                account_holder_name,
                account_type
            )
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (account_number)
            DO NOTHING
            RETURNING *;
        `;

        result = await pool.query(query, [
            userId,
            accountNumber,
            accountHolderName,
            accountType
        ]);

        if (result.rows.length > 0) {
            break;
        }
    }

    return result.rows[0];
};


// Get all accounts belonging to logged-in user
export const getAllAccounts = async (userId) => {
    const query = `
        SELECT *
        FROM accounts
        WHERE user_id = $1
        ORDER BY id;
    `;

    const result = await pool.query(query, [userId]);

    return result.rows;
};


// Get one account belonging to logged-in user
export const getAccountById = async (
    id,
    userId
) => {
    const query = `
        SELECT *
        FROM accounts
        WHERE id = $1
        AND user_id = $2;
    `;

    const result = await pool.query(query, [
        id,
        userId
    ]);

    return result.rows[0];
};


// Update account information
export const updateAccount = async (
    id,
    accountHolderName,
    userId
) => {
    const query = `
        UPDATE accounts
        SET account_holder_name = $1
        WHERE id = $2
        AND user_id = $3
        RETURNING *;
    `;

    const result = await pool.query(query, [
        accountHolderName,
        id,
        userId
    ]);

    return result.rows[0];
};


// Permanently delete account
export const deleteAccount = async (
    id,
    userId
) => {
    const query = `
        DELETE FROM accounts
        WHERE id = $1
        AND user_id = $2
        RETURNING *;
    `;

    const result = await pool.query(query, [
        id,
        userId
    ]);

    return result.rows[0];
};


// Deposit money
export const depositMoney = async (
    id,
    amount,
    userId
) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const accountQuery = `
            SELECT *
            FROM accounts
            WHERE id = $1
            AND user_id = $2
            FOR UPDATE;
        `;

        const accountResult = await client.query(
            accountQuery,
            [id, userId]
        );

        if (accountResult.rows.length === 0) {
            const error = new Error(
                "Account not found"
            );

            error.statusCode = 404;

            throw error;
        }

        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            const error = new Error(
                "Deposit amount must be greater than 0"
            );

            error.statusCode = 400;

            throw error;
        }

        const updateQuery = `
            UPDATE accounts
            SET balance = balance + $1
            WHERE id = $2
            AND user_id = $3
            RETURNING *;
        `;

        const updatedAccountResult =
            await client.query(
                updateQuery,
                [amount, id, userId]
            );

        const updatedAccount =
            updatedAccountResult.rows[0];

        const transactionQuery = `
            INSERT INTO transactions
            (
                account_id,
                transaction_type,
                amount,
                available_balance
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

        await client.query(
            transactionQuery,
            [
                id,
                "DEPOSIT",
                amount,
                updatedAccount.balance
            ]
        );

        await client.query("COMMIT");

        return updatedAccount;

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();

    }
};


// Withdraw money
export const withdrawMoney = async (
    id,
    amount,
    userId
) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const accountQuery = `
            SELECT *
            FROM accounts
            WHERE id = $1
            AND user_id = $2
            FOR UPDATE;
        `;

        const accountResult = await client.query(
            accountQuery,
            [id, userId]
        );

        if (accountResult.rows.length === 0) {
            const error = new Error(
                "Account not found"
            );

            error.statusCode = 404;

            throw error;
        }

        const account = accountResult.rows[0];

        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            const error = new Error(
                "Withdrawal amount must be greater than 0"
            );

            error.statusCode = 400;

            throw error;
        }

        if (
            Number(account.balance) < amount
        ) {
            const error = new Error(
                `Insufficient balance. Requested: ${amount.toFixed(
                    2
                )}, Available: ${Number(
                    account.balance
                ).toFixed(2)}`
            );

            error.statusCode = 422;

            throw error;
        }

        const updateQuery = `
            UPDATE accounts
            SET balance = balance - $1
            WHERE id = $2
            AND user_id = $3
            RETURNING *;
        `;

        const updatedAccountResult =
            await client.query(
                updateQuery,
                [amount, id, userId]
            );

        const updatedAccount =
            updatedAccountResult.rows[0];

        const transactionQuery = `
            INSERT INTO transactions
            (
                account_id,
                transaction_type,
                amount,
                available_balance
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

        await client.query(
            transactionQuery,
            [
                id,
                "WITHDRAW",
                amount,
                updatedAccount.balance
            ]
        );

        await client.query("COMMIT");

        return updatedAccount;

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();

    }
};


// Get account balance
export const getAccountBalance = async (
    id,
    userId
) => {
    const query = `
        SELECT
            id,
            account_number,
            balance
        FROM accounts
        WHERE id = $1
        AND user_id = $2;
    `;

    const result = await pool.query(
        query,
        [id, userId]
    );

    return result.rows[0];
};


// Get transaction history
export const getTransactionHistory = async (
    id,
    userId,
    transactionType
) => {
    let query = `
        SELECT
            t.id,
            t.account_id,
            t.transaction_type,
            t.amount,
            t.available_balance,
            t.transaction_date
        FROM transactions t
        INNER JOIN accounts a
            ON t.account_id = a.id
        WHERE t.account_id = $1
        AND a.user_id = $2
    `;

    const values = [
        id,
        userId
    ];

    if (transactionType) {
        query += `
            AND t.transaction_type = $3
        `;

        values.push(transactionType);
    }

    query += `
        ORDER BY
            t.transaction_date DESC,
            t.id DESC;
    `;

    const result = await pool.query(
        query,
        values
    );

    return result.rows;
};