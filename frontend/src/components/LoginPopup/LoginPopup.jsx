import React, { useState } from "react";

import "./LoginPopup.css";

const LoginPopup = ({ setShowLogin }) => {

    const [currentState, setCurrentState] =
        useState("Login");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [acceptedTerms, setAcceptedTerms] =
        useState(false);

    const [message, setMessage] =
        useState("");


    const handleSubmit = (event) => {

        event.preventDefault();

        setMessage("");


        if (currentState === "Sign Up" && !name.trim()) {

            setMessage("Please enter your name.");

            return;
        }


        if (!email.trim()) {

            setMessage("Please enter your email.");

            return;
        }


        if (!email.includes("@")) {

            setMessage(
                "Please enter a valid email address."
            );

            return;
        }


        if (password.length < 6) {

            setMessage(
                "Password must contain at least 6 characters."
            );

            return;
        }


        if (
            currentState === "Sign Up" &&
            !acceptedTerms
        ) {

            setMessage(
                "Please accept the terms and conditions."
            );

            return;
        }


        setMessage(
            currentState === "Login"
                ? "Login successful!"
                : "Account created successfully!"
        );


        setTimeout(() => {

            setShowLogin(false);

        }, 1000);

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

                {/* HEADER */}

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


                {/* FORM */}

                <form
                    className="login-popup-form"
                    onSubmit={handleSubmit}
                >

                    {currentState === "Sign Up" && (

                        <input
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                        />

                    )}


                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(event) =>
                            setEmail(
                                event.target.value
                            )
                        }
                    />


                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) =>
                            setPassword(
                                event.target.value
                            )
                        }
                    />


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


                    {message && (

                        <p className="login-message">
                            {message}
                        </p>

                    )}


                    <button
                        type="submit"
                        className="login-submit"
                    >

                        {currentState === "Login"
                            ? "Login"
                            : "Create account"}

                    </button>

                </form>


                {/* SWITCH LOGIN / SIGN UP */}

                <div className="login-popup-switch">

                    {currentState === "Login" ? (

                        <p>
                            Don't have an account?

                            <button
                                type="button"
                                onClick={() => {

                                    setCurrentState(
                                        "Sign Up"
                                    );

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

                                    setCurrentState(
                                        "Login"
                                    );

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