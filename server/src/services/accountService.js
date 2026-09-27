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

export const getAllAccounts = async (email) => {
    const query = `
        SELECT *
        FROM accounts
        WHERE email = $1
        ORDER BY id;
    `;

    const result = await pool.query(query, [email]);

    return result.rows;
};

export const getAccountById = async (
    id,
    email
) => {
    const query = `
        SELECT *
        FROM accounts
        WHERE id = $1
        AND email = $2;
    `;

    const result = await pool.query(
        query,
        [id, email]
    );

    return result.rows[0];
};

export const updateAccount = async (
    id,
    accountHolderName,
    email,
    accountType,
    currentUserEmail
) => {
    const query = `
        UPDATE accounts
        SET
            account_holder_name = $1,
            email = $2,
            account_type = $3
        WHERE id = $4
        AND email = $5
        RETURNING *;
    `;

    const result = await pool.query(query, [
        accountHolderName,
        email,
        accountType,
        id,
        currentUserEmail
    ]);

    return result.rows[0];
};

export const deleteAccount = async (
    id,
    email
) => {
    const query = `
        DELETE FROM accounts
        WHERE id = $1
        AND email = $2
        RETURNING *;
    `;

    const result = await pool.query(
        query,
        [id, email]
    );

    return result.rows[0];
};

export const depositMoney = async (
    id,
    amount,
    email
) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const accountQuery = `
            SELECT *
            FROM accounts
            WHERE id = $1
            AND email = $2
            FOR UPDATE;
        `;

            const accountResult = await client.query(
            accountQuery,
            [id, email]
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

export const withdrawMoney = async (
    id,
    amount,
    email
) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const accountQuery = `
            SELECT *
            FROM accounts
            WHERE id = $1
            AND email = $2
            FOR UPDATE;
        `;

        const accountResult = await client.query(
            accountQuery,
            [id, email]
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
        `Insufficient balance. Requested: ${amount.toFixed(2)}, Available: ${Number(account.balance).toFixed(2)}`
    );

    error.statusCode = 422;
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



export const getAccountBalance = async (
    id,
    email
) => {
    const query = `
        SELECT
            id,
            account_number,
            balance
        FROM accounts
        WHERE id = $1
        AND email = $2;
    `;

    const result = await pool.query(
        query,
        [id, email]
    );

    return result.rows[0];
};

export const getTransactionHistory = async (
    id,
    email,
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
        AND a.email = $2
    `;

    const values = [id, email];

    if (transactionType) {
        query += `
            AND t.transaction_type = $3
        `;

        values.push(transactionType);
    }

    query += `
        ORDER BY t.transaction_date DESC, t.id DESC;
    `;

    const result = await pool.query(
        query,
        values
    );

    return result.rows;
};
