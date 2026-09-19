import { useState } from "react";
import "./Login.css";

function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:4000/api/admin/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password: password,
                    }),
                }
            );

            const data = await response.json();

            // =========================================
            // LOGIN SUCCESS
            // =========================================

            if (response.ok && data.success) {
                // Save JWT token
                localStorage.setItem(
                    "adminToken",
                    data.token
                );

                // Save admin information
                localStorage.setItem(
                    "admin",
                    JSON.stringify(data.admin || {})
                );

                // Also keep adminData for compatibility
                localStorage.setItem(
                    "adminData",
                    JSON.stringify(data.admin || {})
                );

                // IMPORTANT:
                // Tell App.jsx that login was successful
                setIsLoggedIn(true);

                return;
            }

            // =========================================
            // LOGIN FAILED
            // =========================================

            setError(
                data.message || "Invalid email or password"
            );
        } catch (error) {
            console.error("Login error:", error);

            setError(
                "Cannot connect to backend. Make sure backend is running."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-box">

                {/* LOGO */}
                <div className="login-logo">
                    <h1>Tomato</h1>
                    <p>Food Delivery Admin</p>
                </div>

                {/* TITLE */}
                <h2>Admin Login</h2>

                {/* FORM */}
                <form onSubmit={handleLogin}>

                    {/* EMAIL */}
                    <div className="login-input">
                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="login-input">
                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />
                    </div>

                    {/* ERROR */}
                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}

                    {/* LOGIN BUTTON */}
                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? "LOGIN..." : "LOGIN"}
                    </button>

                </form>

                {/* FOOTER */}
                <p className="login-footer">
                    Tomato Food Delivery Admin Panel
                </p>

            </div>
        </div>
    );
}

export default Login;