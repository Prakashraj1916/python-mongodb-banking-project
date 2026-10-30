import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");

        const cleanUsername = username.trim().toLowerCase();
        if (!cleanUsername) {
            setError("Please enter your username.");
            return;
        }

        if (!password) {
            setError("Please enter your password.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/login/",
                {
                    username: cleanUsername,
                    password: password
                }
            );

            if (response.data.success) {
                sessionStorage.setItem("banking_logged_in", "true");
                sessionStorage.setItem(
                    "banking_username",
                    response.data.username
                );

                navigate("/home", { replace: true });
            }
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Invalid username or password. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                
                {/* Bank Header */}
                <div className="login-header">
                    <div className="bank-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 2L2 7h20L12 2z" />
                        </svg>
                    </div>
                    <h1>Banking Service</h1>
                    <p className="login-subtitle">Sign in to your account</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} noValidate>
                    
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            autoComplete="username"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-wrapper">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                autoComplete="current-password"
                                required
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="login-error" role="alert">
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="login-btn" 
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Login"}
                    </button>
                </form>

            </div>
        </div>
    );
}

export default Login;
