import React, { useState, useEffect } from "react";
import { BASEURL, getSession } from "../api";
import "../css/Wishlist.css";

const Wishlist = () => {
  const token = getSession("csrid");
  const [items, setItems] = useState([]);
  const [profile, setProfile] = useState({ fullname: "" });

  useEffect(() => {
    if (!token) {
      window.location.replace("/");
      return;
    }

    fetch(`${BASEURL}artist/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => { if (res.ok) setProfile(await res.json()); })
      .catch(err => console.error(err));

    fetch(`${BASEURL}visitor/commerce/wishlist`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => setItems(await res.json()))
      .catch(err => console.error(err));
  }, [token]);

  const removeFromWishlist = (artworkId) => {
    fetch(`${BASEURL}visitor/commerce/wishlist/remove?artworkId=${artworkId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.text())
      .then(data => {
        alert(data);
        setItems(items.filter(i => i.artworkId !== artworkId));
      });
  };

  const addToCart = (artworkId) => {
    fetch(`${BASEURL}visitor/commerce/cart/add?artworkId=${artworkId}&quantity=1`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.text())
      .then(data => alert(data));
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
            <span className="profile-link" onClick={() => window.location.replace("/visitor/profile")}>Profile</span>
            <span className="username">{profile.fullname}</span>
            <img className="logout-icon" src="/images/logout.png" alt="Logout" onClick={logout} />
          </div>
        </nav>
      </div>

      <div className="wishlist-page">
        <h2>My Wishlist</h2>
        {items.length === 0 ? <p>No items in wishlist.</p> : (
          <div className="artwork-list">
            {items.map(item => (
              <div key={item.artworkId} className="artwork-card">
                {item.artworkImage && <img src={`${BASEURL}uploads_artworks/${item.artworkImage}`} alt={item.artworkTitle} />}
                <div className="artwork-info">
                  <h3>{item.artworkTitle}</h3>
                  <p>Price: ${item.price}</p>
                  <button onClick={() => addToCart(item.artworkId)}>Add to Cart</button>
                  <button onClick={() => removeFromWishlist(item.artworkId)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
