import React, { useState } from "react";
import { BASEURL, callApi, setSession } from "../api";
import "../css/GalleryHomepage.css";

const GalleryHomepage = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [isSignin, setIsSignin] = useState(true);
  const [signinData, setSigninData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    fullname: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [responseMsg, setResponseMsg] = useState("");

  // Open signin popup
  const openSignin = () => {
    setIsSignin(true);
    setPopupOpen(true);
    setSigninData({ email: "", password: "" });
    setResponseMsg("");
  };

  // Open signup popup
  const openSignup = () => {
    setIsSignin(false);
    setPopupOpen(true);
    setSignupData({ fullname: "", email: "", role: "", password: "", confirmPassword: "" });
    setResponseMsg("");
  };

  // Close popup when clicking outside
  const closePopup = (e) => {
    if (e.target.id === "popup") setPopupOpen(false);
  };

  // Input handlers
  const handleSigninChange = (e) =>
    setSigninData({ ...signinData, [e.target.id]: e.target.value });
  const handleSignupChange = (e) => {
    const { id, value } = e.target;
    setSignupData({ ...signupData, [id]: value });
  };

  // Signin API
  const handleSignin = () => {
    const { email, password } = signinData;
    if (!email || !password) return setResponseMsg("Enter email and password");

    // callApi("POST", `${BASEURL}users/signin`, JSON.stringify({ email, password }), (res) => {
    //   const [status, msg] = res.split("::");
    //   if (status === "200") {
    //     setSession("csrid", msg, 1);
    //     window.location.replace("/dashboard");
    //   } else setResponseMsg(msg);
    // });
    callApi("POST", `${BASEURL}users/signin`, JSON.stringify({ email, password }), (res) => {
  const [status, token, roleStr] = res.split("::");
  const role = parseInt(roleStr, 10); // parse role as int
  if (status === "200") {
    setSession("csrid", token, 1);
    setSession("role", role, 1);

    if (role === 1) window.location.replace("/admin"); //admin
    else if (role === 2) window.location.replace("/artist");  // artist
    else if (role === 3) window.location.replace("/visitor"); // visitor
    else alert("Unknown role");
  } else {
    setResponseMsg(token); // show error message
  }
});


  };

  // Signup API
  const handleSignup = () => {
    const { fullname, email, role, password, confirmPassword } = signupData;
    if (!fullname || !email || !role || !password || !confirmPassword)
      return setResponseMsg("Fill all fields");
    if (password !== confirmPassword) return setResponseMsg("Passwords do not match");

    callApi("POST", `${BASEURL}users/signup`, JSON.stringify({ fullname, email, role, password }), (res) => {
      const [status, msg] = res.split("::");
      setResponseMsg(msg);
      if (status === "200") openSignin();
    });
  };

  // Forgot Password API
  const handleForgotPassword = () => {
    if (!signinData.email) return setResponseMsg("Enter your email for password recovery");
    callApi(
      "GET",
      `${BASEURL}users/forgotpassword/${signinData.email}`,
      "",
      (res) => {
        const [status, msg] = res.split("::");
        setResponseMsg(msg);
      }
    );
  };

  return (
    <div className="base">
      {popupOpen && (
        <div id="popup" className="popupOverlay" onClick={closePopup}>
          <div className="popupWindow">
            <div id="popupHeader">{isSignin ? "Login" : "Sign Up"}</div>

            {isSignin ? (
              <div id="signin">
                <label>Email:</label>
                <input id="email" value={signinData.email} onChange={handleSigninChange} />
                <label>Password:</label>
                <input type="password" id="password" value={signinData.password} onChange={handleSigninChange} />
                <div className="forgotPassword">
                  Forgot <span onClick={handleForgotPassword}>Password?</span>
                </div>
                <button onClick={handleSignin}>Sign In</button>
                <div className="responseMsg">{responseMsg}</div>
                <div>
                  Don't have an account? <span className="link" onClick={openSignup}>SIGNUP NOW</span>
                </div>
              </div>
            ) : (
              <div id="signup">
                <label>Full Name:</label>
                <input id="fullname" value={signupData.fullname} onChange={handleSignupChange} />
                <label>Email:</label>
                <input id="email" value={signupData.email} onChange={handleSignupChange} />
                <label>Role:</label>
                <select id="role" value={signupData.role} onChange={handleSignupChange}>
                  <option value="">Select Role</option>
                  <option value="1">Admin</option>
                  <option value="2">Artist</option>
                  <option value="3">Visitor/Customer</option>
                </select>
                <label>Password:</label>
                <input type="password" id="password" value={signupData.password} onChange={handleSignupChange} />
                <label>Confirm Password:</label>
                <input type="password" id="confirmPassword" value={signupData.confirmPassword} onChange={handleSignupChange} />
                <button onClick={handleSignup}>Register Now</button>
                <div>
                  Already have an account? <span className="link" onClick={openSignin}>SIGN IN</span>
                </div>
                <div className="responseMsg">{responseMsg}</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="header">
        <img className="logo" src="/images/art-logo.jpg" alt="Art Logo" />
        <div className="title">Online Art Gallery</div>
        <div className="signContainer" onClick={openSignin}>
          <img className="sign" src="/images/user.png" alt="Sign" />
          <span className="signText">Sign-In</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container">
        <div className="text1">Welcome to the World of Art</div>
        <div className="text2">Discover, Collect & Showcase Masterpieces</div>
        <div className="text3">Your virtual gallery experience starts here</div>
      </div>

      {/* Placeholder for Art Display */}
      <section className="art-display-section">
        <h2>Featured Artworks</h2>
        <div className="artwork-grid">
          {/* You'd map over an array of art pieces here */}
          <div className="artwork-card">
            <img src="/images/artwork1.jpeg" alt="Artwork 1" />
            <h3>Artwork Title 1</h3>
            <p>Artist Name</p>
          </div>
          <div className="artwork-card">
            <img src="/images/artwork2.webp" alt="Artwork 2" />
            <h3>Artwork Title 2</h3>
            <p>Artist Name</p>
          </div>
          <div className="artwork-card">
            <img src="/images/artwork3.jpg" alt="Artwork 3" />
            <h3>Artwork Title 3</h3>
            <p>Artist Name</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default GalleryHomepage;
