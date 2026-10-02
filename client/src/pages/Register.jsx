import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Register() {
    const navigate = useNavigate();

    const { register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await register(
                name,
                email,
                password
            );

            setSuccess(
                "Account created successfully. Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1200);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page modern-auth">

            {/* LEFT BRAND PANEL */}

            <div className="auth-brand-panel register-brand-panel">

                <div className="auth-brand">

                    <div className="auth-brand-icon">
                        B
                    </div>

                    <span>Bankly</span>

                </div>

                <div className="auth-brand-content">

                    <span className="auth-eyebrow">
                        YOUR DIGITAL BANKING JOURNEY
                    </span>

                    <h1>
                        Start Your
                        <br />
                        Banking <span>Journey.</span>
                    </h1>

                    <p>
                        Create your Bankly account and experience
                        simple, secure and modern banking.
                    </p>


                    <div className="auth-features">

                        <div className="auth-feature">

                            <div className="feature-icon">
                                ⚡
                            </div>

                            <div>
                                <strong>
                                    Quick Registration
                                </strong>

                                <span>
                                    Get started in just a few steps.
                                </span>
                            </div>

                        </div>


                        <div className="auth-feature">

                            <div className="feature-icon">
                                ◈
                            </div>

                            <div>
                                <strong>
                                    Multiple Bank Accounts
                                </strong>

                                <span>
                                    Create and manage multiple accounts.
                                </span>
                            </div>

                        </div>


                        <div className="auth-feature">

                            <div className="feature-icon">
                                ≡
                            </div>

                            <div>
                                <strong>
                                    Full Transaction History
                                </strong>

                                <span>
                                    Keep track of every movement.
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

                <div className="auth-brand-footer">
                    © 2026 Bankly. Smart banking, simplified.
                </div>

            </div>


            {/* REGISTER FORM */}

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
                            GET STARTED
                        </span>

                        <h2>
                            Create your account
                        </h2>

                        <p>
                            Join Bankly and take control of your
                            financial journey.
                        </p>

                    </div>


                    {error && (
                        <div className="modern-error">
                            <span>!</span>
                            {error}
                        </div>
                    )}


                    {success && (
                        <div className="modern-success">
                            <span>✓</span>
                            {success}
                        </div>
                    )}


                    <form onSubmit={handleSubmit}>

                        <div className="modern-form-group">

                            <label>
                                Full name
                            </label>

                            <div className="modern-input-wrapper">

                                <span className="input-icon">
                                    ◉
                                </span>

                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    required
                                />

                            </div>

                        </div>


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
                                    placeholder="At least 6 characters"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    minLength={6}
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
                                ? "Creating account..."
                                : "Create Account"}

                            {!loading && (
                                <span>→</span>
                            )}
                        </button>

                    </form>


                    <p className="modern-auth-footer">

                        Already have an account?

                        <Link to="/login">
                            Sign in
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
}

export default Register;