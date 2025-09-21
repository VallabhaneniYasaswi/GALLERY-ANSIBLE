import React, { Component } from 'react';
import '../css/VisitorDashboard.css';
import { BASEURL, callApi, getSession, setSession } from '../api';

export default class VisitorDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { fullname: '' };
    this.showFullname = this.showFullname.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    const csr = getSession("csrid");

    if (!csr) {
      window.location.replace("/");
      return;
    }

    const data = JSON.stringify({ csrid: csr });
    callApi("POST", BASEURL + "users/getfullname", data, this.showFullname);

    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", () => {
      window.history.pushState(null, null, window.location.href);
    });
  }

  showFullname(response) {
    this.setState({ fullname: response });
  }

  logout() {
    setSession("csrid", "", -1);
    setSession("role", "", -1);
    window.location.replace("/");
    window.location.reload(false);
  }

  render() {
    const { fullname } = this.state;

    return (
      <div className="dashboard">
        {/* Navbar */}
        <nav className="navbar">
          <img className="logo" src="./images/art-logo.jpg" alt="Logo" />

          <div className="user-section">
              <>
                <span
                  className="profile-link"
                  onClick={() => window.location.replace("/visitor/artist-list")}
                  style={{ cursor: "pointer", marginLeft: "5px", fontWeight: "bold" }}
                >
                  Artists
                </span>

              </>

              <>
                <span
                  className="profile-link"
                  onClick={() => window.location.replace("/visitor/gallery")}
                  style={{ cursor: "pointer", marginLeft: "5px", fontWeight: "bold" }}
                >
                  Gallery
                </span>
                <span
                  className="profile-link"
                  onClick={() => window.location.replace("/visitor/wishlist")}
                  style={{ cursor: "pointer", marginLeft: "15px", fontWeight: "bold" }}
                >
                  Wishlist
                </span>
                <span
                  className="profile-link"
                  onClick={() => window.location.replace("/visitor/cart")}
                  style={{ cursor: "pointer", marginLeft: "5px", fontWeight: "bold" }}
                >
                  Cart
                </span>
                <span
                  className="profile-link"
                  onClick={() => window.location.replace("/visitor/orders")}
                  style={{ cursor: "pointer", marginLeft: "5px", fontWeight: "bold" }}
                >
                  orders
                </span>
                <span
                  className="profile-link"
                  onClick={() => window.location.replace("/visitor/profile")}
                  style={{ cursor: "pointer", marginLeft: "15px", fontWeight: "bold", marginRight: "5px" }}
                >
                  Profile
                </span>
              </>

            <span className="username">{fullname}</span>

            <img
              className="logout-icon"
              src="./images/logout.png"
              alt="Logout"
              onClick={this.logout}
            />
          </div>
        </nav>

          <div className="dashboard-content">
            <h2>Welcome, {fullname}!</h2>
            <p>This is your <strong>Visitor Dashboard</strong> for the Gallery App.</p>

            <div className="visitor-dashboard">
  <div
    className="card"
    style={{ cursor: "pointer" }}
    onClick={() => window.location.replace("/visitor/gallery")}
  >
    <h3>✨ Explore Artworks</h3>
    <p>Browse through a wide collection of artworks by various artists.</p>
  </div>

  <div
    className="card"
    style={{ cursor: "pointer" }}
    onClick={() => window.location.replace("/visitor/wishlist")}
  >
    <h3>❤️ My Wishlist</h3>
    <p>Save your favorite artworks and plan your next purchase.</p>
  </div>

  <div
    className="card"
    style={{ cursor: "pointer" }}
    onClick={() => window.location.replace("/visitor/orders")}
  >
    <h3>🛒 My Purchases</h3>
    <p>View your past purchases and order details.</p>
  </div>
</div>

          </div>

      </div>
    );
  }
}
