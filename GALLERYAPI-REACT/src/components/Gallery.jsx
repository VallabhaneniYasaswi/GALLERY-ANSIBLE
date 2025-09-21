import React, { useState, useEffect } from "react";
import { BASEURL, getSession } from "../api";
import "../css/Gallery.css";

const Gallery = () => {
  const token = getSession("csrid");
  const [artworks, setArtworks] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState("");
  const [profile, setProfile] = useState({ fullname: "" });

  useEffect(() => {
    if (!token) {
      window.location.replace("/");
      return;
    }

    // fetch profile
    fetch(`${BASEURL}artist/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      })
      .catch((err) => console.error("Error fetching profile:", err));

    // fetch artworks
    fetch(`${BASEURL}artist/artworks/all`, { method: "GET" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch artworks");
        const data = await res.json();

        // attach ratings
        const withRatings = await Promise.all(
          data.map(async (art) => {
            try {
              const res = await fetch(
                `${BASEURL}visitor/commerce/ratings/${art.id}`, // ✅ fixed endpoint
                { method: "GET" }
              );
              if (res.ok) {
                const ratings = await res.json();
                const avg =
                  ratings.length > 0
                    ? ratings.reduce((sum, r) => sum + r.stars, 0) /
                      ratings.length
                    : 0;
                return {
                  ...art,
                  averageRating: avg,
                  totalRatings: ratings.length,
                };
              }
              return { ...art, averageRating: 0, totalRatings: 0 };
            } catch {
              return { ...art, averageRating: 0, totalRatings: 0 };
            }
          })
        );

        setArtworks(withRatings);
        setFilteredArtworks(withRatings);
      })
      .catch((err) => {
        console.error(err);
        setMsg("Error fetching artworks");
      });
  }, [token]);

  // search filter effect
  useEffect(() => {
    if (!search.trim()) {
      setFilteredArtworks(artworks);
    } else {
      const lower = search.toLowerCase();
      const results = artworks.filter(
        (art) =>
          (art.artistName &&
            art.artistName.toLowerCase().includes(lower)) ||
          (art.title && art.title.toLowerCase().includes(lower))
      );
      setFilteredArtworks(results);
    }
  }, [search, artworks]);

  const addToCart = (artworkId) => {
    fetch(
      `${BASEURL}visitor/commerce/cart/add?artworkId=${artworkId}&quantity=1`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.text())
      .then((data) => alert(data))
      .catch((err) => console.error(err));
  };

  const addToWishlist = (artworkId) => {
    fetch(`${BASEURL}visitor/commerce/wishlist/add?artworkId=${artworkId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.text())
      .then((data) => alert(data))
      .catch((err) => console.error(err));
  };

  const rateArtwork = (artworkId) => {
    const stars = prompt("Enter rating (1-5):");
    const comment = prompt("Enter comment (optional):");
    if (!stars || stars < 1 || stars > 5) return alert("Invalid rating");

    fetch(
      `${BASEURL}visitor/commerce/rating?artworkId=${artworkId}&stars=${stars}&comment=${comment}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.text())
      .then((data) => {
        alert(data);
        window.location.reload(); // refresh to show updated ratings
      })
      .catch((err) => console.error(err));
  };

  const logout = () => {
    sessionStorage.clear();
    window.location.replace("/");
  };

  return (
    <div>
      {/* Navbar */}
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
            <span
              className="profile-link"
              onClick={() => window.location.replace("/visitor/artist-list")}
            >
              Artists
            </span>
            <span
              className="profile-link"
              onClick={() => window.location.replace("/visitor/gallery")}
            >
              Gallery
            </span>
            <span
              className="profile-link"
              onClick={() => window.location.replace("/visitor/wishlist")}
            >
              Wishlist
            </span>
            <span
              className="profile-link"
              onClick={() => window.location.replace("/visitor/cart")}
              style={{
                cursor: "pointer",
                marginLeft: "5px",
                fontWeight: "bold",
              }}
            >
              Cart
            </span>
            <span
              className="profile-link"
              onClick={() => window.location.replace("/visitor/orders")}
              style={{
                cursor: "pointer",
                marginLeft: "5px",
                fontWeight: "bold",
              }}
            >
              Orders
            </span>
            <span
              className="profile-link"
              onClick={() => window.location.replace("/visitor/profile")}
            >
              Profile
            </span>
            <span className="username">{profile.fullname}</span>
            <img
              className="logout-icon"
              src="/images/logout.png"
              alt="Logout"
              onClick={logout}
            />
          </div>
        </nav>
      </div>

      <div className="gallery-page">
        <h2>Gallery</h2>

        {/* Search Bar */}
        <input
          type="text"
          className="search-bar"
          placeholder="Search by artist or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {msg && <p className="msg">{msg}</p>}

        <div className="artwork-list">
          {filteredArtworks.length === 0 ? (
            <p>No artworks found.</p>
          ) : (
            filteredArtworks.map((art) => (
              <div key={art.id} className="artwork-card">
                {art.image && (
                  <img
                    src={`${BASEURL}uploads_artworks/${art.image}`}
                    alt={art.title}
                    className="artwork-image"
                  />
                )}
                <div className="artwork-info">
                  <h3>{art.title}</h3>
                  <p>Artist: {art.artistName}</p>
                  <p>Price: ${art.price}</p>
                  <p>{art.description}</p>

                  {/* Ratings */}
                  {art.totalRatings > 0 ? (
                    <p>
                      ⭐ {art.averageRating.toFixed(1)} / 5 (
                      {art.totalRatings} reviews)
                    </p>
                  ) : (
                    <p>No ratings yet</p>
                  )}

                  <button onClick={() => addToCart(art.id)}>Add to Cart</button>
                  <button onClick={() => addToWishlist(art.id)}>
                    Add to Wishlist
                  </button>
                  <button onClick={() => rateArtwork(art.id)}>Rate</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
