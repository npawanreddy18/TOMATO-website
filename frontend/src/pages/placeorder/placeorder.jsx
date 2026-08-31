import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    StoreContext
} from "../../context/StoreContext";

import "./placeorder.css";


const PlaceOrder = () => {

    const navigate = useNavigate();

    const {
        food_list,
        cartItems,
        removeFromCart
    } = useContext(StoreContext);


    const [paymentMethod, setPaymentMethod] =
        useState("cash");


    const [orderPlaced, setOrderPlaced] =
        useState(false);


    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: ""
    });


    /* =========================================
       CART DATA
    ========================================= */

    const cartData = food_list.filter(
        (item) => cartItems[item._id] > 0
    );


    /* =========================================
       SUBTOTAL
    ========================================= */

    const subtotal = cartData.reduce(
        (total, item) => {

            const quantity =
                cartItems[item._id] || 0;

            return (
                total +
                Number(item.price) * quantity
            );

        },
        0
    );


    const deliveryFee =
        subtotal === 0
            ? 0
            : subtotal >= 50
                ? 0
                : 2.99;


    const total =
        subtotal + deliveryFee;


    /* =========================================
       FORM CHANGE
    ========================================= */

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    /* =========================================
       PLACE ORDER
    ========================================= */

    const handleSubmit = (event) => {

        event.preventDefault();


        if (cartData.length === 0) {

            alert(
                "Your cart is empty."
            );

            navigate("/");

            return;
        }


        setOrderPlaced(true);

    };


    /* =========================================
       EMPTY CART
    ========================================= */

    if (cartData.length === 0 && !orderPlaced) {

        return (

            <main className="place-order-page">

                <div className="checkout-empty">

                    <div className="checkout-empty-icon">
                        🛒
                    </div>

                    <h2>
                        Your cart is empty
                    </h2>

                    <p>
                        Add some delicious food
                        before checking out.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        Browse Food
                    </button>

                </div>

            </main>

        );

    }


    /* =========================================
       ORDER SUCCESS
    ========================================= */

    if (orderPlaced) {

        return (

            <main className="place-order-page">

                <div className="order-success">

                    <div className="success-icon">
                        ✓
                    </div>

                    <h1>
                        Order Placed Successfully!
                    </h1>

                    <p>
                        Thank you for your order,
                        {formData.firstName
                            ? ` ${formData.firstName}`
                            : ""}.
                    </p>

                    <p className="success-description">
                        Your food order has been
                        received. We will start
                        preparing it shortly.
                    </p>

                    <div className="success-total">

                        Order Total:
                        <strong>
                            ${total.toFixed(2)}
                        </strong>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        Continue Shopping
                    </button>

                </div>

            </main>

        );

    }


    return (

        <main className="place-order-page">

            <div className="place-order">

                {/* =================================
                    PAGE TITLE
                ================================= */}

                <div className="place-order-heading">

                    <h1>
                        Checkout
                    </h1>

                    <p>
                        Enter your delivery details
                        to place your order.
                    </p>

                </div>


                <form
                    className="checkout-form"
                    onSubmit={handleSubmit}
                >

                    {/* =================================
                        DELIVERY INFORMATION
                    ================================= */}

                    <section className="delivery-information">

                        <div className="checkout-card">

                            <h2>
                                Delivery Information
                            </h2>


                            <div className="name-fields">

                                <div className="form-group">

                                    <label>
                                        First name
                                    </label>

                                    <input
                                        type="text"
                                        name="firstName"
                                        value={
                                            formData.firstName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="First name"
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Last name
                                    </label>

                                    <input
                                        type="text"
                                        name="lastName"
                                        value={
                                            formData.lastName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Last name"
                                        required
                                    />

                                </div>

                            </div>


                            <div className="form-group">

                                <label>
                                    Email address
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="you@example.com"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Phone number
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={
                                        formData.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Phone number"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Address
                                </label>

                                <input
                                    type="text"
                                    name="address"
                                    value={
                                        formData.address
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Street address"
                                    required
                                />

                            </div>


                            <div className="location-fields">

                                <div className="form-group">

                                    <label>
                                        City
                                    </label>

                                    <input
                                        type="text"
                                        name="city"
                                        value={
                                            formData.city
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="City"
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        State
                                    </label>

                                    <input
                                        type="text"
                                        name="state"
                                        value={
                                            formData.state
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="State"
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        ZIP Code
                                    </label>

                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={
                                            formData.zipCode
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="ZIP"
                                        required
                                    />

                                </div>

                            </div>

                        </div>


                        {/* =================================
                            PAYMENT
                        ================================= */}

                        <div className="checkout-card payment-card">

                            <h2>
                                Payment Method
                            </h2>


                            <div className="payment-options">

                                <label
                                    className={
                                        paymentMethod === "cash"
                                            ? "payment-option active"
                                            : "payment-option"
                                    }
                                >

                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cash"
                                        checked={
                                            paymentMethod === "cash"
                                        }
                                        onChange={() =>
                                            setPaymentMethod(
                                                "cash"
                                            )
                                        }
                                    />

                                    <span className="payment-icon">
                                        💵
                                    </span>

                                    <span>
                                        Cash on Delivery
                                    </span>

                                </label>


                                <label
                                    className={
                                        paymentMethod === "card"
                                            ? "payment-option active"
                                            : "payment-option"
                                    }
                                >

                                    <input
                                        type="radio"
                                        name="payment"
                                        value="card"
                                        checked={
                                            paymentMethod === "card"
                                        }
                                        onChange={() =>
                                            setPaymentMethod(
                                                "card"
                                            )
                                        }
                                    />

                                    <span className="payment-icon">
                                        💳
                                    </span>

                                    <span>
                                        Card Payment
                                    </span>

                                </label>


                                <label
                                    className={
                                        paymentMethod === "upi"
                                            ? "payment-option active"
                                            : "payment-option"
                                    }
                                >

                                    <input
                                        type="radio"
                                        name="payment"
                                        value="upi"
                                        checked={
                                            paymentMethod === "upi"
                                        }
                                        onChange={() =>
                                            setPaymentMethod(
                                                "upi"
                                            )
                                        }
                                    />

                                    <span className="payment-icon">
                                        📱
                                    </span>

                                    <span>
                                        UPI Payment
                                    </span>

                                </label>

                            </div>


                            {paymentMethod !== "cash" && (

                                <p className="payment-note">

                                    Online payment will be
                                    connected to a payment
                                    gateway when the backend
                                    is added.

                                </p>

                            )}

                        </div>

                    </section>


                    {/* =================================
                        ORDER SUMMARY
                    ================================= */}

                    <aside className="order-summary">

                        <div className="checkout-card">

                            <h2>
                                Order Summary
                            </h2>


                            <div className="summary-items">

                                {cartData.map((item) => {

                                    const quantity =
                                        cartItems[item._id];

                                    const itemTotal =
                                        Number(item.price) *
                                        quantity;


                                    return (

                                        <div
                                            className="summary-item"
                                            key={item._id}
                                        >

                                            <div className="summary-image">

                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                />

                                            </div>


                                            <div className="summary-item-info">

                                                <h3>
                                                    {item.name}
                                                </h3>

                                                <p>
                                                    Qty: {quantity}
                                                </p>

                                            </div>


                                            <strong>
                                                ${itemTotal.toFixed(2)}
                                            </strong>

                                        </div>

                                    );

                                })}

                            </div>


                            <div className="summary-details">

                                <div>
                                    <span>
                                        Subtotal
                                    </span>

                                    <strong>
                                        ${subtotal.toFixed(2)}
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        Delivery
                                    </span>

                                    <strong>
                                        {deliveryFee === 0
                                            ? "FREE"
                                            : `$${deliveryFee.toFixed(2)}`}
                                    </strong>
                                </div>


                                <div className="summary-total">

                                    <span>
                                        Total
                                    </span>

                                    <strong>
                                        ${total.toFixed(2)}
                                    </strong>

                                </div>

                            </div>


                            <button
                                type="submit"
                                className="place-order-button"
                            >
                                Place Order — $
                                {total.toFixed(2)}
                            </button>


                            <button
                                type="button"
                                className="back-to-cart"
                                onClick={() =>
                                    navigate("/cart")
                                }
                            >
                                ← Back to Cart
                            </button>

                        </div>

                    </aside>

                </form>

            </div>

        </main>

    );

};


export default PlaceOrder;