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

const router = express.Router();

router.post("/", createAccountController);

router.get("/", getAllAccountsController);

router.get("/:id", getAccountByIdController);

router.put("/:id", updateAccountController);

router.delete("/:id", deleteAccountController);

router.post("/:id/deposit", depositController);

router.post("/:id/withdraw", withdrawController);

router.get("/:id/balance", getBalanceController);

router.get("/:id/transactions", getTransactionsController);

export default router;