import React, { useEffect, useState } from "react";
import "./Analytics.css";

const API_URL = "https://tomato-backend-dgur.onrender.com";

const Analytics = () => {
    const [foods, setFoods] = useState([]);
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAnalytics = async () => {
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

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const [
                foodResponse,
                orderResponse,
                customerResponse,
            ] = await Promise.all([
                fetch(
                    `${API_URL}/api/food/list`
                ),

                fetch(
                    `${API_URL}/api/order/all-orders`,
                    {
                        headers,
                    }
                ),

                fetch(
                    `${API_URL}/api/user/all`,
                    {
                        headers,
                    }
                ),
            ]);

            const foodData =
                await foodResponse.json();

            const orderData =
                await orderResponse.json();

            const customerData =
                await customerResponse.json();

            if (foodData.success) {
                setFoods(
                    foodData.data ||
                    foodData.foods ||
                    []
                );
            }

            if (orderData.success) {
                setOrders(
                    orderData.orders ||
                    orderData.data ||
                    []
                );
            }

            if (customerData.success) {
                setCustomers(
                    customerData.users ||
                    customerData.data ||
                    customerData.customers ||
                    []
                );
            }

        } catch (error) {
            console.error(
                "Analytics error:",
                error
            );

            setError(
                "Unable to load analytics."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAnalytics();
    }, []);

    const totalRevenue = orders.reduce(
        (total, order) => {
            return (
                total +
                Number(
                    order.amount ??
                    order.totalAmount ??
                    order.total ??
                    0
                )
            );
        },
        0
    );

    const availableFoods = foods.filter(
        (food) =>
            food.available !== false
    ).length;

    const unavailableFoods =
        foods.length - availableFoods;

    const averageOrder =
        orders.length > 0
            ? totalRevenue / orders.length
            : 0;

    const categoryCounts = {};

    foods.forEach((food) => {
        const category =
            food.category || "Other";

        categoryCounts[category] =
            (categoryCounts[category] || 0) +
            1;
    });

    return (
        <div className="analytics-page">

            <div className="analytics-page-header">

                <div>
                    <h1>Analytics</h1>

                    <p>
                        Overview of your Tomato
                        business
                    </p>
                </div>

                <button
                    className="refresh-btn"
                    onClick={loadAnalytics}
                >
                    Refresh
                </button>

            </div>

            {loading && (
                <div className="analytics-message">
                    Loading analytics...
                </div>
            )}

            {!loading && error && (
                <div className="analytics-message error">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <>
                    <div className="analytics-cards">

                        <div className="analytics-card">
                            <span>
                                Total Revenue
                            </span>

                            <strong>
                                $
                                {totalRevenue.toFixed(
                                    2
                                )}
                            </strong>
                        </div>

                        <div className="analytics-card">
                            <span>
                                Total Orders
                            </span>

                            <strong>
                                {orders.length}
                            </strong>
                        </div>

                        <div className="analytics-card">
                            <span>
                                Customers
                            </span>

                            <strong>
                                {customers.length}
                            </strong>
                        </div>

                        <div className="analytics-card">
                            <span>
                                Food Items
                            </span>

                            <strong>
                                {foods.length}
                            </strong>
                        </div>

                    </div>

                    <div className="analytics-section">

                        <h2>
                            Order Statistics
                        </h2>

                        <div className="statistics-grid">

                            <div className="stat-box">
                                <span>
                                    Average Order
                                </span>

                                <strong>
                                    $
                                    {averageOrder.toFixed(
                                        2
                                    )}
                                </strong>
                            </div>

                            <div className="stat-box">
                                <span>
                                    Available Food
                                </span>

                                <strong>
                                    {availableFoods}
                                </strong>
                            </div>

                            <div className="stat-box">
                                <span>
                                    Unavailable Food
                                </span>

                                <strong>
                                    {unavailableFoods}
                                </strong>
                            </div>

                        </div>

                    </div>

                    <div className="analytics-section">

                        <h2>
                            Food Categories
                        </h2>

                        {Object.keys(
                            categoryCounts
                        ).length === 0 ? (

                            <p>
                                No category data
                                available.
                            </p>

                        ) : (

                            <div className="category-list">

                                {Object.entries(
                                    categoryCounts
                                ).map(
                                    ([
                                        category,
                                        count,
                                    ]) => (

                                        <div
                                            className="category-row"
                                            key={
                                                category
                                            }
                                        >

                                            <span>
                                                {category}
                                            </span>

                                            <strong>
                                                {count}
                                            </strong>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>
                </>
            )}

        </div>
    );
};

export default Analytics;