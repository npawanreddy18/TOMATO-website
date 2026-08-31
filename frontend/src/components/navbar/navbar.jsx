import React, {
    useContext,
    useEffect,
    useState
} from "react";

import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import { StoreContext } from "../../context/StoreContext";

import { assets } from "../../assets/assets";

import "./navbar.css";


const Navbar = ({ setShowLogin }) => {

    const {
        searchTerm,
        setSearchTerm,
        cartCount
    } = useContext(StoreContext);


    const [menu, setMenu] =
        useState("home");


    const [mobileMenu, setMobileMenu] =
        useState(false);


    const [searchOpen, setSearchOpen] =
        useState(false);


    const location = useLocation();

    const navigate = useNavigate();


    /* =========================================
       CHANGE ACTIVE MENU
    ========================================= */

    useEffect(() => {

        if (location.pathname === "/cart") {

            setMenu("cart");

        }
        else if (location.pathname === "/order") {

            setMenu("order");

        }
        else {

            setMenu("home");

        }

        setMobileMenu(false);

    }, [location.pathname]);


    /* =========================================
       CLOSE MOBILE MENU
    ========================================= */

    const closeMobileMenu = () => {

        setMobileMenu(false);

    };


    /* =========================================
       GO TO HOME SECTION
    ========================================= */

    const goToSection = (
        sectionId,
        menuName
    ) => {

        setMenu(menuName);

        closeMobileMenu();


        if (location.pathname !== "/") {

            navigate("/");

            setTimeout(() => {

                const section =
                    document.getElementById(
                        sectionId
                    );

                if (section) {

                    section.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }, 300);

        }
        else {

            const section =
                document.getElementById(
                    sectionId
                );

            if (section) {

                section.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }

    };


    /* =========================================
       SEARCH
    ========================================= */

    const handleSearch = (event) => {

        const value =
            event.target.value;

        setSearchTerm(value);


        if (location.pathname !== "/") {

            navigate("/");

        }

    };


    /* =========================================
       SEARCH BUTTON
    ========================================= */

    const openSearch = () => {

        setSearchOpen(true);

    };


    /* =========================================
       CLOSE SEARCH
    ========================================= */

    const closeSearch = () => {

        setSearchOpen(false);

    };


    /* =========================================
       CLEAR SEARCH
    ========================================= */

    const clearSearch = () => {

        setSearchTerm("");

    };


    return (

        <>

            {/* =====================================
                NAVBAR
            ===================================== */}

            <nav className="navbar">

                {/* LOGO */}

                <Link
                    to="/"
                    className="navbar-logo"
                    onClick={() =>
                        setMenu("home")
                    }
                >

                    <img
                        src={assets.logo}
                        alt="Tomato Logo"
                        className="logo"
                    />

                </Link>


                {/* =================================
                    DESKTOP / MOBILE MENU
                ================================= */}

                <div
                    className={
                        `navbar-menu ${
                            mobileMenu
                                ? "mobile-open"
                                : ""
                        }`
                    }
                >

                    {/* HOME */}

                    <Link
                        to="/"
                        className={
                            menu === "home"
                                ? "active"
                                : ""
                        }
                        onClick={() => {

                            setMenu("home");

                            closeMobileMenu();

                            window.scrollTo({
                                top: 0,
                                behavior: "smooth"
                            });

                        }}
                    >

                        Home

                    </Link>


                    {/* MENU */}

                    <button
                        type="button"
                        className={
                            menu === "menu"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            goToSection(
                                "explore-menu",
                                "menu"
                            )
                        }
                    >

                        Menu

                    </button>


                    {/* MOBILE APP */}

                    <button
                        type="button"
                        className={
                            menu === "mobile-app"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            goToSection(
                                "app-download",
                                "mobile-app"
                            )
                        }
                    >

                        Mobile App

                    </button>


                    {/* CONTACT */}

                    <button
                        type="button"
                        className={
                            menu === "contact-us"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            goToSection(
                                "footer",
                                "contact-us"
                            )
                        }
                    >

                        Contact Us

                    </button>

                </div>


                {/* =================================
                    RIGHT SIDE
                ================================= */}

                <div className="navbar-right">


                    {/* SEARCH */}

                    <button
                        type="button"
                        className="search-button"
                        aria-label="Search"
                        onClick={openSearch}
                    >

                        <img
                            src={
                                assets.search_icon
                            }
                            alt="Search"
                        />

                    </button>


                    {/* CART */}

                    <Link
                        to="/cart"
                        className="basket-link"
                        aria-label="Shopping Cart"
                        onClick={() =>
                            setMenu("cart")
                        }
                    >

                        <img
                            src={
                                assets.basket_icon
                            }
                            alt="Cart"
                        />


                        {cartCount > 0 && (

                            <span className="dot">

                                {cartCount}

                            </span>

                        )}

                    </Link>


                    {/* SIGN IN */}

                    <button
                        type="button"
                        className="signin-button"
                        onClick={() =>
                            setShowLogin(true)
                        }
                    >

                        Sign in

                    </button>


                    {/* HAMBURGER */}

                    <button
                        type="button"
                        className="hamburger"
                        aria-label="Open menu"
                        aria-expanded={
                            mobileMenu
                        }
                        onClick={() =>
                            setMobileMenu(
                                previous =>
                                    !previous
                            )
                        }
                    >

                        <span></span>
                        <span></span>
                        <span></span>

                    </button>

                </div>

            </nav>


            {/* =====================================
                SEARCH OVERLAY
            ===================================== */}

            {searchOpen && (

                <div
                    className="search-overlay"
                    onClick={closeSearch}
                >

                    <div
                        className="search-box"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <img
                            src={
                                assets.search_icon
                            }
                            alt=""
                        />


                        <input
                            type="text"
                            value={searchTerm}
                            onChange={
                                handleSearch
                            }
                            placeholder="Search food..."
                            autoFocus
                        />


                        {searchTerm && (

                            <button
                                type="button"
                                className="clear-search"
                                onClick={
                                    clearSearch
                                }
                                aria-label="Clear search"
                            >

                                ✕

                            </button>

                        )}


                        <button
                            type="button"
                            className="close-search"
                            onClick={
                                closeSearch
                            }
                            aria-label="Close search"
                        >

                            ✕

                        </button>

                    </div>

                </div>

            )}

        </>

    );

};


export default Navbar;