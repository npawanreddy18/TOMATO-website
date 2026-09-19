import React, { useState } from "react";

import Login from "./pages/Login/Login";
import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";

import Dashboard from "./pages/Dashboard/Dashboard";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import Customers from "./pages/Customers/Customers";
import Analytics from "./pages/Analytics/Analytics";
import Settings from "./pages/Settings/Settings";

import "./App.css";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem("adminToken")
    );

    const [activePage, setActivePage] = useState("dashboard");

    if (!isLoggedIn) {
        return (
            <Login
                setIsLoggedIn={setIsLoggedIn}
            />
        );
    }

    const renderPage = () => {
        switch (activePage) {
            case "dashboard":
                return <Dashboard />;

            case "add":
                return <Add />;

            case "list":
                return <List />;

            case "orders":
                return <Orders />;

            case "customers":
                return <Customers />;

            case "analytics":
                return <Analytics />;

            case "settings":
                return <Settings />;

            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="admin-app">

            <Sidebar
                activePage={activePage}
                setActivePage={setActivePage}
                setIsLoggedIn={setIsLoggedIn}
            />

            <main className="admin-main">

                <Navbar />

                <div className="admin-content">
                    {renderPage()}
                </div>

            </main>

        </div>
    );
}

export default App;