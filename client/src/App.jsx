import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";

import { useAuth } from "./context/AuthContext";


function App() {

    const {
        isAuthenticated
    } = useAuth();


    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={
                        isAuthenticated
                            ? (
                                <Navigate
                                    to="/dashboard"
                                    replace
                                />
                            )
                            : (
                                <Navigate
                                    to="/login"
                                    replace
                                />
                            )
                    }
                />


                <Route
                    path="/login"
                    element={
                        isAuthenticated
                            ? (
                                <Navigate
                                    to="/dashboard"
                                    replace
                                />
                            )
                            : (
                                <Login />
                            )
                    }
                />


                <Route
                    path="/register"
                    element={
                        isAuthenticated
                            ? (
                                <Navigate
                                    to="/dashboard"
                                    replace
                                />
                            )
                            : (
                                <Register />
                            )
                    }
                />


                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;