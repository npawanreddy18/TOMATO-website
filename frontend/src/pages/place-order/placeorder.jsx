import React,{useContext,useState} from "react";
import { useNavigate } from "react-router-dom";
import {StoreContext} from "../../context/StoreContext";
import "./placeorder.css";

const API_URL = "https://tomato-backend-dgur.onrender.com";

const PlaceOrder = () => {

    const navigate = useNavigate();

    const {
        cartItems,
        food_list,
        cartSubtotal,
        deliveryFee,
        cartTotal,
        clearCart,
        currency,
        minimumOrder,
        minimumOrderReached
    } = useContext(StoreContext);


    // =====================================================
    // STATE
    // =====================================================

    const [orderPlaced, setOrderPlaced] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    // IMPORTANT:
    // Save the total before clearing the cart.
    const [placedOrderTotal, setPlacedOrderTotal] =
        useState(0);


    // =====================================================
    // FORM
    // =====================================================

    const [formData, setFormData] =
        useState({

            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            paymentMethod: "cash"

        });


    // =====================================================
    // HANDLE FORM
    // =====================================================

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


    // =====================================================
    // CART ITEMS
    // =====================================================

    const orderItems = food_list
        .filter(
            (item) =>
                cartItems[item._id] > 0
        )
        .map((item) => ({

            itemId: item._id,

            name: item.name,

            price: Number(item.price),

            quantity:
                Number(
                    cartItems[item._id]
                )

        }));


    // =====================================================
    // PLACE ORDER
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        // -----------------------------
        // EMPTY CART
        // -----------------------------

        if (orderItems.length === 0) {

            alert(
                "Your cart is empty."
            );

            navigate("/");

            return;
        }


        // -----------------------------
        // MINIMUM ORDER
        // -----------------------------

        if (!minimumOrderReached) {

            alert(
                `Minimum order amount is ${currency}${Number(
                    minimumOrder
                ).toFixed(2)}`
            );

            return;
        }


        try {

            // -------------------------
            // GET USER
            // -------------------------

            const savedUser =
                localStorage.getItem(
                    "user"
                );

            if (!savedUser) {

                alert(
                    "Please login before placing an order."
                );

                return;
            }


            const user =
                JSON.parse(savedUser);


            // -------------------------
            // USER ID
            // -------------------------

            if (!user.id) {

                alert(
                    "User information is missing. Please login again."
                );

                return;
            }


            setLoading(true);


            // =================================================
            // SAVE TOTAL BEFORE ORDER IS SENT
            // =================================================

            const finalOrderTotal =
                Number(cartTotal);


            // =================================================
            // ORDER DATA
            // =================================================

            const orderData = {

                userId: user.id,

                firstName:
                    formData.firstName,

                lastName:
                    formData.lastName,

                email:
                    formData.email,

                phone:
                    formData.phone,

                address:
                    formData.address,

                city:
                    formData.city,

                state:
                    formData.state,

                zipCode:
                    formData.zipCode,

                items:
                    orderItems,

                subtotal:
                    Number(cartSubtotal),

                deliveryFee:
                    Number(deliveryFee),

                total:
                    finalOrderTotal,

                paymentMethod:
                    formData.paymentMethod
            };


            // -------------------------
            // CUSTOMER TOKEN
            // -------------------------

            const token =
                localStorage.getItem(
                    "token"
                );


            // =================================================
            // SEND ORDER TO BACKEND
            // =================================================

            const response =
                await fetch(
                    `${API_URL}/api/order/place`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            ...(token
                                ? {
                                      Authorization:
                                          `Bearer ${token}`
                                  }
                                : {})
                        },

                        body:
                            JSON.stringify(
                                orderData
                            )
                    }
                );


            const data =
                await response.json();


            // =================================================
            // SUCCESS
            // =================================================

            if (data.success) {

                // =============================================
                // VERY IMPORTANT
                // Save total BEFORE clearing cart
                // =============================================

                setPlacedOrderTotal(
                    finalOrderTotal
                );


                // =============================================
                // Show success page
                // =============================================

                setOrderPlaced(true);


                // =============================================
                // Clear cart AFTER total is saved
                // =============================================

                clearCart();


            } else {

                alert(
                    data.message ||
                    "Failed to place order."
                );
            }


        } catch (error) {

            console.error(
                "Place Order Error:",
                error
            );

            alert(
                "Unable to connect to the server."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // ORDER SUCCESS
    // =====================================================

    if (orderPlaced) {

        return (

            <div className="place-order-success">

                <div className="success-box">

                    {/* SUCCESS ICON */}

                    <div className="success-icon">
                        ✓
                    </div>


                    {/* TITLE */}

                    <h1>
                        Order Placed Successfully!
                    </h1>


                    <p>
                        Thank you for your order.
                    </p>


                    

                    {/* =================================================
                        FIXED TOTAL
                    ================================================= */}

                    <h2>

                        Total:{" "}

                        {currency}

                        {Number(
                            placedOrderTotal
                        ).toFixed(2)}

                    </h2>


                    {/* VIEW ORDERS */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/my-orders"
                            )
                        }
                    >
                        View My Orders
                    </button>


                    {/* CONTINUE SHOPPING */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/")
                        }
                        style={{
                            marginLeft: "10px"
                        }}
                    >
                        Continue Shopping
                    </button>

                </div>

            </div>
        );
    }


    // =====================================================
    // EMPTY CART
    // =====================================================

    if (
        orderItems.length === 0
    ) {

        return (

            <div className="place-order-success">

                <div className="success-box">

                    <div className="success-icon">
                        🛒
                    </div>


                    <h2>
                        Your cart is empty
                    </h2>


                    <p>
                        Add some food before
                        checking out.
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

            </div>
        );
    }


    // =====================================================
    // CHECKOUT PAGE
    // =====================================================

    return (

        <div className="place-order">


            {/* =================================================
                LEFT
            ================================================= */}

            <form
                className="place-order-left"
                onSubmit={handleSubmit}
            >

                <h2>
                    Delivery Information
                </h2>


                {/* FIRST + LAST NAME */}

                <div className="multi-fields">

                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={
                            formData.firstName
                        }
                        onChange={
                            handleChange
                        }
                        required
                    />


                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={
                            formData.lastName
                        }
                        onChange={
                            handleChange
                        }
                        required
                    />

                </div>


                {/* EMAIL */}

                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={
                        formData.email
                    }
                    onChange={
                        handleChange
                    }
                    required
                />


                {/* PHONE */}

                <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={
                        formData.phone
                    }
                    onChange={
                        handleChange
                    }
                    required
                />


                {/* ADDRESS */}

                <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={
                        formData.address
                    }
                    onChange={
                        handleChange
                    }
                    required
                />


                {/* CITY + STATE */}

                <div className="multi-fields">

                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={
                            formData.city
                        }
                        onChange={
                            handleChange
                        }
                        required
                    />


                    <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={
                            formData.state
                        }
                        onChange={
                            handleChange
                        }
                        required
                    />

                </div>


                {/* ZIP */}

                <input
                    type="text"
                    name="zipCode"
                    placeholder="ZIP Code"
                    value={
                        formData.zipCode
                    }
                    onChange={
                        handleChange
                    }
                    required
                />


                {/* =================================================
                    PAYMENT METHOD
                ================================================= */}

                <h2 className="payment-title">
                    Payment Method
                </h2>


                <div className="payment-method">

                    {/* CASH */}

                    <label>

                        <input
                            type="radio"
                            name="paymentMethod"
                            value="cash"
                            checked={
                                formData.paymentMethod ===
                                "cash"
                            }
                            onChange={
                                handleChange
                            }
                        />

                        <span>
                            Cash on Delivery
                        </span>

                    </label>


                    {/* CARD */}

                    <label>

                        <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            checked={
                                formData.paymentMethod ===
                                "card"
                            }
                            onChange={
                                handleChange
                            }
                        />

                        <span>
                            Card Payment
                        </span>

                    </label>


                    {/* UPI */}

                    <label>

                        <input
                            type="radio"
                            name="paymentMethod"
                            value="upi"
                            checked={
                                formData.paymentMethod ===
                                "upi"
                            }
                            onChange={
                                handleChange
                            }
                        />

                        <span>
                            UPI Payment
                        </span>

                    </label>

                </div>


                {/* PLACE ORDER BUTTON */}

                <button
                    type="submit"
                    disabled={loading}
                >

                    {loading
                        ? "Placing Order..."
                        : "Place Order"}

                </button>

            </form>


            {/* =================================================
                RIGHT - CART TOTAL
            ================================================= */}

            <div className="place-order-right">

                <div className="cart-total">

                    <h2>
                        Cart Total
                    </h2>


                    {/* SUBTOTAL */}

                    <div>

                        <span>
                            Subtotal
                        </span>

                        <span>

                            {currency}

                            {Number(
                                cartSubtotal
                            ).toFixed(2)}

                        </span>

                    </div>


                    {/* DELIVERY FEE */}

                    <div>

                        <span>
                            Delivery Fee
                        </span>

                        <span>

                            {Number(
                                deliveryFee
                            ) === 0
                                ? "FREE"
                                : `${currency}${Number(
                                      deliveryFee
                                  ).toFixed(2)}`}

                        </span>

                    </div>


                    {/* MINIMUM ORDER */}

                    {Number(minimumOrder) > 0 && (

                        <p
                            style={{
                                fontSize:
                                    "14px",

                                color:
                                    "#777",

                                marginTop:
                                    "10px"
                            }}
                        >

                            Minimum order:{" "}

                            {currency}

                            {Number(
                                minimumOrder
                            ).toFixed(2)}

                        </p>

                    )}


                    {/* TOTAL */}

                    <div>

                        <b>
                            Total
                        </b>

                        <b>

                            {currency}

                            {Number(
                                cartTotal
                            ).toFixed(2)}

                        </b>

                    </div>


                </div>

            </div>

        </div>
    );
};


export default PlaceOrder;