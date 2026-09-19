import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import {
    StoreContext
} from "../../context/StoreContext";

import "./cart.css";


const Cart = () => {

    const navigate = useNavigate();

    const {
        food_list,
        cartItems,
        addToCart,
        removeFromCart,

        cartSubtotal,
        deliveryFee,
        cartTotal,

        currency,
        minimumOrder,
        minimumOrderReached
    } = useContext(StoreContext);


    // =========================================
    // CART ITEMS
    // =========================================

    const cartData = food_list.filter(
        (item) => cartItems[item._id] > 0
    );


    // =========================================
    // REMOVE ENTIRE ITEM
    // =========================================

    const removeEntireItem = (id) => {

        const quantity =
            cartItems[id] || 0;

        for (
            let i = 0;
            i < quantity;
            i++
        ) {

            removeFromCart(id);

        }

    };


    // =========================================
    // PROCEED TO CHECKOUT
    // =========================================

    const handleCheckout = () => {

        if (cartData.length === 0) {
            return;
        }

        if (
            minimumOrder > 0 &&
            !minimumOrderReached
        ) {
            return;
        }

        navigate("/order");

    };


    // =========================================
    // EMPTY CART
    // =========================================

    if (cartData.length === 0) {

        return (

            <main className="cart-page">

                <div className="empty-cart">

                    <div className="empty-cart-icon">
                        🛒
                    </div>

                    <h2>
                        Your cart is empty
                    </h2>

                    <p>
                        Looks like you haven't
                        added anything to your
                        cart yet.
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


    return (

        <main className="cart-page">

            <div className="cart">

                {/* TITLE */}

                <div className="cart-heading">

                    <h1>
                        Your Cart
                    </h1>

                    <p>
                        Review your items before
                        placing your order.
                    </p>

                </div>


                {/* CART ITEMS */}

                <div className="cart-items">

                    <div className="cart-items-title">

                        <p>Items</p>
                        <p>Title</p>
                        <p>Price</p>
                        <p>Quantity</p>
                        <p>Total</p>
                        <p>Action</p>

                    </div>


                    {cartData.map((item) => {

                        const quantity =
                            cartItems[item._id];

                        const itemTotal =
                            Number(item.price) *
                            quantity;


                        return (

                            <div
                                className="cart-item"
                                key={item._id}
                            >

                                {/* IMAGE */}

                                <div className="cart-item-image">

                                    <img
                                        src={item.image}
                                        alt={item.name}
                                    />

                                </div>


                                {/* NAME */}

                                <div className="cart-item-name">

                                    <h3>
                                        {item.name}
                                    </h3>

                                    <p>
                                        {item.description}
                                    </p>

                                </div>


                                {/* PRICE */}

                                <div className="cart-item-price">

                                    <span className="mobile-label">
                                        Price
                                    </span>

                                    <strong>
                                        {currency}
                                        {Number(
                                            item.price
                                        ).toFixed(2)}
                                    </strong>

                                </div>


                                {/* QUANTITY */}

                                <div className="cart-item-quantity">

                                    <span className="mobile-label">
                                        Quantity
                                    </span>

                                    <div className="quantity-control">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeFromCart(
                                                    item._id
                                                )
                                            }
                                        >
                                            −
                                        </button>

                                        <span className="quantity-number">
                                            {quantity}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                addToCart(
                                                    item._id
                                                )
                                            }
                                        >
                                            +
                                        </button>

                                    </div>

                                </div>


                                {/* TOTAL */}

                                <div className="cart-item-total">

                                    <span className="mobile-label">
                                        Total
                                    </span>

                                    <strong>
                                        {currency}
                                        {itemTotal.toFixed(2)}
                                    </strong>

                                </div>


                                {/* REMOVE */}

                                <div className="cart-item-action">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeEntireItem(
                                                item._id
                                            )
                                        }
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>

                        );

                    })}

                </div>


                {/* BOTTOM */}

                <div className="cart-bottom">

                    {/* CART TOTAL */}

                    <div className="cart-total">

                        <h2>
                            Cart Totals
                        </h2>


                        <div className="cart-total-details">

                            <p>
                                Subtotal
                            </p>

                            <p>
                                {currency}
                                {Number(
                                    cartSubtotal
                                ).toFixed(2)}
                            </p>

                        </div>


                        <div className="cart-total-details">

                            <p>
                                Delivery Fee
                            </p>

                            <p>
                                {deliveryFee === 0
                                    ? "FREE"
                                    : `${currency}${Number(
                                        deliveryFee
                                    ).toFixed(2)}`}
                            </p>

                        </div>


                        {/* MINIMUM ORDER MESSAGE */}

                        {minimumOrder > 0 &&
                            !minimumOrderReached && (

                            <p className="delivery-message">

                                Add{" "}
                                {currency}
                                {(
                                    minimumOrder -
                                    cartSubtotal
                                ).toFixed(2)}

                                {" "}more to reach the
                                minimum order of{" "}

                                {currency}
                                {minimumOrder.toFixed(2)}.

                            </p>

                        )}


                        <div className="cart-total-details cart-grand-total">

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


                        <button
                            type="button"
                            className="checkout-button"
                            onClick={handleCheckout}
                            disabled={
                                minimumOrder > 0 &&
                                !minimumOrderReached
                            }
                        >
                            Proceed to Checkout
                        </button>

                    </div>


                    {/* PROMO */}

                    <div className="cart-promo">

                        <p>
                            Have a promo code?
                        </p>

                        <div className="promo-box">

                            <input
                                type="text"
                                placeholder="Promo code"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    alert(
                                        "Promo code feature will be connected to the backend later."
                                    )
                                }
                            >
                                Apply
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </main>

    );
};


export default Cart;