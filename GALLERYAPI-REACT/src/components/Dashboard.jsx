import React, { Component } from 'react';
import '../css/Dashboard.css';
import { BASEURL, callApi, getSession, setSession } from '../api';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { fullname: '' };
    this.showFullname = this.showFullname.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    const csr = getSession("csrid");

    if (!csr) {
      window.location.replace("/"); // redirect to login
      return;
    }

    const data = JSON.stringify({ csrid: csr });
    callApi("POST", BASEURL + "users/getfullname", data, this.showFullname);

    // Prevent going back to login page
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
          <img
            className="logo"
            src="./images/art-logo.jpg"
            alt="Logo"
            onClick={() => window.location.replace("/artist")}
            style={{ cursor: "pointer" }}
          />

          <div className="user-section">
            <span
              className="profile-link"
              onClick={() => window.location.replace("/artist/artworks")}
              style={{ cursor: "pointer", marginLeft: "5px", fontWeight: "bold" }}
            >
              🎨 My Artworks
            </span>

            <span
              className="profile-link"
              onClick={() => window.location.replace("/artist/profile")}
              style={{ cursor: "pointer", marginLeft: "15px", fontWeight: "bold" }}
            >
              👤 Profile
            </span>

            <span className="username">{fullname}</span>

            <img
              className="logout-icon"
              src="./images/logout.png"
              alt="Logout"
              onClick={this.logout}
            />
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          <h2>Welcome, {fullname}! 🌟</h2>
          <p>
            This is your <strong>Artist Dashboard</strong> for the Gallery App. 
            Here you can manage your artworks, track sales, and update your profile.
          </p>

          <div className="artist-dashboard">
            <div
              className="card"
              onClick={() => window.location.replace("/artist/artworks")}
              style={{ cursor: "pointer" }}
            >
              <h3>🎨 Manage Artworks</h3>
              <p>Upload, edit, and showcase your creative portfolio to the world.</p>
            </div>


            <div
              className="card"
              onClick={() => window.location.replace("/artist/profile")}
              style={{ cursor: "pointer" }}
            >
              <h3>👤 Profile Settings</h3>
              <p>Update your bio, profile image, and personal information.</p>
            </div>

            
          </div>

          <p style={{ marginTop: "20px", fontStyle: "italic", color: "#555" }}>
            Tip: Click on the cards above to quickly access different sections of your dashboard! 🚀
          </p>
        </div>
      </div>
    );
  }
}
