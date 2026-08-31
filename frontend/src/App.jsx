import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar/navbar";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";

import Home from "./pages/home/home";
import Cart from "./pages/cart/cart";
import PlaceOrder from "./pages/placeorder/placeorder";

import "./App.css";

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

            <main className="app-content">
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
                        path="*"
                        element={<Home />}
                    />

                </Routes>
            </main>

            <Footer />
        </>
    );
};

export default App;