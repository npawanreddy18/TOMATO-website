import React, { useEffect, useState } from "react";
import "./Orders.css";

const API_URL = "https://tomato-backend-dgur.onrender.com";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("adminToken");

            if (!token) {
                setError(
                    "Admin login session expired."
                );
                return;
            }

            const response = await fetch(
                `${API_URL}/api/order/all-orders`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (data.success) {
                setOrders(
                    data.orders ||
                    data.data ||
                    []
                );
            } else {
                setError(
                    data.message ||
                    "Failed to load orders."
                );
            }
        } catch (error) {
            console.error(
                "Orders error:",
                error
            );

            setError(
                "Unable to connect to backend."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getOrderId = (order) => {
        return (
            order._id ||
            order.orderId ||
            "N/A"
        );
    };

    const getCustomerName = (order) => {
        if (order.user && typeof order.user === "object") {
            return (
                order.user.name ||
                order.user.username ||
                order.user.email ||
                "Customer"
            );
        }

        return (
            order.name ||
            order.customerName ||
            order.userName ||
            "Customer"
        );
    };

    const getItems = (order) => {
        if (Array.isArray(order.items)) {
            return order.items;
        }

        if (Array.isArray(order.foodItems)) {
            return order.foodItems;
        }

        return [];
    };

    const getTotal = (order) => {
        return Number(
            order.amount ??
            order.totalAmount ??
            order.total ??
            0
        );
    };

    return (
        <div className="orders-page">

            <div className="orders-page-header">

                <div>
                    <h1>Orders</h1>
                    <p>
                        View customer orders
                    </p>
                </div>

                <button
                    className="refresh-btn"
                    onClick={fetchOrders}
                >
                    Refresh
                </button>

            </div>

            {loading && (
                <div className="orders-message">
                    Loading orders...
                </div>
            )}

            {!loading && error && (
                <div className="orders-message error">
                    {error}
                </div>
            )}

            {!loading &&
                !error &&
                orders.length === 0 && (
                    <div className="orders-message">
                        No orders found.
                    </div>
                )}

            {!loading &&
                !error &&
                orders.length > 0 && (

                    <div className="orders-list">

                        {orders.map((order, index) => {

                            const items =
                                getItems(order);

                            return (
                                <div
                                    className="order-card"
                                    key={
                                        order._id ||
                                        index
                                    }
                                >

                                    <div className="order-header">

                                        <div>
                                            <h3>
                                                Order #
                                                {getOrderId(
                                                    order
                                                )
                                                    .toString()
                                                    .slice(-8)}
                                            </h3>

                                            <p>
                                                Customer:{" "}
                                                {getCustomerName(
                                                    order
                                                )}
                                            </p>
                                        </div>

                                        <div className="order-total">
                                            $
                                            {getTotal(
                                                order
                                            ).toFixed(2)}
                                        </div>

                                    </div>

                                    <div className="order-items">

                                        {items.length > 0 ? (
                                            items.map(
                                                (
                                                    item,
                                                    itemIndex
                                                ) => (
                                                    <div
                                                        className="order-item"
                                                        key={
                                                            itemIndex
                                                        }
                                                    >

                                                        <span>
                                                            {item.name ||
                                                                item.foodName ||
                                                                "Food Item"}
                                                        </span>

                                                        <span>
                                                            x{" "}
                                                            {item.quantity ||
                                                                item.qty ||
                                                                1}
                                                        </span>

                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <div className="order-item">
                                                Order items
                                                unavailable
                                            </div>
                                        )}

                                    </div>

                                    <div className="order-footer">

                                        <span>
                                            Status:{" "}
                                            <strong>
                                                {order.status ||
                                                    "Placed"}
                                            </strong>
                                        </span>

                                        {order.createdAt && (
                                            <span>
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleString()}
                                            </span>
                                        )}

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

        </div>
    );
};

export default Orders;