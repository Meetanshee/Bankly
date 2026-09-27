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

import {
    mapAccount,
    mapBalance
} from "../utils/accountMapper.js";

import {
    mapTransactions
} from "../utils/transactionMapper.js";


export const createAccountController = async (
    req,
    res
) => {
    const {
        account_holder_name,
        account_type
    } = req.body;

    const userId = req.user.id;

    const account = await createAccount(
        userId,
        account_holder_name,
        account_type.toUpperCase()
    );

    res.status(201).json({
        success: true,
        message: "Account created successfully",
        data: mapAccount(account)
    });
};


export const getAllAccountsController = async (
    req,
    res
) => {
    const userId = req.user.id;

    const accounts = await getAllAccounts(userId);

    res.status(200).json({
        success: true,
        data: accounts.map(mapAccount)
    });
};


export const getAccountByIdController = async (
    req,
    res
) => {
    const { id } = req.params;
    const userId = req.user.id;

    const account = await getAccountById(
        id,
        userId
    );

    if (!account) {
        return res.status(404).json({
            success: false,
            message: "Account not found"
        });
    }

    res.status(200).json({
        success: true,
        data: mapAccount(account)
    });
};


export const updateAccountController = async (req, res) => {
    const { id } = req.params;
    const { account_holder_name } = req.body;
    const userId = req.user.id;

    const account = await updateAccount(
        id,
        account_holder_name,
        userId
    );

    if (!account) {
        return res.status(404).json({
            success: false,
            message: "Account not found"
        });
    }

    res.status(200).json({
        success: true,
        message: "Account holder details updated successfully",
        data: mapAccount(account)
    });
};


export const deleteAccountController = async (
    req,
    res
) => {
    const { id } = req.params;

    const userId = req.user.id;

    const account = await deleteAccount(
        id,
        userId
    );

    if (!account) {
        return res.status(404).json({
            success: false,
            message: "Account not found"
        });
    }

    return res.status(204).send();
};


export const depositController = async (
    req,
    res
) => {
    const { id } = req.params;
    const { amount } = req.body;

    const userId = req.user.id;

    const account = await depositMoney(
        id,
        Number(amount),
        userId
    );

    res.status(200).json({
        success: true,
        message: "Deposit successful",
        data: mapAccount(account)
    });
};


export const withdrawController = async (
    req,
    res
) => {
    const { id } = req.params;
    const { amount } = req.body;

    const userId = req.user.id;

    const account = await withdrawMoney(
        id,
        Number(amount),
        userId
    );

    res.status(200).json({
        success: true,
        message: "Withdrawal successful",
        data: mapAccount(account)
    });
};


export const getBalanceController = async (
    req,
    res
) => {
    const { id } = req.params;

    const userId = req.user.id;

    const balance = await getAccountBalance(
        id,
        userId
    );

    if (!balance) {
        return res.status(404).json({
            success: false,
            message: "Account not found"
        });
    }

    res.status(200).json({
        success: true,
        data: mapBalance(balance)
    });
};


export const getTransactionsController = async (
    req,
    res
) => {
    const { id } = req.params;

    const transactionType =
        req.query.type?.toUpperCase();

    const userId = req.user.id;

    const account = await getAccountById(
        id,
        userId
    );

    if (!account) {
        return res.status(404).json({
            success: false,
            message: "Account not found"
        });
    }

    const transactions =
        await getTransactionHistory(
            id,
            userId,
            transactionType
        );

    res.status(200).json({
        success: true,
        data: mapTransactions(transactions)
    });
};