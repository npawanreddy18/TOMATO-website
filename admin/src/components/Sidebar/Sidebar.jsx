import "./Sidebar.css";

function Sidebar({ activePage, setActivePage, setIsLoggedIn }) {

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        setIsLoggedIn(false);
    };

    return (
        <aside className="sidebar">

            {/* LOGO */}
            <div className="sidebar-logo">
                <span>🍅</span>
                <h2>Tomato.</h2>
            </div>

            <p className="admin-label">
                TOMATO ADMIN
            </p>


            {/* MENU */}
            <div className="sidebar-menu">

                <button
                    className={activePage === "dashboard" ? "active" : ""}
                    onClick={() => setActivePage("dashboard")}
                >
                    <span>📊</span>
                    <label>Dashboard</label>
                </button>


                <button
                    className={activePage === "add" ? "active" : ""}
                    onClick={() => setActivePage("add")}
                >
                    <span>➕</span>
                    <label>Add Food</label>
                </button>


                <button
                    className={activePage === "list" ? "active" : ""}
                    onClick={() => setActivePage("list")}
                >
                    <span>🍔</span>
                    <label>Food List</label>
                </button>


                <button
                    className={activePage === "orders" ? "active" : ""}
                    onClick={() => setActivePage("orders")}
                >
                    <span>🛒</span>
                    <label>Orders</label>
                </button>


                <button
                    className={activePage === "customers" ? "active" : ""}
                    onClick={() => setActivePage("customers")}
                >
                    <span>👥</span>
                    <label>Customers</label>
                </button>


                <button
                    className={activePage === "analytics" ? "active" : ""}
                    onClick={() => setActivePage("analytics")}
                >
                    <span>📈</span>
                    <label>Analytics</label>
                </button>


                <button
                    className={activePage === "settings" ? "active" : ""}
                    onClick={() => setActivePage("settings")}
                >
                    <span>⚙️</span>
                    <label>Settings</label>
                </button>

            </div>


            {/* BOTTOM */}
            <div className="sidebar-bottom">

                <div className="admin-profile-box">

                    <div className="admin-avatar">
                        A
                    </div>

                    <div className="admin-profile-text">
                        <h4>Tomato Admin</h4>
                        <p>Administrator</p>
                    </div>

                </div>


                <button
                    className="logout-button"
                    onClick={() => {
                        localStorage.removeItem("adminToken");
                        localStorage.removeItem("admin");
                        window.location.reload();
                    }}
                >
                    <span>🚪</span>
                    <label>Logout</label>
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;