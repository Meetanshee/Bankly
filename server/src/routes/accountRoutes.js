import express from "express";

import {
    createAccountController,
    getAllAccountsController,
    getAccountByIdController,
    updateAccountController,
    deleteAccountController,
    depositController,
    withdrawController,
    getBalanceController,
    getTransactionsController
} from "../controllers/accountController.js";

import {
    validateAccountId,
    validateCreateAccount,
    validateUpdateAccount,
    validateAmount,
    validateTransactionType
} from "../middleware/validation.js";

const router = express.Router();

router.post(
    "/",
    validateCreateAccount,
    createAccountController
);

router.get(
    "/",
    getAllAccountsController
);

router.get(
    "/:id",
    validateAccountId,
    getAccountByIdController
);

router.put(
    "/:id",
    validateAccountId,
    validateUpdateAccount,
    updateAccountController
);

router.delete(
    "/:id",
    validateAccountId,
    deleteAccountController
);

router.post(
    "/:id/deposit",
    validateAccountId,
    validateAmount,
    depositController
);

router.post(
    "/:id/withdraw",
    validateAccountId,
    validateAmount,
    withdrawController
);

router.get(
    "/:id/balance",
    validateAccountId,
    getBalanceController
);

router.get(
    "/:id/transactions",
    validateAccountId,
    validateTransactionType,
    getTransactionsController
);

export default router;