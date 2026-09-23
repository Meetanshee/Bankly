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
        email,
        account_type
    } = req.body;

    if (!account_holder_name || !account_holder_name.trim()) {
        return res.status(400).json({
            success: false,
            message: "Account holder name is required"
        });
    }

    if (!email || !isValidEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email"
        });
    }

    if (!account_type || !account_type.trim()) {
        return res.status(400).json({
            success: false,
            message: "Account type is required"
        });
    }

    next();
};

export const validateUpdateAccount = (req, res, next) => {
    const {
        account_holder_name,
        email,
        account_type
    } = req.body;

    if (!account_holder_name || !account_holder_name.trim()) {
        return res.status(400).json({
            success: false,
            message: "Account holder name is required"
        });
    }

    if (!email || !isValidEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email"
        });
    }

    if (!account_type || !account_type.trim()) {
        return res.status(400).json({
            success: false,
            message: "Account type is required"
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