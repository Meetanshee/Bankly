import {
    registerUser,
    loginUser
} from "../services/authServices.js";


export const registerController = async (
    req,
    res
) => {
    const {
        name,
        email,
        password
    } = req.body;

    const user = await registerUser(
        name,
        email,
        password
    );

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.created_at
        }
    });
};


export const loginController = async (
    req,
    res
) => {
    const {
        email,
        password
    } = req.body;

    const result = await loginUser(
        email,
        password
    );

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: result
    });
};