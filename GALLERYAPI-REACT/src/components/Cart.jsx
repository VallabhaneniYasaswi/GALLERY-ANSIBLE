import React, { useState, useEffect } from "react";
import { BASEURL, getSession } from "../api";
import "../css/Cart.css";

const Cart = () => {
  const token = getSession("csrid");
  const [cartItems, setCartItems] = useState([]);
  const [profile, setProfile] = useState({ fullname: "" });
  const [total, setTotal] = useState(0);

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

    fetchCartItems();
  }, [token]);

  const fetchCartItems = () => {
    fetch(`${BASEURL}visitor/commerce/cart`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const items = await res.json();
        setCartItems(items);
        let t = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotal(t);
      })
      .catch(err => console.error(err));
  };

  const updateQuantity = (artworkId, qty) => {
    qty = parseInt(qty); // ensure number
    fetch(`${BASEURL}visitor/commerce/cart/update?artworkId=${artworkId}&quantity=${qty}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.text())
      .then(() => fetchCartItems())
      .catch(err => console.error(err));
  };

  const removeFromCart = (artworkId) => {
  fetch(`${BASEURL}visitor/commerce/cart/remove?artworkId=${artworkId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(res => res.text())
    .then(() => fetchCartItems())
    .catch(err => console.error(err));
};

  const buyNow = () => {
    if (cartItems.length === 0) return alert("Cart is empty");
    
    fetch(`${BASEURL}visitor/commerce/checkout`, { // corrected endpoint
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.text())
      .then(data => {
        alert("Order placed successfully!");
        fetchCartItems(); // clear cart after buy
      })
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

      <div className="cart-page">
        <h2>My Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="cart-list">
            {cartItems.map(item => (
              <div key={item.artworkId} className="cart-card">
                {item.artworkImage && <img src={`${BASEURL}uploads_artworks/${item.artworkImage}`} alt={item.artworkTitle} />}
                <div className="cart-info">
                  <h3>{item.artworkTitle}</h3>
                  <p>Price: ${item.price}</p>
                  <p>
                    Quantity: 
                    <input 
                      type="number" 
                      value={item.quantity} 
                      min="1"
                      onChange={(e) => updateQuantity(item.artworkId, e.target.value)}
                      style={{width:"50px", marginLeft:"5px"}}
                    />
                  </p>
                  <button onClick={() => removeFromCart(item.artworkId)}>Remove</button>
                </div>
              </div>
            ))}
            <h3>Total: ${total.toFixed(2)}</h3>
            <button onClick={buyNow} className="buy-btn">Buy Now</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
