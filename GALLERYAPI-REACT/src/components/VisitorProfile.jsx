import React, { useEffect, useState } from "react";
import { BASEURL, getSession } from "../api";
import "../css/VisitorProfile.css";

const VisitorProfile = () => {
  const [profile, setProfile] = useState({
    fullname: "",
    email: "",
    bio: "",
    gender: "",
    image: "",
  });

  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [msg, setMsg] = useState("");

  const token = getSession("csrid");

  useEffect(() => {
    if (!token) window.location.replace("/");

    fetch(`${BASEURL}visitor/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setProfile(data);
          setBio(data.bio || "");
          setGender(data.gender || "");
        }
      })
      .catch(err => console.error(err));
  }, [token]);

  const handleImageChange = e => {
    if (e.target.files.length > 0) setImageFile(e.target.files[0]);
  };

  const handleUpdate = () => {
    if (!token) return;

    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("gender", gender);
    if (imageFile) formData.append("image", imageFile);

    fetch(`${BASEURL}visitor/profile`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
      .then(res => res.text())
      .then(data => {
        setMsg(data);
        // Refresh profile
        fetch(`${BASEURL}visitor/profile`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => res.json())
          .then(updated => {
            if (updated) setProfile(updated);
          });
      })
      .catch(err => setMsg("Error: " + err.message));
  };

  const handleDelete = () => {
    if (!token) return;

    fetch(`${BASEURL}visitor/profile`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.text())
      .then(data => {
        setMsg(data);
        setProfile({ fullname: "", email: "", bio: "", gender: "", image: "" });
      })
      .catch(err => setMsg("Error: " + err.message));
  };

  const logout = () => {
    sessionStorage.clear();
    window.location.replace("/");
  };

  return (
    <div className="visitor-profile-page">
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

      <div className="profile-container">
        <h2>Visitor Profile</h2>

        {profile.image && (
          <img
            src={`${BASEURL}uploads_visitors/${profile.image}`}
            alt="Profile"
            className="profile-image"
          />
        )}

        <p><strong>Name:</strong> {profile.fullname}</p>
        <p><strong>Email:</strong> {profile.email}</p>

        <div>
          <label>Bio:</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>

        <div>
          <label>Gender:</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label>Update Profile Image:</label>
          <input type="file" onChange={handleImageChange} />
        </div>

        <button onClick={handleUpdate}>Update Profile</button>
        <button onClick={handleDelete} style={{ marginLeft: 10, backgroundColor: "red", color: "white" }}>
          Delete Profile
        </button>

        {msg && <p>{msg}</p>}
      </div>
    </div>
  );
};

export default VisitorProfile;
