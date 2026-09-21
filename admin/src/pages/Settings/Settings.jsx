import React, { useEffect, useState } from "react";
import "./Settings.css";

const API_URL = "https://tomato-backend-dgur.onrender.com";

const defaultSettings = {
    restaurantName: "Tomato",
    email: "",
    phone: "",
    deliveryFee: 2,
    minOrder: 0,
    currency: "$",
    notifications: true,
    emailNotifications: true,
    autoConfirm: false
};

function Settings() {
    const [settings, setSettings] = useState(defaultSettings);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // =====================================================
    // LOAD SETTINGS
    // =====================================================

    const fetchSettings = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/settings`
            );

            const data = await response.json();

            if (data.success && data.settings) {
                const loadedSettings = {
                    ...defaultSettings,
                    ...data.settings
                };

                setSettings(loadedSettings);

                localStorage.setItem(
                    "tomato-settings",
                    JSON.stringify(loadedSettings)
                );
            } else {
                setError("Failed to load settings");
            }
        } catch (err) {
            console.error("Settings loading error:", err);

            // Try localStorage if backend is temporarily unavailable
            try {
                const savedSettings =
                    localStorage.getItem("tomato-settings");

                if (savedSettings) {
                    setSettings({
                        ...defaultSettings,
                        ...JSON.parse(savedSettings)
                    });
                } else {
                    setError("Cannot connect to backend");
                }
            } catch {
                setError("Cannot connect to backend");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setSettings((previous) => ({
            ...previous,
            [name]: value
        }));

        setMessage("");
        setError("");
    };

    // =====================================================
    // TOGGLE
    // =====================================================

    const handleToggle = (name) => {
        setSettings((previous) => ({
            ...previous,
            [name]: !previous[name]
        }));

        setMessage("");
        setError("");
    };

    // =====================================================
    // SAVE SETTINGS
    // =====================================================

    const handleSave = async () => {
        try {
            setSaving(true);
            setMessage("");
            setError("");

            const token =
                localStorage.getItem("adminToken");

            if (!token) {
                setError(
                    "Admin login required. Please login again."
                );
                return;
            }

            const deliveryFee =
                Number(settings.deliveryFee);

            const minOrder =
                Number(settings.minOrder);

            // Validation
            if (!settings.restaurantName.trim()) {
                setError(
                    "Restaurant name cannot be empty."
                );
                return;
            }

            if (!settings.email.trim()) {
                setError(
                    "Email cannot be empty."
                );
                return;
            }

            if (Number.isNaN(deliveryFee) || deliveryFee < 0) {
                setError(
                    "Delivery fee must be 0 or greater."
                );
                return;
            }

            if (Number.isNaN(minOrder) || minOrder < 0) {
                setError(
                    "Minimum order must be 0 or greater."
                );
                return;
            }

            const response = await fetch(
                `${API_URL}/api/settings/update`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        restaurantName:
                            settings.restaurantName.trim(),

                        email:
                            settings.email.trim(),

                        phone:
                            settings.phone.trim(),

                        deliveryFee,

                        minOrder,

                        currency:
                            settings.currency,

                        notifications:
                            Boolean(settings.notifications),

                        emailNotifications:
                            Boolean(
                                settings.emailNotifications
                            ),

                        autoConfirm:
                            Boolean(settings.autoConfirm)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                setError(
                    data.message ||
                    "Failed to save settings."
                );
                return;
            }

            const updatedSettings = {
                ...defaultSettings,
                ...data.settings
            };

            setSettings(updatedSettings);

            // Save locally too
            localStorage.setItem(
                "tomato-settings",
                JSON.stringify(updatedSettings)
            );

            setMessage(
                "Settings saved successfully!"
            );

            // Remove success message after 4 seconds
            setTimeout(() => {
                setMessage("");
            }, 4000);
        } catch (err) {
            console.error(
                "Settings save error:",
                err
            );

            setError(
                "Cannot connect to backend."
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = async () => {
        setMessage("");
        setError("");

        await fetchSettings();
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="settings-page">
                <div className="settings-loading">
                    <div className="settings-spinner"></div>
                    <p>Loading settings...</p>
                </div>
            </div>
        );
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div className="settings-page">

            {/* PAGE HEADER */}

            <div className="settings-header">
                <div>
                    <h1>Settings</h1>

                    <p>
                        Manage your Tomato restaurant settings
                    </p>
                </div>
            </div>


            {/* SUCCESS MESSAGE */}

            {message && (
                <div className="settings-message success">
                    <span>✓</span>
                    <p>{message}</p>
                </div>
            )}


            {/* ERROR MESSAGE */}

            {error && (
                <div className="settings-message error">
                    <span>!</span>
                    <p>{error}</p>
                </div>
            )}


            {/* =================================================
                RESTAURANT INFORMATION
            ================================================= */}

            <div className="settings-card">

                <div className="settings-card-header">

                    <div className="settings-card-icon">
                        🍅
                    </div>

                    <div>
                        <h2>Restaurant Information</h2>

                        <p>
                            Basic information about your restaurant
                        </p>
                    </div>

                </div>


                <div className="settings-form-grid">

                    {/* Restaurant Name */}

                    <div className="settings-field">

                        <label>
                            Restaurant Name
                        </label>

                        <input
                            type="text"
                            name="restaurantName"
                            value={settings.restaurantName}
                            onChange={handleChange}
                            placeholder="Restaurant name"
                        />

                    </div>


                    {/* Email */}

                    <div className="settings-field">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={settings.email}
                            onChange={handleChange}
                            placeholder="restaurant@example.com"
                        />

                    </div>


                    {/* Phone */}

                    <div className="settings-field">

                        <label>
                            Phone
                        </label>

                        <input
                            type="text"
                            name="phone"
                            value={settings.phone}
                            onChange={handleChange}
                            placeholder="+91 9876543210"
                        />

                    </div>


                    {/* Currency */}

                    <div className="settings-field">

                        <label>
                            Currency
                        </label>

                        <select
                            name="currency"
                            value={settings.currency}
                            onChange={handleChange}
                        >
                            <option value="$">
                                $ - Dollar
                            </option>

                            <option value="₹">
                                ₹ - Rupee
                            </option>

                            <option value="€">
                                € - Euro
                            </option>

                            <option value="£">
                                £ - Pound
                            </option>
                        </select>

                    </div>

                </div>

            </div>


            {/* =================================================
                DELIVERY SETTINGS
            ================================================= */}

            <div className="settings-card">

                <div className="settings-card-header">

                    <div className="settings-card-icon">
                        🚚
                    </div>

                    <div>
                        <h2>Delivery Settings</h2>

                        <p>
                            Configure delivery charges and minimum order
                        </p>
                    </div>

                </div>


                <div className="settings-form-grid">

                    {/* Delivery Fee */}

                    <div className="settings-field">

                        <label>
                            Delivery Fee
                        </label>

                        <div className="input-with-symbol">

                            <span>
                                {settings.currency}
                            </span>

                            <input
                                type="number"
                                name="deliveryFee"
                                min="0"
                                step="0.01"
                                value={settings.deliveryFee}
                                onChange={handleChange}
                            />

                        </div>

                        <small>
                            This value will be used in the customer cart.
                        </small>

                    </div>


                    {/* Minimum Order */}

                    <div className="settings-field">

                        <label>
                            Minimum Order
                        </label>

                        <div className="input-with-symbol">

                            <span>
                                {settings.currency}
                            </span>

                            <input
                                type="number"
                                name="minOrder"
                                min="0"
                                step="0.01"
                                value={settings.minOrder}
                                onChange={handleChange}
                            />

                        </div>

                        <small>
                            Customers cannot checkout below this amount.
                        </small>

                    </div>

                </div>

            </div>


            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <div className="settings-card">

                <div className="settings-card-header">

                    <div className="settings-card-icon">
                        🔔
                    </div>

                    <div>
                        <h2>Notifications</h2>

                        <p>
                            Control admin notifications
                        </p>
                    </div>

                </div>


                <div className="settings-options">

                    {/* Notifications */}

                    <div className="settings-option">

                        <div className="settings-option-text">

                            <h3>
                                Notifications
                            </h3>

                            <p>
                                Receive notifications about new orders
                            </p>

                        </div>


                        <button
                            type="button"
                            className={`settings-toggle ${
                                settings.notifications
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleToggle("notifications")
                            }
                            aria-label="Toggle notifications"
                        >
                            <span></span>
                        </button>

                    </div>


                    {/* Email Notifications */}

                    <div className="settings-option">

                        <div className="settings-option-text">

                            <h3>
                                Email Notifications
                            </h3>

                            <p>
                                Receive order notifications by email
                            </p>

                        </div>


                        <button
                            type="button"
                            className={`settings-toggle ${
                                settings.emailNotifications
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleToggle(
                                    "emailNotifications"
                                )
                            }
                            aria-label="Toggle email notifications"
                        >
                            <span></span>
                        </button>

                    </div>


                    {/* Auto Confirm */}

                    <div className="settings-option">

                        <div className="settings-option-text">

                            <h3>
                                Auto Confirm Orders
                            </h3>

                            <p>
                                Automatically confirm new orders
                            </p>

                        </div>


                        <button
                            type="button"
                            className={`settings-toggle ${
                                settings.autoConfirm
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleToggle(
                                    "autoConfirm"
                                )
                            }
                            aria-label="Toggle auto confirm"
                        >
                            <span></span>
                        </button>

                    </div>

                </div>

            </div>


            {/* =================================================
                ADMIN INFORMATION
            ================================================= */}

            <div className="settings-card">

                <div className="settings-card-header">

                    <div className="settings-card-icon">
                        👤
                    </div>

                    <div>
                        <h2>Admin Information</h2>

                        <p>
                            Current administrator information
                        </p>
                    </div>

                </div>


                <div className="admin-info">

                    <div className="admin-info-item">

                        <span>
                            Account
                        </span>

                        <strong>
                            {localStorage.getItem("admin") ||
                                "Admin"}
                        </strong>

                    </div>


                    <div className="admin-info-item">

                        <span>
                            Access
                        </span>

                        <strong>
                            Administrator
                        </strong>

                    </div>

                </div>

            </div>


            {/* =================================================
                ACTION BUTTONS
            ================================================= */}

            <div className="settings-actions">

                <button
                    type="button"
                    className="cancel-btn"
                    onClick={handleCancel}
                    disabled={saving}
                >
                    Cancel
                </button>


                <button
                    type="button"
                    className="save-btn"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <>
                            <span className="button-spinner"></span>
                            Saving...
                        </>
                    ) : (
                        "Save Changes"
                    )}
                </button>

            </div>

        </div>
    );
}

export default Settings;