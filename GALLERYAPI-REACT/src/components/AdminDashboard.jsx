import React, { Component } from "react";
import "../css/AdminDashboard.css";
import { BASEURL, callApi, getSession, setSession } from "../api";

export default class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { fullname: "", users: [], msg: "" };
    this.showFullname = this.showFullname.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    const csr = getSession("csrid");
    if (!csr) {
      window.location.replace("/");
      return;
    }

    // Fetch admin fullname
    const data = JSON.stringify({ csrid: csr });
    callApi("POST", BASEURL + "users/getfullname", data, this.showFullname);

    // Fetch all users
    this.fetchUsers();

    // Prevent back navigation
    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", () => {
      window.history.pushState(null, null, window.location.href);
    });
  }

  showFullname(response) {
    this.setState({ fullname: response });
  }

  fetchUsers() {
    const token = getSession("csrid");
    fetch(`${BASEURL}admin/users`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => this.setState({ users: data || [] }))
      .catch((err) => this.setState({ msg: "Error fetching users" }));
  }

  deleteUser(email) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    const token = getSession("csrid");

    fetch(`${BASEURL}admin/users/${email}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.text())
      .then((data) => {
        this.setState({ msg: data });
        this.fetchUsers();
      })
      .catch((err) => this.setState({ msg: "Error deleting user" }));
  }

  updateRole(email) {
    const newRole = prompt("Enter new role (1=Artist, 2=Visitor, 3=Admin):");
    if (!newRole) return;

    const token = getSession("csrid");

    fetch(`${BASEURL}admin/users/${email}`, {
      method: "PUT",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ role: parseInt(newRole) }),
    })
      .then((res) => res.text())
      .then((data) => {
        this.setState({ msg: data });
        this.fetchUsers();
      })
      .catch((err) => this.setState({ msg: "Error updating role" }));
  }

  logout() {
    setSession("csrid", "", -1);
    setSession("role", "", -1);
    window.location.replace("/");
  }

  render() {
    const { fullname, users, msg } = this.state;

    return (
      <div className="dashboard">
        {/* Navbar */}
        <nav className="navbar">
          <img
            className="logo"
            src="./images/art-logo.jpg"
            alt="Logo"
            onClick={() => window.location.replace("/admin")}
            style={{ cursor: "pointer" }}
          />
          <div className="user-section">
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
          <h2>Admin Dashboard 👑</h2>
          <p>Manage all users, update roles, or delete accounts.</p>

          {msg && <div className="msg">{msg}</div>}

          <div className="admin-users">
            {users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              users.map((user) => (
                <div key={user.email} className="user-card">
                  <p><strong>Name:</strong> {user.fullname}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p>
                    <strong>Role:</strong>{" "}
                    {user.role === 1 ? "Admin" : user.role === 2 ? "Artist" : "Visitor"}
                  </p>
                  <div className="actions">
                    <button onClick={() => this.updateRole(user.email)}>✏️ Update Role</button>
                    <button onClick={() => this.deleteUser(user.email)} className="delete-btn">🗑️ Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }
}
