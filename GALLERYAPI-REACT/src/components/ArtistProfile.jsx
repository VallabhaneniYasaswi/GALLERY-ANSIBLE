import React, { useEffect, useState } from "react";
import { BASEURL, getSession } from "../api";
import "../css/ArtistProfile.css";

const ArtistProfile = () => {
  // Profile state
  const [profile, setProfile] = useState({
    fullname: "",
    email: "",
    bio: "",
    gender: "",
    image: "",
  });

  // Form state
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [msg, setMsg] = useState("");

  const token = getSession("csrid");

  // Fetch profile on mount
  useEffect(() => {
    if (!token) {
      window.location.replace("/"); // redirect to login
      return;
    }

    fetch(`${BASEURL}artist/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setProfile({
            fullname: data.fullname || "",
            email: data.email || "",
            bio: data.bio || "",
            gender: data.gender || "",
            image: data.image || "",
          });
          setBio(data.bio || "");
          setGender(data.gender || "");
        }
      })
      .catch((err) => console.error(err));
  }, [token]);

  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files.length > 0) setImageFile(e.target.files[0]);
  };

  // Logout function
  const logout = () => {
    document.cookie = "csrid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.replace("/"); // redirect to login
  };

  // Update profile
  const handleUpdate = () => {
    if (!token) return;

    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("gender", gender);
    if (imageFile) formData.append("image", imageFile);

    fetch(`${BASEURL}artist/profile`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
      .then((res) => res.text())
      .then((data) => {
        setMsg(data);

        // Refresh profile after update
        fetch(`${BASEURL}artist/profile`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((updated) => {
            if (updated) {
              setProfile({
                fullname: updated.fullname || "",
                email: updated.email || "",
                bio: updated.bio || "",
                gender: updated.gender || "",
                image: updated.image || "",
              });
            }
          });
      })
      .catch((err) => setMsg("Error: " + err.message));
  };

  // Delete profile
  const handleDelete = () => {
    if (!token) return;

    fetch(`${BASEURL}artist/profile`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.text())
      .then((data) => {
        setMsg(data);
        setProfile({ fullname: "", email: "", bio: "", gender: "", image: "" });
      })
      .catch((err) => setMsg("Error: " + err.message));
  };

  return (
    <div className="artist-profile-page">
      {/* Navbar */}
      <div className="dashboard">
        <nav className="navbar">
          <img
  className="logo"
  src="/images/art-logo.jpg"
  alt="Logo"
  style={{ cursor: "pointer" }}
  onClick={() => window.location.replace("/artist")}
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
              style={{ cursor: "pointer", marginLeft: "15px", fontWeight: "bold", marginRight:"5px" }}
            >
             👤 Profile
            </span>
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

      {/* Profile section */}
      <div className="artist-profile">
        <h2>Artist Profile</h2>

        {/* Profile image/logo at top */}
        {profile.image && (
          <div className="profile-logo">
            <img
              src={`${BASEURL}uploads_dir/${profile.image}`}
              alt="Artist Logo"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </div>
        )}

        <p>
          <strong>Full Name:</strong> {profile.fullname}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>

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
        <button
          onClick={handleDelete}
          style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}
        >
          Delete Profile
        </button>

        {msg && <p>{msg}</p>}
      </div>
    </div>
  );
};

export default ArtistProfile;
