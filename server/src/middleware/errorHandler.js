export const errorHandler = (error, req, res, next) => {
    console.error("Error:", error);

    // PostgreSQL unique constraint violation
    if (error.code === "23505") {
        if (error.constraint === "accounts_email_key") {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        return res.status(409).json({
            success: false,
            message: "Duplicate value already exists"
        });
    }

    // PostgreSQL foreign key violation
    if (error.code === "23503") {
        return res.status(409).json({
            success: false,
            message: "Related record does not exist"
        });
    }

    // PostgreSQL check constraint violation
    if (error.code === "23514") {
        return res.status(400).json({
            success: false,
            message: "Database validation failed"
        });
    }

    // Custom application errors
    if (error.statusCode) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }

    // Unknown errors
    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
};