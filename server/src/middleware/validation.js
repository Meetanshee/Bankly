const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidId = (id) => {
    return /^\d+$/.test(id) && Number(id) > 0;
};

export const validateAccountId = (req, res, next) => {
    const { id } = req.params;

    if (!isValidId(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid account ID"
        });
    }

    next();
};

export const validateCreateAccount = (req, res, next) => {
    const {
        account_holder_name,
        account_type
    } = req.body;

    if (
        !account_holder_name ||
        !account_holder_name.trim()
    ) {
        return res.status(400).json({
            success: false,
            message: "Account holder name is required"
        });
    }

    const validAccountTypes = [
        "SAVINGS",
        "CURRENT"
    ];

    if (!account_type) {
        return res.status(400).json({
            success: false,
            message: "Account type is required"
        });
    }

    if (
        !validAccountTypes.includes(
            account_type.toUpperCase()
        )
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Account type must be SAVINGS or CURRENT"
        });
    }

    next();
};

export const validateUpdateAccount = (req, res, next) => {
    const { account_holder_name } = req.body;

    if (!account_holder_name || !account_holder_name.trim()) {
        return res.status(400).json({
            success: false,
            message: "Account holder name is required"
        });
    }

    next();
};

export const validateAmount = (req, res, next) => {
    const { amount } = req.body;

    const numericAmount = Number(amount);

    if (
        amount === undefined ||
        amount === null ||
        amount === "" ||
        !Number.isFinite(numericAmount) ||
        numericAmount <= 0
    ) {
        return res.status(400).json({
            success: false,
            message: "Amount must be a number greater than 0"
        });
    }

    next();
};

export const validateTransactionType = (req, res, next) => {
    const { type } = req.query;

    if (!type) {
        return next();
    }

    const validTypes = [
        "DEPOSIT",
        "WITHDRAW"
    ];

    if (!validTypes.includes(type.toUpperCase())) {
        return res.status(400).json({
            success: false,
            message: "Transaction type must be DEPOSIT or WITHDRAW"
        });
    }

    next();
};


export const validateRegister = (
    req,
    res,
    next
) => {
    const {
        name,
        email,
        password
    } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({
            success: false,
            message: "Name is required"
        });
    }

    if (!email || !isValidEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Valid email is required"
        });
    }

    if (!password || password.length < 6) {
        return res.status(400).json({
            success: false,
            message:
                "Password must be at least 6 characters long"
        });
    }

    next();
};


export const validateLogin = (
    req,
    res,
    next
) => {
    const {
        email,
        password
    } = req.body;

    if (!email || !isValidEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Valid email is required"
        });
    }

    if (!password) {
        return res.status(400).json({
            success: false,
            message: "Password is required"
        });
    }

    next();
};