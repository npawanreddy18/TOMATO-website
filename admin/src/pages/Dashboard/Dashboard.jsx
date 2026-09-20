import React, { useEffect, useState } from "react";

import "./Dashboard.css";


// =====================================================
// DEPLOYED BACKEND URL
// =====================================================

const API_URL = "https://tomato-backend-dgur.onrender.com";


function Dashboard() {

    const [orders, setOrders] = useState([]);
    const [foods, setFoods] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // FETCH DASHBOARD DATA
    // =====================================================

    const fetchDashboard = async () => {

        try {

            setLoading(true);
            setError("");


            // =================================================
            // GET ADMIN JWT TOKEN
            // =================================================

            const token =
                localStorage.getItem("adminToken");


            if (!token) {

                throw new Error(
                    "Admin login required."
                );

            }


            // =================================================
            // REQUEST HEADERS
            // =================================================

            const headers = {

                "Authorization":
                    `Bearer ${token}`

            };


            // =================================================
            // FETCH ALL DATA
            // =================================================

            const [
                ordersResponse,
                foodsResponse,
                customersResponse
            ] = await Promise.all([

                fetch(
                    `${API_URL}/api/order/all-orders`,
                    {
                        method: "GET",
                        headers
                    }
                ),

                fetch(
                    `${API_URL}/api/food/list`,
                    {
                        method: "GET",
                        headers
                    }
                ),

                fetch(
                    `${API_URL}/api/user/all`,
                    {
                        method: "GET",
                        headers
                    }
                )

            ]);


            // =================================================
            // CONVERT RESPONSES TO JSON
            // =================================================

            const ordersData =
                await ordersResponse.json();

            const foodsData =
                await foodsResponse.json();

            const customersData =
                await customersResponse.json();


            // =================================================
            // ORDERS
            // =================================================

            if (
                ordersResponse.ok &&
                ordersData.success
            ) {

                setOrders(
                    ordersData.orders || []
                );

            } else {

                throw new Error(
                    ordersData.message ||
                    "Failed to load orders"
                );

            }


            // =================================================
            // FOODS
            // =================================================

            if (
                foodsResponse.ok &&
                foodsData.success
            ) {

                setFoods(
                    foodsData.foods || []
                );

            } else {

                setFoods([]);

            }


            // =================================================
            // CUSTOMERS
            // =================================================

            if (
                customersResponse.ok &&
                customersData.success
            ) {

                setCustomers(
                    customersData.customers || []
                );

            } else {

                setCustomers([]);

            }

        } catch (err) {

            console.error(
                "Dashboard error:",
                err
            );


            setError(
                err.message ||
                "Failed to load dashboard"
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOAD DASHBOARD
    // =====================================================

    useEffect(() => {

        fetchDashboard();

    }, []);


    // =====================================================
    // ACTIVE ORDERS
    // =====================================================

    const activeOrders =
        orders.filter(
            (order) =>
                order.status !== "Cancelled"
        );


    // =====================================================
    // DASHBOARD NUMBERS
    // =====================================================

    const totalOrders =
        activeOrders.length;


    const totalRevenue =
        activeOrders.reduce(
            (sum, order) =>
                sum +
                Number(order.total || 0),
            0
        );


    const pendingOrders =
        orders.filter(
            (order) =>
                order.status === "Pending"
        ).length;


    const outForDelivery =
        orders.filter(
            (order) =>
                order.status ===
                "Out for Delivery"
        ).length;


    const deliveredOrders =
        orders.filter(
            (order) =>
                order.status === "Delivered"
        ).length;


    const totalFoodItems =
        foods.length;


    const totalCustomers =
        customers.length;


    // =====================================================
    // RECENT ORDERS
    // =====================================================

    const recentOrders =
        [...orders]
            .sort(
                (a, b) =>
                    new Date(
                        b.createdAt
                    ) -
                    new Date(
                        a.createdAt
                    )
            )
            .slice(0, 5);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="dashboard-page">

                <div className="dashboard-loading">

                    <div className="dashboard-spinner"></div>

                    <p>
                        Loading dashboard...
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="dashboard-page">

                <div className="dashboard-error">

                    <div className="dashboard-error-icon">
                        ⚠️
                    </div>


                    <h3>
                        Unable to load dashboard
                    </h3>


                    <p>
                        {error}
                    </p>


                    <button
                        onClick={fetchDashboard}
                    >
                        Try Again
                    </button>

                </div>

            </div>

        );

    }


    // =====================================================
    // DASHBOARD
    // =====================================================

    return (

        <div className="dashboard-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="dashboard-header">

                <div>

                    <h1>
                        Dashboard
                    </h1>


                    <p>
                        Welcome to your food delivery
                        admin panel
                    </p>

                </div>


                <button
                    className="dashboard-refresh"
                    onClick={fetchDashboard}
                >
                    ↻ Refresh
                </button>

            </div>


            {/* =================================================
                TOP CARDS
            ================================================= */}

            <div className="dashboard-cards">


                {/* REVENUE */}

                <div className="dashboard-card">

                    <div className="dashboard-card-icon">
                        💰
                    </div>


                    <div className="dashboard-card-info">

                        <p>
                            Total Revenue
                        </p>


                        <h2>
                            ${totalRevenue.toFixed(2)}
                        </h2>


                        <span>
                            From active orders
                        </span>

                    </div>

                </div>


                {/* ORDERS */}

                <div className="dashboard-card">

                    <div className="dashboard-card-icon">
                        🛒
                    </div>


                    <div className="dashboard-card-info">

                        <p>
                            Total Orders
                        </p>


                        <h2>
                            {totalOrders}
                        </h2>


                        <span>
                            All customer orders
                        </span>

                    </div>

                </div>


                {/* CUSTOMERS */}

                <div className="dashboard-card">

                    <div className="dashboard-card-icon">
                        👥
                    </div>


                    <div className="dashboard-card-info">

                        <p>
                            Customers
                        </p>


                        <h2>
                            {totalCustomers}
                        </h2>


                        <span>
                            Registered customers
                        </span>

                    </div>

                </div>


                {/* FOOD */}

                <div className="dashboard-card">

                    <div className="dashboard-card-icon">
                        🍔
                    </div>


                    <div className="dashboard-card-info">

                        <p>
                            Total Food Items
                        </p>


                        <h2>
                            {totalFoodItems}
                        </h2>


                        <span>
                            Available in menu
                        </span>

                    </div>

                </div>

            </div>


            {/* =================================================
                ORDER STATUS CARDS
            ================================================= */}

            <div className="dashboard-status-cards">


                <div className="status-card">

                    <span className="status-icon">
                        ⏳
                    </span>


                    <div>

                        <p>
                            Pending Orders
                        </p>


                        <h3>
                            {pendingOrders}
                        </h3>

                    </div>

                </div>


                <div className="status-card">

                    <span className="status-icon">
                        🚚
                    </span>


                    <div>

                        <p>
                            Out for Delivery
                        </p>


                        <h3>
                            {outForDelivery}
                        </h3>

                    </div>

                </div>


                <div className="status-card">

                    <span className="status-icon">
                        ✅
                    </span>


                    <div>

                        <p>
                            Delivered Orders
                        </p>


                        <h3>
                            {deliveredOrders}
                        </h3>

                    </div>

                </div>

            </div>


            {/* =================================================
                LOWER SECTION
            ================================================= */}

            <div className="dashboard-bottom">


                {/* =================================================
                    RECENT ORDERS
                ================================================= */}

                <div className="recent-orders">

                    <div className="section-title">

                        <div>

                            <h2>
                                Recent Orders
                            </h2>


                            <p>
                                Latest customer orders
                            </p>

                        </div>

                    </div>


                    {recentOrders.length === 0 ? (

                        <div className="dashboard-empty">
                            No orders available
                        </div>

                    ) : (

                        <div className="orders-table">


                            <div className="orders-table-header">

                                <span>
                                    Order ID
                                </span>


                                <span>
                                    Customer
                                </span>


                                <span>
                                    Amount
                                </span>


                                <span>
                                    Status
                                </span>

                            </div>


                            {recentOrders.map(
                                (order) => (

                                    <div
                                        className="orders-table-row"
                                        key={order._id}
                                    >


                                        <span>

                                            #
                                            {order._id
                                                ?.slice(-6)
                                                .toUpperCase()}

                                        </span>


                                        <span>

                                            {order.firstName}{" "}
                                            {order.lastName}

                                        </span>


                                        <span>

                                            $
                                            {Number(
                                                order.total || 0
                                            ).toFixed(2)}

                                        </span>


                                        <span>

                                            <b
                                                className={`order-status ${String(
                                                    order.status
                                                )
                                                    .toLowerCase()
                                                    .replace(
                                                        /\s+/g,
                                                        "-"
                                                    )}`}
                                            >
                                                {order.status}
                                            </b>

                                        </span>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>


                {/* =================================================
                    QUICK SUMMARY
                ================================================= */}

                <div className="quick-summary">

                    <h2>
                        Quick Summary
                    </h2>


                    <div className="summary-row">

                        <span>
                            Total Orders
                        </span>


                        <strong>
                            {totalOrders}
                        </strong>

                    </div>


                    <div className="summary-row">

                        <span>
                            Total Sales
                        </span>


                        <strong>
                            ${totalRevenue.toFixed(2)}
                        </strong>

                    </div>


                    <div className="summary-row">

                        <span>
                            Pending Orders
                        </span>


                        <strong>
                            {pendingOrders}
                        </strong>

                    </div>


                    <div className="summary-row">

                        <span>
                            Delivered Orders
                        </span>


                        <strong>
                            {deliveredOrders}
                        </strong>

                    </div>


                    <div className="summary-row">

                        <span>
                            Customers
                        </span>


                        <strong>
                            {totalCustomers}
                        </strong>

                    </div>


                    <div className="summary-row">

                        <span>
                            Food Items
                        </span>


                        <strong>
                            {totalFoodItems}
                        </strong>

                    </div>

                </div>

            </div>

        </div>

    );

}


export default Dashboard;