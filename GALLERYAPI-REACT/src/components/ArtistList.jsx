import React, { useState, useEffect } from "react";
import { BASEURL, getSession } from "../api";
import "../css/ArtistList.css"; // make sure this CSS exists

const ArtistList = () => {
  const token = getSession("csrid");
  const [artists, setArtists] = useState([]);
  const [msg, setMsg] = useState("");
  const [profile, setProfile] = useState({ fullname: "" }); // added for navbar

  useEffect(() => {
    if (!token) {
      window.location.replace("/"); // redirect to login if not logged in
      return;
    }

    // fetch profile for navbar
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

    // fetch artists
    fetch(`${BASEURL}visitor/artists`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch artists");
        const data = await res.json();
        setArtists(data);
      })
      .catch((err) => {
        console.error("Error fetching artists:", err);
        setMsg("Error fetching artists");
      });
  }, [token]);

  // logout handler
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
            <span className="username">{profile.fullname}</span>

            {/* Logout icon */}
            <img
              className="logout-icon"
              src="/images/logout.png"
              alt="Logout"
              onClick={logout}
            />
          </div>
        </nav>
      </div>

      {/* Artists section */}
      <div className="artist-list-page">
        <h2>All Artists</h2>
        {msg && <p className="msg">{msg}</p>}

        <div className="artist-list">
          {artists.length === 0 ? (
            <p>No artists found.</p>
          ) : (
            artists.map((artist) => (
              <div key={artist.email} className="artist-card">
                {artist.image && (
                  <img
                    src={`${BASEURL}uploads_dir/${artist.image}`}
                    alt={artist.fullname}
                    className="artist-image"
                  />
                )}
                <div className="artist-info">
                  <h3>{artist.fullname}</h3>
                  <p>Email: {artist.email}</p>
                  <p>Bio: {artist.bio || "No bio available"}</p>
                  <p>Gender: {artist.gender || "Not specified"}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistList;
