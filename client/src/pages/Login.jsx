import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page modern-auth">

            {/* LEFT BRAND PANEL */}

            <div className="auth-brand-panel">

                <div className="auth-brand">

                    <div className="auth-brand-icon">
                        B
                    </div>

                    <span>Bankly</span>

                </div>

                <div className="auth-brand-content">

                    <span className="auth-eyebrow">
                        SECURE DIGITAL BANKING
                    </span>

                    <h1>
                        Your Money.
                        <br />
                        Your <span>Control.</span>
                    </h1>

                    <p>
                        Manage your accounts, track transactions
                        and stay in control of your finances with
                        Bankly.
                    </p>

                    <div className="auth-features">

                        <div className="auth-feature">

                            <div className="feature-icon">
                                ✦
                            </div>

                            <div>
                                <strong>
                                    Secure & Reliable
                                </strong>

                                <span>
                                    Your banking data stays protected.
                                </span>
                            </div>

                        </div>


                        <div className="auth-feature">

                            <div className="feature-icon">
                                ◈
                            </div>

                            <div>
                                <strong>
                                    Multiple Accounts
                                </strong>

                                <span>
                                    Manage Savings and Current accounts.
                                </span>
                            </div>

                        </div>


                        <div className="auth-feature">

                            <div className="feature-icon">
                                ↗
                            </div>

                            <div>
                                <strong>
                                    Real-time Tracking
                                </strong>

                                <span>
                                    Keep track of every transaction.
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

                <div className="auth-brand-footer">
                    © 2026 Bankly. Smart banking, simplified.
                </div>

            </div>


            {/* LOGIN PANEL */}

            <div className="auth-form-panel">

                <div className="auth-form-container">

                    <div className="mobile-auth-brand">
                        <div className="auth-brand-icon">
                            B
                        </div>

                        <span>Bankly</span>
                    </div>


                    <div className="auth-heading">

                        <span className="auth-form-label">
                            WELCOME BACK
                        </span>

                        <h2>
                            Sign in to your account
                        </h2>

                        <p>
                            Enter your credentials to continue
                            to your banking dashboard.
                        </p>

                    </div>


                    {error && (
                        <div className="modern-error">
                            <span>!</span>
                            {error}
                        </div>
                    )}


                    <form onSubmit={handleSubmit}>

                        <div className="modern-form-group">

                            <label>
                                Email address
                            </label>

                            <div className="modern-input-wrapper">

                                <span className="input-icon">
                                    @
                                </span>

                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    required
                                />

                            </div>

                        </div>


                        <div className="modern-form-group">

                            <label>
                                Password
                            </label>

                            <div className="modern-input-wrapper">

                                <span className="input-icon">
                                    •
                                </span>

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            (previous) => !previous
                                        )
                                    }
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>

                            </div>

                        </div>


                        <button
                            type="submit"
                            className="modern-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign In"}

                            {!loading && (
                                <span>→</span>
                            )}
                        </button>

                    </form>


                    <p className="modern-auth-footer">

                        Don't have an account?

                        <Link to="/register">
                            Create account
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
}

export default Login;