import {
    createAccount,
    getAllAccounts,
    getAccountById,
    updateAccount,
    deleteAccount,
    depositMoney,
    withdrawMoney,
    getAccountBalance,
    getTransactionHistory
} from "../services/accountService.js";

export const createAccountController = async (req, res) => {
    try {
        const {
            account_holder_name,
            email,
            account_type
        } = req.body;

        const account = await createAccount(
            account_holder_name,
            email,
            account_type
        );

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            data: account
        });

    } catch (error) {
        console.error("Create account error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to create account"
        });
    }
};

export const getAllAccountsController = async (req, res) => {
    try {
        const accounts = await getAllAccounts();

        res.status(200).json({
            success: true,
            data: accounts
        });

    } catch (error) {
        console.error("Get accounts error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch accounts"
        });
    }
};

export const getAccountByIdController = async (req, res) => {
    try {
        const { id } = req.params;

        const account = await getAccountById(id);

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        res.status(200).json({
            success: true,
            data: account
        });

    } catch (error) {
        console.error("Get account error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch account"
        });
    }
};

export const updateAccountController = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            account_holder_name,
            email,
            account_type
        } = req.body;

        const account = await updateAccount(
            id,
            account_holder_name,
            email,
            account_type
        );

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Account updated successfully",
            data: account
        });

    } catch (error) {
        console.error("Update account error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to update account"
        });
    }
};

export const deleteAccountController = async (req, res) => {
    try {
        const { id } = req.params;

        const account = await deleteAccount(id);

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Account deleted successfully",
            data: account
        });

    } catch (error) {
        console.error("Delete account error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to delete account"
        });
    }
};

export const depositController = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;

        const account = await depositMoney(
            id,
            Number(amount)
        );

        res.status(200).json({
            success: true,
            message: "Amount deposited successfully",
            data: account
        });

    } catch (error) {
        console.error("Deposit error:", error.message);

        const statusCode = error.statusCode || 500;

        res.status(statusCode).json({
            success: false,
            message: error.message || "Failed to deposit amount"
        });
    }
};

export const withdrawController = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;

        const account = await withdrawMoney(
            id,
            Number(amount)
        );

        res.status(200).json({
            success: true,
            message: "Amount withdrawn successfully",
            data: account
        });

    } catch (error) {
        console.error("Withdrawal error:", error.message);

        const statusCode = error.statusCode || 500;

        res.status(statusCode).json({
            success: false,
            message: error.message || "Failed to withdraw amount"
        });
    }
};




export const getBalanceController = async (req, res) => {
    try {
        const { id } = req.params;

        const account = await getAccountBalance(id);

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        res.status(200).json({
            success: true,
            data: account
        });

    } catch (error) {
        console.error("Get balance error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch balance"
        });
    }
};

export const getTransactionsController = async (req, res) => {
    try {
        const { id } = req.params;

        const account = await getAccountById(id);

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        const transactions = await getTransactionHistory(id);

        res.status(200).json({
            success: true,
            data: transactions
        });

    } catch (error) {
        console.error(
            "Get transactions error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch transactions"
        });
    }
};