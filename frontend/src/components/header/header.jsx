import React from "react";

import "./header.css";

const Header = () => {

    const scrollToMenu = () => {

        const menuSection =
            document.getElementById("explore-menu");

        if (menuSection) {

            menuSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    };


    return (

        <section className="header">

            <div className="header-contents">

                <h2>
                    Order your favourite food
                </h2>


                <p>
                    Discover delicious food from
                    our menu and order your
                    favourite meals quickly and
                    easily.
                </p>


                <button
                    type="button"
                    onClick={scrollToMenu}
                >
                    View Menu
                </button>

            </div>

        </section>

    );

};

export default Header;