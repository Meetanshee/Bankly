import bcrypt from "bcryptjs";

import pool from "../config/db.js";
import { generateToken } from "../utils/jwt.js";

export const registerUser = async (
    name,
    email,
    password
) => {
    const existingUserQuery = `
        SELECT id
        FROM users
        WHERE email = $1;
    `;

    const existingUserResult = await pool.query(
        existingUserQuery,
        [email]
    );

    if (existingUserResult.rows.length > 0) {
        const error = new Error(
            "User with this email already exists"
        );

        error.statusCode = 409;

        throw error;
    }

    const hashedPassword = await bcrypt.hash(
        password,
        10
    );

    const query = `
        INSERT INTO users
        (
            name,
            email,
            password
        )
        VALUES ($1, $2, $3)
        RETURNING
            id,
            name,
            email,
            created_at;
    `;

    const result = await pool.query(query, [
        name,
        email,
        hashedPassword
    ]);

    return result.rows[0];
};


export const loginUser = async (
    email,
    password
) => {
    const query = `
        SELECT *
        FROM users
        WHERE email = $1;
    `;

    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
        const error = new Error(
            "Invalid email or password"
        );

        error.statusCode = 401;

        throw error;
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        const error = new Error(
            "Invalid email or password"
        );

        error.statusCode = 401;

        throw error;
    }

    const token = generateToken(user);

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.created_at
        },
        token
    };
};