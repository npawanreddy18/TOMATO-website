import React, {
    useContext
} from "react";

import {
    StoreContext
} from "../../context/StoreContext";

import {
    assets
} from "../../assets/assets";

import "./FoodItem.css";


const FoodItem = ({
    id,
    name,
    price,
    description,
    image
}) => {

    const {
        cartItems,
        addToCart,
        removeFromCart
    } = useContext(StoreContext);


    const quantity =
        cartItems[id] || 0;


    return (

        <article className="food-item">

            {/* =================================
                FOOD IMAGE
            ================================= */}

            <div className="food-item-image-container">

                <img
                    className="food-item-image"
                    src={image}
                    alt={name}
                    loading="lazy"
                />


                {/* ADD / QUANTITY CONTROL */}

                {quantity === 0 ? (

                    <button
                        type="button"
                        className="add-button"
                        onClick={() =>
                            addToCart(id)
                        }
                        aria-label={`Add ${name} to cart`}
                    >

                        <img
                            src={
                                assets.add_icon_white
                            }
                            alt=""
                        />

                    </button>

                ) : (

                    <div className="food-item-counter">

                        <button
                            type="button"
                            onClick={() =>
                                removeFromCart(id)
                            }
                            aria-label={`Remove one ${name}`}
                        >

                            <img
                                src={
                                    assets.remove_icon_red
                                }
                                alt="-"
                            />

                        </button>


                        <span>
                            {quantity}
                        </span>


                        <button
                            type="button"
                            onClick={() =>
                                addToCart(id)
                            }
                            aria-label={`Add one more ${name}`}
                        >

                            <span className="plus-icon">
                                +
                            </span>

                        </button>

                    </div>

                )}

            </div>


            {/* =================================
                FOOD INFO
            ================================= */}

            <div className="food-item-info">

                <div className="food-item-name-rating">

                    <h3>
                        {name}
                    </h3>


                    <img
                        src={
                            assets.rating_starts
                        }
                        alt="5 star rating"
                    />

                </div>


                <p className="food-item-description">

                    {description}

                </p>


                <p className="food-item-price">

                    ${Number(price).toFixed(2)}

                </p>

            </div>

        </article>

    );

};


export default FoodItem;