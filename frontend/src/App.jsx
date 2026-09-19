import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar/navbar";
import Home from "./pages/home/home";
import Cart from "./pages/cart/cart";
import PlaceOrder from "./pages/place-order/placeorder";
import MyOrders from "./pages/my-orders/MyOrders";

import LoginPopup from "./components/LoginPopup/LoginPopup";
import Footer from "./components/Footer/Footer";

const App = () => {

    const [showLogin, setShowLogin] = useState(false);

    return (
        <>
            {showLogin && (
                <LoginPopup
                    setShowLogin={setShowLogin}
                />
            )}

            <Navbar
                setShowLogin={setShowLogin}
            />

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/cart"
                    element={<Cart />}
                />

                <Route
                    path="/order"
                    element={<PlaceOrder />}
                />

                <Route
                    path="/my-orders"
                    element={<MyOrders />}
                />

            </Routes>

            <Footer />
        </>
    );
};

export default App;