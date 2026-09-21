import React, { useEffect, useState } from "react";
import "./Analytics.css";

const API_URL = "https://tomato-backend-dgur.onrender.com";

const STATUS_LIST = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
];

function Analytics() {
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("adminToken");

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const [ordersResponse, customersResponse] = await Promise.all([
                fetch(`${API_URL}/api/order/all-orders`, {
                    headers,
                }),
                fetch(`${API_URL}/api/user/all`, {
                    headers,
                }),
            ]);

            const ordersData = await ordersResponse.json();
            const customersData = await customersResponse.json();

            if (!ordersResponse.ok || !ordersData.success) {
                throw new Error(
                    ordersData.message || "Failed to load orders"
                );
            }

            setOrders(ordersData.orders || []);

            if (customersResponse.ok && customersData.success) {
                setCustomers(customersData.customers || []);
            } else {
                setCustomers([]);
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to load analytics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    // ------------------------------------------------
    // CALCULATIONS
    // ------------------------------------------------

    const activeOrders = orders.filter(
        (order) => order.status !== "Cancelled"
    );

    const totalOrders = activeOrders.length;

    const totalRevenue = activeOrders.reduce(
        (sum, order) => sum + Number(order.total || 0),
        0
    );

    const averageOrder =
        totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const statusCounts = STATUS_LIST.map((status) => ({
        status,
        count: orders.filter((order) => order.status === status).length,
    }));

    const maxStatusCount = Math.max(
        ...statusCounts.map((item) => item.count),
        1
    );

    // ------------------------------------------------
    // PAYMENT METHODS
    // ------------------------------------------------

    const paymentMethods = [
        {
            name: "Cash",
            icon: "💵",
            count: activeOrders.filter(
                (order) => order.paymentMethod === "cash"
            ).length,
        },
        {
            name: "Card",
            icon: "💳",
            count: activeOrders.filter(
                (order) => order.paymentMethod === "card"
            ).length,
        },
        {
            name: "UPI",
            icon: "📱",
            count: activeOrders.filter(
                (order) => order.paymentMethod === "upi"
            ).length,
        },
    ];

    // ------------------------------------------------
    // BEST SELLING FOOD
    // ------------------------------------------------

    const foodSales = {};

    activeOrders.forEach((order) => {
        (order.items || []).forEach((item) => {
            if (!foodSales[item.name]) {
                foodSales[item.name] = {
                    name: item.name,
                    quantity: 0,
                    revenue: 0,
                };
            }

            foodSales[item.name].quantity += Number(item.quantity || 0);

            foodSales[item.name].revenue +=
                Number(item.price || 0) * Number(item.quantity || 0);
        });
    });

    const bestSellingFoods = Object.values(foodSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

    // ------------------------------------------------
    // LOADING
    // ------------------------------------------------

    if (loading) {
        return (
            <div className="analytics-page">
                <div className="analytics-loading">
                    <div className="analytics-spinner"></div>
                    <p>Loading analytics...</p>
                </div>
            </div>
        );
    }

    // ------------------------------------------------
    // ERROR
    // ------------------------------------------------

    if (error) {
        return (
            <div className="analytics-page">
                <div className="analytics-error">
                    <div className="error-icon">⚠️</div>

                    <h3>Unable to load analytics</h3>

                    <p>{error}</p>

                    <button onClick={fetchAnalytics}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="analytics-page">

            {/* PAGE HEADER */}
            <div className="analytics-header">
                <div>
                    <h1>Analytics</h1>
                    <p>
                        Understand your Tomato business performance
                    </p>
                </div>

                <button
                    className="refresh-button"
                    onClick={fetchAnalytics}
                >
                    ↻ Refresh
                </button>
            </div>

            {/* TOP CARDS */}
            <div className="analytics-cards">

                <div className="analytics-card">
                    <div className="analytics-card-top">
                        <span className="analytics-card-icon revenue-icon">
                            💰
                        </span>
                    </div>

                    <p>Total Revenue</p>

                    <h2>
                        ${totalRevenue.toFixed(2)}
                    </h2>

                    <span className="card-description">
                        From completed and active orders
                    </span>
                </div>

                <div className="analytics-card">
                    <div className="analytics-card-top">
                        <span className="analytics-card-icon order-icon">
                            🛒
                        </span>
                    </div>

                    <p>Total Orders</p>

                    <h2>{totalOrders}</h2>

                    <span className="card-description">
                        All customer orders
                    </span>
                </div>

                <div className="analytics-card">
                    <div className="analytics-card-top">
                        <span className="analytics-card-icon customer-icon">
                            👥
                        </span>
                    </div>

                    <p>Customers</p>

                    <h2>{customers.length}</h2>

                    <span className="card-description">
                        Registered customers
                    </span>
                </div>

                <div className="analytics-card">
                    <div className="analytics-card-top">
                        <span className="analytics-card-icon average-icon">
                            📊
                        </span>
                    </div>

                    <p>Average Order</p>

                    <h2>
                        ${averageOrder.toFixed(2)}
                    </h2>

                    <span className="card-description">
                        Average value per order
                    </span>
                </div>

            </div>

            {/* MAIN ANALYTICS GRID */}
            <div className="analytics-grid">

                {/* ORDER STATUS */}
                <div className="analytics-box status-box">

                    <div className="box-header">
                        <div>
                            <h2>Order Status Distribution</h2>
                            <p>Current order status breakdown</p>
                        </div>
                    </div>

                    <div className="chart">

                        <div className="chart-y-axis">
                            <span>{maxStatusCount}</span>
                            <span>
                                {Math.ceil(maxStatusCount * 0.75)}
                            </span>
                            <span>
                                {Math.ceil(maxStatusCount * 0.5)}
                            </span>
                            <span>
                                {Math.ceil(maxStatusCount * 0.25)}
                            </span>
                            <span>0</span>
                        </div>

                        <div className="chart-area">

                            <div className="chart-grid-lines">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>

                            <div className="bars">

                                {statusCounts.map((item) => {

                                    const height =
                                        item.count === 0
                                            ? 0
                                            : Math.max(
                                                  (item.count /
                                                      maxStatusCount) *
                                                      100,
                                                  8
                                              );

                                    return (
                                        <div
                                            className="bar-column"
                                            key={item.status}
                                        >

                                            <div className="bar-value">
                                                {item.count}
                                            </div>

                                            <div
                                                className="bar"
                                                style={{
                                                    height: `${height}%`,
                                                }}
                                            ></div>

                                            <div className="bar-label">
                                                {item.status ===
                                                "Out for Delivery"
                                                    ? "Delivery"
                                                    : item.status}
                                            </div>

                                        </div>
                                    );
                                })}

                            </div>

                        </div>

                    </div>
                </div>

                {/* REVENUE */}
                <div className="analytics-box revenue-box">

                    <div className="box-header">
                        <div>
                            <h2>Revenue Overview</h2>
                            <p>Revenue from active orders</p>
                        </div>
                    </div>

                    <div className="revenue-circle">

                        <div className="circle">
                            <strong>
                                ${totalRevenue.toFixed(2)}
                            </strong>

                            <span>Total Revenue</span>
                        </div>

                    </div>

                    <div className="payment-list">

                        {paymentMethods.map((payment) => (
                            <div
                                className="payment-row"
                                key={payment.name}
                            >
                                <div className="payment-name">
                                    <span>
                                        {payment.icon}
                                    </span>

                                    <span>
                                        {payment.name}
                                    </span>
                                </div>

                                <strong>
                                    {payment.count}
                                </strong>
                            </div>
                        ))}

                    </div>

                </div>

            </div>

            {/* LOWER GRID */}
            <div className="analytics-lower-grid">

                {/* BEST SELLING */}
                <div className="analytics-box best-food-box">

                    <div className="box-header">
                        <div>
                            <h2>Best-Selling Foods</h2>
                            <p>Top food items by quantity sold</p>
                        </div>
                    </div>

                    {bestSellingFoods.length === 0 ? (
                        <div className="empty-data">
                            No food sales available
                        </div>
                    ) : (
                        <div className="food-sales-list">

                            {bestSellingFoods.map(
                                (food, index) => (
                                    <div
                                        className="food-sale-row"
                                        key={food.name}
                                    >

                                        <div className="food-rank">
                                            {index + 1}
                                        </div>

                                        <div className="food-sale-info">
                                            <strong>
                                                {food.name}
                                            </strong>

                                            <span>
                                                {food.quantity} items sold
                                            </span>
                                        </div>

                                        <strong className="food-revenue">
                                            $
                                            {food.revenue.toFixed(
                                                2
                                            )}
                                        </strong>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                </div>

                {/* PAYMENT SUMMARY */}
                <div className="analytics-box payment-summary-box">

                    <div className="box-header">
                        <div>
                            <h2>Payment Summary</h2>
                            <p>Orders by payment method</p>
                        </div>
                    </div>

                    <div className="payment-summary">

                        {paymentMethods.map(
                            (payment) => {

                                const percentage =
                                    totalOrders > 0
                                        ? Math.round(
                                              (payment.count /
                                                  totalOrders) *
                                                  100
                                          )
                                        : 0;

                                return (
                                    <div
                                        className="payment-summary-item"
                                        key={payment.name}
                                    >

                                        <div className="payment-summary-top">

                                            <span>
                                                {payment.icon}{" "}
                                                {payment.name}
                                            </span>

                                            <strong>
                                                {
                                                    payment.count
                                                }{" "}
                                                orders
                                            </strong>

                                        </div>

                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{
                                                    width: `${percentage}%`,
                                                }}
                                            ></div>
                                        </div>

                                        <span className="percentage">
                                            {percentage}%
                                        </span>

                                    </div>
                                );
                            }
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Analytics;