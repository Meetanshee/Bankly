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
};

export const getAllAccountsController = async (req, res) => {
    const accounts = await getAllAccounts();

    res.status(200).json({
        success: true,
        data: accounts
    });
};

export const getAccountByIdController = async (req, res) => {
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
};

export const updateAccountController = async (req, res) => {
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
};

export const deleteAccountController = async (req, res) => {
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
};

export const depositController = async (req, res) => {
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
};

export const withdrawController = async (req, res) => {
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
};

export const getBalanceController = async (req, res) => {
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
};

export const getTransactionsController = async (req, res) => {
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
};