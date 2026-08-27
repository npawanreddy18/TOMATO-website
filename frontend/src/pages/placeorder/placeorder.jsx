import React from 'react';
import './placeorder.css';

const PlaceOrder = () => {
    return (
        <div className="place-order">

            <div className="place-order-left">
                <h2>Delivery Information</h2>

                <div className="multi-fields">
                    <input type="text" placeholder="First name" />
                    <input type="text" placeholder="Last name" />
                </div>

                <input type="email" placeholder="Email address" />
                <input type="text" placeholder="Street" />

                <div className="multi-fields">
                    <input type="text" placeholder="City" />
                    <input type="text" placeholder="State" />
                </div>

                <div className="multi-fields">
                    <input type="text" placeholder="Zip code" />
                    <input type="text" placeholder="Country" />
                </div>

                <input type="text" placeholder="Phone" />
            </div>

            <div className="place-order-right">
                <h2>Cart Total</h2>

                <div className="cart-total-details">
                    <p>Subtotal</p>
                    <p>₹0</p>
                </div>

                <hr />

                <div className="cart-total-details">
                    <p>Delivery Fee</p>
                    <p>₹2</p>
                </div>

                <hr />

                <div className="cart-total-details">
                    <b>Total</b>
                    <b>₹2</b>
                </div>

                <button>PROCEED TO PAYMENT</button>
            </div>

        </div>
    );
};

export default PlaceOrder;