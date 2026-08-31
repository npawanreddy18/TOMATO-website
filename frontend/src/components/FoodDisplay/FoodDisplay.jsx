import React, { useContext, useMemo } from "react";

import FoodItem from "../FoodItem/FoodItem";

import {
    StoreContext
} from "../../context/StoreContext";

import "./FoodDisplay.css";


const FoodDisplay = ({
    category
}) => {

    const {
        food_list,
        searchTerm
    } = useContext(StoreContext);


    /* =========================================
       FILTER FOOD
    ========================================= */

    const filteredFood = useMemo(() => {

        const search =
            searchTerm.trim().toLowerCase();


        return food_list.filter((item) => {

            /* CATEGORY FILTER */

            const categoryMatch =
                category === "All" ||
                category === item.category;


            /* SEARCH FILTER */

            const searchMatch =
                search === "" ||
                item.name
                    ?.toLowerCase()
                    .includes(search) ||
                item.description
                    ?.toLowerCase()
                    .includes(search) ||
                item.category
                    ?.toLowerCase()
                    .includes(search);


            return (
                categoryMatch &&
                searchMatch
            );

        });

    }, [
        food_list,
        category,
        searchTerm
    ]);


    return (

        <section
            className="food-display"
            id="food-display"
        >

            {/* =================================
                TITLE
            ================================= */}

            <div className="food-display-heading">

                <h2>
                    {searchTerm
                        ? `Search results for "${searchTerm}"`
                        : "Top dishes near you"}
                </h2>

            </div>


            {/* =================================
                FOOD GRID
            ================================= */}

            {filteredFood.length > 0 ? (

                <div className="food-display-list">

                    {filteredFood.map((item) => (

                        <FoodItem
                            key={item._id}
                            id={item._id}
                            name={item.name}
                            price={item.price}
                            description={
                                item.description
                            }
                            image={item.image}
                        />

                    ))}

                </div>

            ) : (

                /* =================================
                   NO RESULTS
                ================================= */

                <div className="no-food-found">

                    <div className="no-food-icon">
                        🔍
                    </div>

                    <h3>
                        No food found
                    </h3>

                    <p>
                        Try searching for another
                        dish or choose a different
                        category.
                    </p>

                </div>

            )}

        </section>

    );

};


export default FoodDisplay;