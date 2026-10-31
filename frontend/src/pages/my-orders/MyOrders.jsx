import React, {useEffect,useState} from "react";
import "./MyOrders.css";



const MyOrders = () => {

    const [orders, setOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const url =
        "https://tomato-backend-dgur.onrender.com";


    // =========================================
    // FETCH MY ORDERS
    // =========================================

    const fetchOrders = async () => {

        try {

            setLoading(true);
            setError("");


            // =====================================
            // GET JWT TOKEN
            // =====================================

            const token =
                localStorage.getItem("token");


            // =====================================
            // CHECK LOGIN
            // =====================================

            if (!token) {

                setError(
                    "Please login to view your orders."
                );

                setLoading(false);

                return;
            }


            // =====================================
            // SEND JWT TO BACKEND
            // =====================================

            const response =
                await fetch(
                    `${url}/api/order/my-orders`,
                    {
                        method: "GET",

                        headers: {
                            "Authorization":
                                `Bearer ${token}`
                        }
                    }
                );


            const data =
                await response.json();


            // =====================================
            // HANDLE ERROR
            // =====================================

            if (
                !response.ok ||
                !data.success
            ) {

                setError(
                    data.message ||
                    "Failed to fetch orders."
                );

                return;
            }


            // =====================================
            // SAVE ORDERS
            // =====================================

            setOrders(
                data.orders || []
            );

        } catch (error) {

            console.error(
                "Error fetching orders:",
                error
            );

            setError(
                "Unable to connect to the server. Please make sure the backend is running."
            );

        } finally {

            setLoading(false);

        }
    };


    // =========================================
    // LOAD ORDERS
    // =========================================

    useEffect(() => {

        fetchOrders();

    }, []);


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="my-orders-page">

                <div className="my-orders-loading">

                    <div className="loading-spinner"></div>

                    <h2>
                        Loading your orders...
                    </h2>

                </div>

            </div>

        );
    }


    // =========================================
    // ERROR
    // =========================================

    if (error) {

        return (

            <div className="my-orders-page">

                <div className="my-orders-error">

                    <div className="error-icon">
                        !
                    </div>


                    <h2>
                        Something went wrong
                    </h2>


                    <p>
                        {error}
                    </p>


                    <button
                        onClick={fetchOrders}
                    >
                        Try Again
                    </button>

                </div>

            </div>

        );
    }


    // =========================================
    // NO ORDERS
    // =========================================

    if (orders.length === 0) {

        return (

            <div className="my-orders-page">

                <div className="my-orders-container">

                    <div className="my-orders-header">

                        <h1>
                            My Orders
                        </h1>

                        <p>
                            Track and manage your food orders
                        </p>

                    </div>


                    <div className="empty-orders">

                        <div className="empty-orders-icon">
                            🛒
                        </div>


                        <h2>
                            No Orders Yet
                        </h2>


                        <p>
                            You haven't placed any orders yet.
                        </p>


                        <button
                            onClick={() => {
                                window.location.href = "/";
                            }}
                        >
                            Order Food
                        </button>

                    </div>

                </div>

            </div>

        );
    }


    // =========================================
    // ORDERS
    // =========================================

    return (

        <div className="my-orders-page">

            <div className="my-orders-container">


                {/* =================================
                    HEADER
                ================================= */}

                <div className="my-orders-header">

                    <div>

                        <h1>
                            My Orders
                        </h1>

                        <p>
                            Track and manage your food orders
                        </p>

                    </div>


                    <div className="order-count">

                        {orders.length}{" "}

                        {orders.length === 1
                            ? "Order"
                            : "Orders"}

                    </div>

                </div>


                {/* =================================
                    ORDERS LIST
                ================================= */}

                <div className="orders-list">

                    {orders.map(
                        (order, index) => {

                            const orderDate =
                                new Date(
                                    order.createdAt ||
                                    order.date
                                );


                            return (

                                <div
                                    className="order-card"
                                    key={
                                        order._id ||
                                        index
                                    }
                                >


                                    {/* =========================
                                        ORDER TOP
                                    ========================= */}

                                    <div className="order-card-top">

                                        <div>

                                            <span className="order-label">
                                                Order ID
                                            </span>


                                            <h3>
                                                #
                                                {order._id}
                                            </h3>

                                        </div>


                                        <div
                                            className={`order-status ${
                                                order.status
                                                    ?.toLowerCase()
                                                    .replace(
                                                        /\s+/g,
                                                        "-"
                                                    )
                                            }`}
                                        >

                                            <span className="status-dot"></span>

                                            {order.status}

                                        </div>

                                    </div>


                                    {/* =========================
                                        DATE
                                    ========================= */}

                                    <div className="order-date">

                                        Ordered on{" "}

                                        {orderDate.toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric"
                                            }
                                        )}

                                        {" at "}

                                        {orderDate.toLocaleTimeString(
                                            "en-IN",
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            }
                                        )}

                                    </div>


                                    {/* =========================
                                        ITEMS
                                    ========================= */}

                                    <div className="order-items">

                                        <h4>
                                            Ordered Items
                                        </h4>


                                        {order.items?.map(
                                            (
                                                item,
                                                itemIndex
                                            ) => (

                                                <div
                                                    className="order-item"
                                                    key={
                                                        item.itemId ||
                                                        itemIndex
                                                    }
                                                >


                                                    <div className="item-info">

                                                        <div className="item-number">
                                                            {item.quantity}
                                                        </div>


                                                        <div>

                                                            <p className="item-name">
                                                                {item.name}
                                                            </p>


                                                            <span>

                                                                $
                                                                {Number(
                                                                    item.price
                                                                ).toFixed(
                                                                    2
                                                                )}

                                                                {" "}
                                                                each

                                                            </span>

                                                        </div>

                                                    </div>


                                                    <strong>

                                                        $
                                                        {(
                                                            Number(
                                                                item.price
                                                            ) *
                                                            Number(
                                                                item.quantity
                                                            )
                                                        ).toFixed(
                                                            2
                                                        )}

                                                    </strong>

                                                </div>

                                            )
                                        )}

                                    </div>


                                    {/* =========================
                                        ORDER BOTTOM
                                    ========================= */}

                                    <div className="order-card-bottom">


                                        {/* PAYMENT */}

                                        <div className="payment-info">

                                            <span>
                                                Payment
                                            </span>


                                            <strong>
                                                {order.paymentMethod
                                                    ?.toUpperCase()}
                                            </strong>

                                        </div>


                                        {/* PRICE SUMMARY */}

                                        <div className="price-summary">


                                            <div>

                                                <span>
                                                    Subtotal
                                                </span>

                                                <strong>

                                                    $
                                                    {Number(
                                                        order.subtotal
                                                    ).toFixed(
                                                        2
                                                    )}

                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Delivery
                                                </span>

                                                <strong>

                                                    {Number(
                                                        order.deliveryFee
                                                    ) === 0
                                                        ? "FREE"
                                                        : `$${Number(
                                                            order.deliveryFee
                                                        ).toFixed(
                                                            2
                                                        )}`}

                                                </strong>

                                            </div>


                                            <div className="grand-total">

                                                <span>
                                                    Total
                                                </span>

                                                <strong>

                                                    $
                                                    {Number(
                                                        order.total
                                                    ).toFixed(
                                                        2
                                                    )}

                                                </strong>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            );

                        }
                    )}

                </div>

            </div>

        </div>

    );
};


export default MyOrders;