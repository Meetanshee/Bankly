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

import {
    authenticate
} from "../middleware/authMiddleware.js";

const router = express.Router();


router.post(
    "/",
    authenticate,
    validateCreateAccount,
    createAccountController
);


router.get(
    "/",
    authenticate,
    getAllAccountsController
);


router.get(
    "/:id",
    authenticate,
    validateAccountId,
    getAccountByIdController
);


router.put(
    "/:id",
    authenticate,
    validateAccountId,
    validateUpdateAccount,
    updateAccountController
);


router.delete(
    "/:id",
    authenticate,
    validateAccountId,
    deleteAccountController
);


router.post(
    "/:id/deposit",
    authenticate,
    validateAccountId,
    validateAmount,
    depositController
);


router.post(
    "/:id/withdraw",
    authenticate,
    validateAccountId,
    validateAmount,
    withdrawController
);


router.get(
    "/:id/balance",
    authenticate,
    validateAccountId,
    getBalanceController
);


router.get(
    "/:id/transactions",
    authenticate,
    validateAccountId,
    validateTransactionType,
    getTransactionsController
);


export default router;