import { useState } from "react";
import "./Login.css";

const API_URL = "https://tomato-backend-dgur.onrender.com";

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
                `${API_URL}/api/admin/login`,
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

                // Keep adminData for compatibility
                localStorage.setItem(
                    "adminData",
                    JSON.stringify(data.admin || {})
                );

                // Tell App.jsx login was successful
                setIsLoggedIn(true);

                return;
            }

            // =========================================
            // LOGIN FAILED
            // =========================================

            setError(
                data.message ||
                "Invalid email or password"
            );

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            setError(
                "Cannot connect to backend. Please try again."
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

                    <h1>
                        Tomato
                    </h1>

                    <p>
                        Food Delivery Admin
                    </p>

                </div>


                {/* TITLE */}
                <h2>
                    Admin Login
                </h2>


                {/* FORM */}
                <form onSubmit={handleLogin}>

                    {/* EMAIL */}
                    <div className="login-input">

                        <label>
                            Email
                        </label>

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

                        <label>
                            Password
                        </label>

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
                        {loading
                            ? "LOGIN..."
                            : "LOGIN"}
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