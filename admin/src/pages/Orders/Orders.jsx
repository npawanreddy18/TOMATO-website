import React, { useEffect, useState } from "react";
import "./Orders.css";

const API_URL = "http://localhost:4000";

const statusOptions = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
    "Cancelled"
];

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    // =====================================================
    // GET ALL ORDERS
    // =====================================================

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("adminToken");

            if (!token) {
                setError("Admin login required.");
                return;
            }

            const response = await fetch(
                `${API_URL}/api/order/all-orders`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Unable to get orders"
                );
            }

            setOrders(data.orders || []);
        } catch (err) {
            console.log("Orders fetch error:", err);
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOAD ORDERS
    // =====================================================

    useEffect(() => {
        fetchOrders();
    }, []);

    // =====================================================
    // UPDATE ORDER STATUS
    // =====================================================

    const updateStatus = async (orderId, newStatus) => {
        try {
            setUpdatingId(orderId);

            const token = localStorage.getItem("adminToken");

            const response = await fetch(
                `${API_URL}/api/order/status/${orderId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Unable to update status"
                );
            }

            // Update the order directly on the page
            setOrders((previousOrders) =>
                previousOrders.map((order) =>
                    order._id === orderId
                        ? {
                              ...order,
                              status: newStatus
                          }
                        : order
                )
            );
        } catch (err) {
            console.log("Status update error:", err);
            alert(err.message || "Unable to update order status");
        } finally {
            setUpdatingId(null);
        }
    };

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="orders-page">
                <div className="orders-header">
                    <h1>Orders</h1>
                    <p>Manage customer orders</p>
                </div>

                <div className="orders-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading orders...</p>
                </div>
            </div>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <div className="orders-page">
                <div className="orders-header">
                    <h1>Orders</h1>
                    <p>Manage customer orders</p>
                </div>

                <div className="orders-error">
                    <div className="error-icon">⚠️</div>

                    <h3>Unable to load orders</h3>

                    <p>{error}</p>

                    <button onClick={fetchOrders}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // =====================================================
    // MAIN PAGE
    // =====================================================

    return (
        <div className="orders-page">

            {/* PAGE HEADER */}
            <div className="orders-header">
                <div>
                    <h1>Orders</h1>
                    <p>Manage and track customer orders</p>
                </div>

                <button
                    className="refresh-button"
                    onClick={fetchOrders}
                >
                    🔄 Refresh
                </button>
            </div>

            {/* ORDER COUNT */}
            <div className="order-summary">
                <div className="summary-card">
                    <div className="summary-icon">
                        🛒
                    </div>

                    <div>
                        <span>Total Orders</span>
                        <strong>{orders.length}</strong>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon">
                        ⏳
                    </div>

                    <div>
                        <span>Pending</span>
                        <strong>
                            {
                                orders.filter(
                                    (order) =>
                                        order.status === "Pending"
                                ).length
                            }
                        </strong>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon">
                        🚚
                    </div>

                    <div>
                        <span>Out for Delivery</span>
                        <strong>
                            {
                                orders.filter(
                                    (order) =>
                                        order.status ===
                                        "Out for Delivery"
                                ).length
                            }
                        </strong>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon">
                        ✅
                    </div>

                    <div>
                        <span>Delivered</span>
                        <strong>
                            {
                                orders.filter(
                                    (order) =>
                                        order.status ===
                                        "Delivered"
                                ).length
                            }
                        </strong>
                    </div>
                </div>
            </div>

            {/* NO ORDERS */}
            {orders.length === 0 ? (
                <div className="no-orders">
                    <div className="no-orders-icon">
                        🛒
                    </div>

                    <h3>No orders yet</h3>

                    <p>
                        Customer orders will appear here.
                    </p>
                </div>
            ) : (
                <div className="orders-list">

                    {orders.map((order) => (
                        <div
                            className="order-card"
                            key={order._id}
                        >

                            {/* ORDER TOP */}
                            <div className="order-card-top">

                                <div className="order-id">
                                    <span>Order ID</span>

                                    <strong>
                                        #{order._id.slice(-8).toUpperCase()}
                                    </strong>
                                </div>

                                <div className="order-date">
                                    {formatDate(order.createdAt)}
                                </div>

                            </div>

                            {/* ORDER CONTENT */}
                            <div className="order-card-content">

                                {/* CUSTOMER */}
                                <div className="order-section customer-section">

                                    <h3>
                                        👤 Customer
                                    </h3>

                                    <div className="customer-name">
                                        {order.firstName}{" "}
                                        {order.lastName}
                                    </div>

                                    <p>
                                        📧 {order.email}
                                    </p>

                                    <p>
                                        📞 {order.phone}
                                    </p>

                                </div>

                                {/* DELIVERY */}
                                <div className="order-section">

                                    <h3>
                                        📍 Delivery Address
                                    </h3>

                                    <p>
                                        {order.address}
                                    </p>

                                    <p>
                                        {order.city},{" "}
                                        {order.state}
                                    </p>

                                    <p>
                                        PIN: {order.zipCode}
                                    </p>

                                </div>

                                {/* PAYMENT */}
                                <div className="order-section">

                                    <h3>
                                        💳 Payment
                                    </h3>

                                    <p className="payment-method">
                                        {order.paymentMethod
                                            ? order.paymentMethod
                                                  .toUpperCase()
                                            : "N/A"}
                                    </p>

                                    <p>
                                        Subtotal: $
                                        {Number(
                                            order.subtotal || 0
                                        ).toFixed(2)}
                                    </p>

                                    <p>
                                        Delivery: $
                                        {Number(
                                            order.deliveryFee || 0
                                        ).toFixed(2)}
                                    </p>

                                    <strong className="order-total">
                                        Total: $
                                        {Number(
                                            order.total || 0
                                        ).toFixed(2)}
                                    </strong>

                                </div>

                            </div>

                            {/* ORDER ITEMS */}
                            <div className="order-items-section">

                                <h3>
                                    🍔 Order Items
                                </h3>

                                <div className="order-items">

                                    {order.items?.map(
                                        (item, index) => (
                                            <div
                                                className="order-item"
                                                key={
                                                    item.itemId ||
                                                    index
                                                }
                                            >

                                                <div className="item-number">
                                                    {index + 1}
                                                </div>

                                                <div className="item-details">
                                                    <strong>
                                                        {item.name}
                                                    </strong>

                                                    <span>
                                                        $
                                                        {Number(
                                                            item.price ||
                                                                0
                                                        ).toFixed(2)}{" "}
                                                        ×{" "}
                                                        {item.quantity}
                                                    </span>
                                                </div>

                                                <strong className="item-total">
                                                    $
                                                    {(
                                                        Number(
                                                            item.price ||
                                                                0
                                                        ) *
                                                        Number(
                                                            item.quantity ||
                                                                0
                                                        )
                                                    ).toFixed(2)}
                                                </strong>

                                            </div>
                                        )
                                    )}

                                </div>

                            </div>

                            {/* ORDER BOTTOM */}
                            <div className="order-card-bottom">

                                <div className="status-area">

                                    <label>
                                        Order Status
                                    </label>

                                    <select
                                        value={
                                            order.status ||
                                            "Pending"
                                        }
                                        disabled={
                                            updatingId ===
                                            order._id
                                        }
                                        onChange={(event) =>
                                            updateStatus(
                                                order._id,
                                                event.target.value
                                            )
                                        }
                                        className={`status-select status-${(
                                            order.status ||
                                            "Pending"
                                        )
                                            .toLowerCase()
                                            .replace(
                                                /\s+/g,
                                                "-"
                                            )
                                            .replace(
                                                /[^\w-]/g,
                                                ""
                                            )}`}
                                    >
                                        {statusOptions.map(
                                            (status) => (
                                                <option
                                                    key={status}
                                                    value={status}
                                                >
                                                    {status}
                                                </option>
                                            )
                                        )}
                                    </select>

                                    {updatingId ===
                                        order._id && (
                                        <span className="updating-text">
                                            Updating...
                                        </span>
                                    )}

                                </div>

                                <div className="final-total">
                                    <span>Order Total</span>

                                    <strong>
                                        $
                                        {Number(
                                            order.total || 0
                                        ).toFixed(2)}
                                    </strong>
                                </div>

                            </div>

                        </div>
                    ))}

                </div>
            )}
        </div>
    );
}

export default Orders;