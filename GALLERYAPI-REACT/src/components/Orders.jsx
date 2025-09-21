import React, { useState, useEffect } from "react";
import { BASEURL, getSession } from "../api";
import "../css/Cart.css"; // you can reuse Cart.css for styling

const Orders = () => {
  const token = getSession("csrid");
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState({ fullname: "" });

  useEffect(() => {
    if (!token) {
      window.location.replace("/");
      return;
    }

    // fetch profile for navbar
    fetch(`${BASEURL}artist/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => { if (res.ok) setProfile(await res.json()); })
      .catch(err => console.error(err));

    fetchOrders();
  }, [token]);

  const fetchOrders = () => {
    fetch(`${BASEURL}visitor/commerce/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));
  };

  const logout = () => {
    sessionStorage.clear();
    window.location.replace("/");
  };

  return (
    <div>
      <div className="dashboard">
        <nav className="navbar">
          <img
  className="logo"
  src="/images/art-logo.jpg"
  alt="Logo"
  style={{ cursor: "pointer" }}
  onClick={() => window.location.replace("/visitor")}
/>

          <div className="user-section">
            <span className="profile-link" onClick={() => window.location.replace("/visitor/artist-list")}>Artists</span>
            <span className="profile-link" onClick={() => window.location.replace("/visitor/gallery")}>Gallery</span>
            <span className="profile-link" onClick={() => window.location.replace("/visitor/wishlist")}>Wishlist</span>
            <span className="profile-link" onClick={() => window.location.replace("/visitor/cart")}>Cart</span>
            <span
              className="profile-link"
              onClick={() => window.location.replace("/visitor/orders")}
              style={{ cursor: "pointer", marginLeft: "5px", fontWeight: "bold" }}
            >
              Orders
            </span>
            <span className="profile-link" onClick={() => window.location.replace("/visitor/profile")}>Profile</span>
            <span className="username">{profile.fullname}</span>
            <img className="logout-icon" src="/images/logout.png" alt="Logout" onClick={logout} />
          </div>
        </nav>
      </div>

      <div className="cart-page">
        <h2>My Orders</h2>
        {orders.length === 0 ? (
          <p>No orders placed yet.</p>
        ) : (
          <div className="cart-list">
            {orders.map(order => (
              <div key={order.id} className="cart-card">
                <div className="cart-info">
                  <h3>Order #{order.id}</h3>
                  <p>Status: {order.status}</p>
                  <p>Total: ${order.totalAmount.toFixed(2)}</p>
                  <p>Items:</p>
                  <ul>
                    {order.items.map(item => (
                      <li key={item.id}>
                        {item.artworkTitle} x {item.quantity} - ${item.price}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
