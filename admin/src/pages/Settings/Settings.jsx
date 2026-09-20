import React, { useState } from "react";
import "./Settings.css";

const Settings = () => {
    const [adminData] = useState(() => {
        try {
            return JSON.parse(
                localStorage.getItem("adminData") ||
                localStorage.getItem("admin") ||
                "{}"
            );
        } catch {
            return {};
        }
    });

    const [notifications, setNotifications] =
        useState(true);

    const [darkMode, setDarkMode] =
        useState(false);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        localStorage.removeItem("adminData");

        window.location.reload();
    };

    return (
        <div className="settings-page">

            <div className="settings-page-header">

                <h1>Settings</h1>

                <p>
                    Manage your admin account
                    settings
                </p>

            </div>

            <div className="settings-container">

                {/* ADMIN PROFILE */}

                <div className="settings-card">

                    <div className="settings-card-header">

                        <div>
                            <h2>
                                Admin Profile
                            </h2>

                            <p>
                                Your administrator
                                account information
                            </p>
                        </div>

                    </div>

                    <div className="profile-info">

                        <div className="profile-avatar">
                            T
                        </div>

                        <div>

                            <h3>
                                {adminData.name ||
                                    "Tomato Admin"}
                            </h3>

                            <p>
                                {adminData.email ||
                                    "Administrator"}
                            </p>

                        </div>

                    </div>

                </div>


                {/* NOTIFICATIONS */}

                <div className="settings-card">

                    <div className="settings-option">

                        <div>

                            <h3>
                                Notifications
                            </h3>

                            <p>
                                Receive notifications
                                about new orders
                            </p>

                        </div>

                        <label className="settings-switch">

                            <input
                                type="checkbox"
                                checked={
                                    notifications
                                }
                                onChange={(event) =>
                                    setNotifications(
                                        event.target
                                            .checked
                                    )
                                }
                            />

                            <span></span>

                        </label>

                    </div>

                </div>


                {/* APPEARANCE */}

                <div className="settings-card">

                    <div className="settings-option">

                        <div>

                            <h3>
                                Dark Mode
                            </h3>

                            <p>
                                Change the admin
                                panel appearance
                            </p>

                        </div>

                        <label className="settings-switch">

                            <input
                                type="checkbox"
                                checked={
                                    darkMode
                                }
                                onChange={(event) =>
                                    setDarkMode(
                                        event.target
                                            .checked
                                    )
                                }
                            />

                            <span></span>

                        </label>

                    </div>

                    {darkMode && (
                        <p className="settings-note">
                            Dark mode preference
                            is selected. Your
                            current Admin theme
                            CSS remains unchanged.
                        </p>
                    )}

                </div>


                {/* SYSTEM */}

                <div className="settings-card">

                    <div className="settings-card-header">

                        <h2>
                            System
                        </h2>

                    </div>

                    <div className="system-info">

                        <div>
                            <span>
                                Application
                            </span>

                            <strong>
                                Tomato Admin
                            </strong>
                        </div>

                        <div>
                            <span>
                                Backend
                            </span>

                            <strong>
                                Connected
                            </strong>
                        </div>

                    </div>

                </div>


                {/* LOGOUT */}

                <div className="settings-card logout-card">

                    <div>

                        <h2>
                            Logout
                        </h2>

                        <p>
                            Sign out of the Tomato
                            Admin panel.
                        </p>

                    </div>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </div>

        </div>
    );
};

export default Settings;