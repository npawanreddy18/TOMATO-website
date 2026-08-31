import React from "react";

import {
    menu_list
} from "../../assets/assets";

import "./exploremenu.css";


const ExploreMenu = ({
    category,
    setCategory
}) => {

    const handleCategory = (menuName) => {

        setCategory((previous) => {

            if (previous === menuName) {

                return "All";

            }

            return menuName;

        });

    };


    return (

        <section
            className="explore-menu"
            id="explore-menu"
        >

            <div className="explore-menu-heading">

                <h2>
                    Explore our menu
                </h2>

                <p>
                    Choose from a variety of
                    delicious dishes and find
                    something you love.
                </p>

            </div>


            <div className="explore-menu-list">

                {menu_list.map(
                    (item, index) => (

                        <button
                            type="button"
                            key={
                                item.menu_name ||
                                index
                            }
                            className={
                                `explore-menu-item ${
                                    category ===
                                    item.menu_name
                                        ? "active"
                                        : ""
                                }`
                            }
                            onClick={() =>
                                handleCategory(
                                    item.menu_name
                                )
                            }
                        >

                            <div className="explore-menu-image">

                                <img
                                    src={item.menu_image}
                                    alt={
                                        item.menu_name
                                    }
                                />

                            </div>


                            <p>
                                {item.menu_name}
                            </p>

                        </button>

                    )
                )}

            </div>

        </section>

    );

};


export default ExploreMenu;