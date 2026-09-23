import pool from "../config/db.js";
import generateAccountNumber from "../utils/accountNumberGenerator.js";

export const createAccount = async (
    accountHolderName,
    email,
    accountType
) => {
    let accountNumber;
    let result;

    while (true) {
        accountNumber = generateAccountNumber();

        const query = `
            INSERT INTO accounts
            (
                account_number,
                account_holder_name,
                email,
                account_type
            )
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (account_number)
            DO NOTHING
            RETURNING *;
        `;

        result = await pool.query(query, [
            accountNumber,
            accountHolderName,
            email,
            accountType
        ]);

        if (result.rows.length > 0) {
            break;
        }
    }

    return result.rows[0];
};

export const getAllAccounts = async () => {
    const query = `
        SELECT *
        FROM accounts
        ORDER BY id;
    `;

    const result = await pool.query(query);

    return result.rows;
};

export const getAccountById = async (id) => {
    const query = `
        SELECT *
        FROM accounts
        WHERE id = $1;
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0];
};

export const updateAccount = async (
    id,
    accountHolderName,
    email,
    accountType
) => {
    const query = `
        UPDATE accounts
        SET
            account_holder_name = $1,
            email = $2,
            account_type = $3
        WHERE id = $4
        RETURNING *;
    `;

    const result = await pool.query(query, [
        accountHolderName,
        email,
        accountType,
        id
    ]);

    return result.rows[0];
};

export const deleteAccount = async (id) => {
    const query = `
        DELETE FROM accounts
        WHERE id = $1
        RETURNING *;
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0];
};

export const depositMoney = async (id, amount) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const accountQuery = `
            SELECT *
            FROM accounts
            WHERE id = $1
            FOR UPDATE;
        `;

        const accountResult = await client.query(
            accountQuery,
            [id]
        );

        if (accountResult.rows.length === 0) {
            const error = new Error("Account not found");
            error.statusCode = 404;
            throw error;
        }

        if (!Number.isFinite(amount) || amount <= 0) {
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
            RETURNING *;
        `;

        const updatedAccountResult = await client.query(
            updateQuery,
            [amount, id]
        );

       const updatedAccount = updatedAccountResult.rows[0];

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

        await client.query(transactionQuery, [
            id,
            "DEPOSIT",
            amount,
            updatedAccount.balance
        ]);
        await client.query("COMMIT");

        return updatedAccountResult.rows[0];

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;

    } finally {
        client.release();
    }
};

export const withdrawMoney = async (id, amount) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const accountQuery = `
            SELECT *
            FROM accounts
            WHERE id = $1
            FOR UPDATE;
        `;

        const accountResult = await client.query(
            accountQuery,
            [id]
        );

        if (accountResult.rows.length === 0) {
            const error = new Error("Account not found");
            error.statusCode = 404;
            throw error;
        }

        const account = accountResult.rows[0];

        if (!Number.isFinite(amount) || amount <= 0) {
            const error = new Error(
                "Withdrawal amount must be greater than 0"
            );

            error.statusCode = 400;
            throw error;
        }

        if (Number(account.balance) < amount) {
            const error = new Error(
                "Insufficient balance"
            );

            error.statusCode = 400;
            throw error;
        }

        const updateQuery = `
            UPDATE accounts
            SET balance = balance - $1
            WHERE id = $2
            RETURNING *;
        `;

        const updatedAccountResult = await client.query(
            updateQuery,
            [amount, id]
        );

        const updatedAccount = updatedAccountResult.rows[0];

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

        await client.query(transactionQuery, [
            id,
            "WITHDRAW",
            amount,
            updatedAccount.balance
        ]);

        await client.query("COMMIT");

        return updatedAccountResult.rows[0];

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;

    } finally {
        client.release();
    }
};



export const getAccountBalance = async (id) => {
    const query = `
        SELECT
            id,
            account_number,
            balance
        FROM accounts
        WHERE id = $1;
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0];
};

export const getTransactionHistory = async (id) => {
    const query = `
        SELECT
            id,
            account_id,
            transaction_type,
            amount,
            available_balance,
            transaction_date
        FROM transactions
        WHERE account_id = $1
        ORDER BY transaction_date DESC, id DESC;
    `;

    const result = await pool.query(query, [id]);

    return result.rows;
};
