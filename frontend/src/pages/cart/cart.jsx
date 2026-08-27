import React, { useContext } from 'react';
import './cart.css';
import { StoreContext } from '../../context/StoreContext';

const Cart = () => {

    const {
        cartItems,
        food_list,
        addToCart,
        removeFromCart,
        removeItem
    } = useContext(StoreContext);


    return (

        <div className="cart">

            <div className="cart-items">

                {/* =================================
                    CART HEADER
                ================================= */}

                <div className="cart-items-title">

                    <p>Items</p>

                    <p>Title</p>

                    <p>Price</p>

                    <p>Quantity</p>

                    <p>Total</p>

                    <p>Remove</p>

                </div>


                {/* =================================
                    CART PRODUCTS
                ================================= */}

                {food_list.map((item) => {

                    if (cartItems[item._id] > 0) {

                        return (

                            <div
                                key={item._id}
                                className="cart-items-title-item"
                            >

                                {/* FOOD IMAGE */}

                                <img
                                    src={item.image}
                                    alt={item.name}
                                />


                                {/* FOOD NAME */}

                                <p className="cart-item-name">
                                    {item.name}
                                </p>


                                {/* PRICE */}

                                <p className="cart-item-price">
                                    ${item.price}
                                </p>


                                {/* QUANTITY */}

                                <div className="quantity-control">

                                    <button
                                        className="quantity-btn"
                                        onClick={() =>
                                            removeFromCart(item._id)
                                        }
                                    >
                                        −
                                    </button>


                                    <span className="quantity-number">
                                        {cartItems[item._id]}
                                    </span>


                                    <button
                                        className="quantity-btn"
                                        onClick={() =>
                                            addToCart(item._id)
                                        }
                                    >
                                        +
                                    </button>

                                </div>


                                {/* TOTAL */}

                                <p className="cart-item-total">

                                    $
                                    {item.price *
                                        cartItems[item._id]}

                                </p>


                                {/* REMOVE */}

                                <div className="cart-action">

                                    <button
                                        onClick={() =>
                                            removeItem(item._id)
                                        }
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>

                        );

                    }

                    return null;

                })}

            </div>

        </div>

    );

};

export default Cart;