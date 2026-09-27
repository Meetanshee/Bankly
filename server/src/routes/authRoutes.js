import express from "express";

import {
    registerController,
    loginController
} from "../controllers/authController.js";

import {
    validateRegister,
    validateLogin
} from "../middleware/validation.js";

const router = express.Router();

router.post(
    "/register",
    validateRegister,
    registerController
);

router.post(
    "/login",
    validateLogin,
    loginController
);

export default router;