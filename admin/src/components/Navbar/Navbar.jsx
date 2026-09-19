import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <h2>Tomato Admin</h2>
      </div>

      <div className="navbar-right">
        <span className="notification">🔔</span>

        <div className="admin-profile">
          <div className="profile-icon">A</div>

          <div className="profile-info">
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;