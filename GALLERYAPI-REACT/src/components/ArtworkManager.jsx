import React, { useState, useEffect } from "react";
import '../css/ArtworkManager.css';
import { BASEURL, getSession } from "../api";

const ArtworkManager = () => {
  const token = getSession("csrid");

  const [artworks, setArtworks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [artistName, setArtistName] = useState(""); // <-- fetch full name

  // Fetch artist profile
  useEffect(() => {
    if (!token) return;

    fetch(`${BASEURL}artist/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setArtistName(data.fullname || ""))
      .catch(err => console.error(err));
  }, [token]);

  const fetchArtworks = () => {
    fetch(`${BASEURL}artist/artworks/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        const text = await res.text();
        try {
          const data = text ? JSON.parse(text) : [];
          setArtworks(data);
        } catch {
          setArtworks([]);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchArtworks(); }, []);

  const resetForm = () => {
    setTitle(""); setDescription(""); setPrice(""); setImageFile(null); setEditingId(null);
    document.getElementById("imageUpload").value = "";
  };

  const handleImageChange = e => { setImageFile(e.target.files[0]); };

  const handleSubmit = () => {
    if(!title || !description || !price) {
      setMsg("Please fill all fields!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    if(imageFile) formData.append("image", imageFile);

    const url = editingId ? `${BASEURL}artist/artworks/update/${editingId}` : `${BASEURL}artist/artworks/add`;
    const method = editingId ? "POST" : "POST"; // backend uses POST for update

    fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })
      .then(res => res.text())
      .then(data => {
        setMsg(data);
        resetForm();
        fetchArtworks();
      })
      .catch(err => {
        setMsg("Error saving artwork.");
        console.error(err);
      });
  };

  const handleDelete = id => {
    if(!window.confirm("Are you sure you want to delete this artwork?")) return;

    fetch(`${BASEURL}artist/artworks/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.text())
      .then(data => {
        setMsg(data);
        fetchArtworks();
      })
      .catch(err => {
        setMsg("Error deleting artwork.");
        console.error(err);
      });
  };

  const handleEdit = art => {
    setEditingId(art.id);
    setTitle(art.title);
    setDescription(art.description);
    setPrice(art.price);
  };

  const logout = () => {
    document.cookie = "csrid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
            style={{ cursor: "pointer", marginLeft: "15px", fontWeight: "bold", marginRight: "5px" }}
          >
           👤 Profile
          </span>

          <span className="username">{artistName}</span>

          <img
            className="logout-icon"
            src="/images/logout.png"
            alt="Logout"
            onClick={logout}
            style={{ cursor: "pointer", marginLeft: "10px" }}
          />
        </div>
      </nav>
        </div>
    <div className="artwork-manager">
      {/* Navbar */}

      <h2>My Artworks</h2>

      <div className="add-artwork-form">
        <div>
          <label>Title</label>
          <input type="text" placeholder="Artwork Title" value={title} onChange={e=>setTitle(e.target.value)} />
        </div>
        <div>
          <label>Description</label>
          <input type="text" placeholder="Artwork Description" value={description} onChange={e=>setDescription(e.target.value)} />
        </div>
        <div>
          <label>Price ($)</label>
          <input type="number" placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)} />
        </div>
        <div>
          <label>Image</label>
          <input id="imageUpload" type="file" onChange={handleImageChange} />
        </div>
        <button onClick={handleSubmit}>{editingId ? "Update Artwork" : "Add Artwork"}</button>
        {editingId && <button onClick={resetForm} style={{marginLeft:"10px", backgroundColor:"gray"}}>Cancel</button>}
      </div>

      {msg && <p className="msg">{msg}</p>}

      <div className="artworks-list">
        {artworks.map(a => (
          <div key={a.id} className="artwork-card">
            {a.image && <img src={`${BASEURL}uploads_artworks/${a.image}`} alt={a.title} />}
            <div className="info-section">
              <h3>{a.title}</h3>
              <p>{a.description}</p>
              <p className="price">Price: ${parseFloat(a.price).toFixed(2)}</p>
            </div>
            <div className="card-buttons">
              <button onClick={()=>handleEdit(a)}>Edit</button>
              <button onClick={()=>handleDelete(a.id)} style={{backgroundColor:"red", color:"white"}}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default ArtworkManager;
