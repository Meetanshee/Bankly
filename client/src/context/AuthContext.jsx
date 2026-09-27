import {
    createContext,
    useContext,
    useState
} from "react";

import {
    loginUser,
    registerUser
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(
        JSON.parse(
            localStorage.getItem("user")
        )
    );

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );


    const login = async (
        email,
        password
    ) => {
        const response = await loginUser(
            email,
            password
        );

        const {
            user,
            token
        } = response.data;

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

        localStorage.setItem(
            "token",
            token
        );

        setUser(user);
        setToken(token);

        return response;
    };


    const register = async (
        name,
        email,
        password
    ) => {
        return await registerUser(
            name,
            email,
            password
        );
    };


    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        setUser(null);
        setToken(null);
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                register,
                logout,
                isAuthenticated: !!token
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    return useContext(AuthContext);
};