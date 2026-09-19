import React, { useState } from "react";
import "./LoginPopup.css";

const LoginPopup = ({ setShowLogin }) => {

    const [currentState, setCurrentState] = useState("Login");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);


    // =====================================================
    // FORM SUBMIT
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");


        // =================================================
        // FRONTEND VALIDATION
        // =================================================

        if (currentState === "Sign Up" && !name.trim()) {
            setMessage("Please enter your name.");
            return;
        }

        if (!email.trim()) {
            setMessage("Please enter your email.");
            return;
        }

        if (!email.includes("@")) {
            setMessage("Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            setMessage(
                "Password must contain at least 6 characters."
            );
            return;
        }

        if (currentState === "Sign Up" && !acceptedTerms) {
            setMessage(
                "Please accept the terms and conditions."
            );
            return;
        }


        // =================================================
        // START LOADING
        // =================================================

        setLoading(true);


        try {

            // =================================================
            // SIGN UP
            // =================================================

            if (currentState === "Sign Up") {

                const response = await fetch(
                    "http://localhost:4000/api/user/register",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            name: name,
                            email: email,
                            password: password
                        })
                    }
                );


                const data = await response.json();


                if (data.success) {

                    setMessage(
                        "Account created successfully!"
                    );


                    // Clear form

                    setName("");
                    setEmail("");
                    setPassword("");
                    setAcceptedTerms(false);


                    // Switch to Login after 1 second

                    setTimeout(() => {

                        setCurrentState("Login");
                        setMessage("");

                    }, 1000);

                } else {

                    setMessage(
                        data.message ||
                        "Registration failed."
                    );

                }

            }


            // =================================================
            // LOGIN
            // =================================================

            else {

                const response = await fetch(
                    "http://localhost:4000/api/user/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    }
                );


                const data = await response.json();


                if (data.success) {

                    setMessage("Login successful!");


                    // =================================================
                    // SAVE USER
                    // =================================================

                    localStorage.setItem(
                        "user",
                        JSON.stringify(data.user)
                    );


                    // =================================================
                    // SAVE JWT TOKEN
                    // =================================================

                    localStorage.setItem(
                        "token",
                        data.token
                    );


                    // =================================================
                    // CLOSE POPUP
                    // =================================================

                    setTimeout(() => {

                        setShowLogin(false);

                    }, 1000);

                } else {

                    setMessage(
                        data.message ||
                        "Login failed."
                    );

                }

            }

        } catch (error) {

            console.log(
                "Frontend Error:",
                error
            );

            setMessage(
                "Unable to connect to the server."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div
            className="login-popup"
            onClick={() => setShowLogin(false)}
        >

            <div
                className="login-popup-container"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >

                {/* =========================================
                    HEADER
                ========================================= */}

                <div className="login-popup-title">

                    <h2>
                        {currentState}
                    </h2>

                    <button
                        type="button"
                        className="login-popup-close"
                        onClick={() =>
                            setShowLogin(false)
                        }
                        aria-label="Close"
                    >
                        ✕
                    </button>

                </div>


                {/* =========================================
                    FORM
                ========================================= */}

                <form
                    className="login-popup-form"
                    onSubmit={handleSubmit}
                >

                    {/* NAME - SIGN UP ONLY */}

                    {currentState === "Sign Up" && (

                        <input
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                        />

                    )}


                    {/* EMAIL */}

                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                    />


                    {/* PASSWORD */}

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                    />


                    {/* TERMS - SIGN UP ONLY */}

                    {currentState === "Sign Up" && (

                        <label className="terms-row">

                            <input
                                type="checkbox"
                                checked={acceptedTerms}
                                onChange={(event) =>
                                    setAcceptedTerms(
                                        event.target.checked
                                    )
                                }
                            />

                            <span>
                                I agree to the terms
                                and conditions.
                            </span>

                        </label>

                    )}


                    {/* MESSAGE */}

                    {message && (

                        <p className="login-message">
                            {message}
                        </p>

                    )}


                    {/* SUBMIT BUTTON */}

                    <button
                        type="submit"
                        className="login-submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Please wait..."
                            : currentState === "Login"
                                ? "Login"
                                : "Create account"}

                    </button>

                </form>


                {/* =========================================
                    SWITCH LOGIN / SIGN UP
                ========================================= */}

                <div className="login-popup-switch">

                    {currentState === "Login" ? (

                        <p>
                            Don't have an account?

                            <button
                                type="button"
                                onClick={() => {

                                    setCurrentState("Sign Up");
                                    setMessage("");

                                }}
                            >
                                Sign Up
                            </button>

                        </p>

                    ) : (

                        <p>
                            Already have an account?

                            <button
                                type="button"
                                onClick={() => {

                                    setCurrentState("Login");
                                    setMessage("");

                                }}
                            >
                                Login
                            </button>

                        </p>

                    )}

                </div>

            </div>

        </div>

    );
};

export default LoginPopup;