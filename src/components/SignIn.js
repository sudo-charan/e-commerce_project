import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Auth.css";

const SignIn = ({ closeModal, switchForm }) => {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
    isAdmin: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    console.log("Login form data:", formData); // ✅ Debug

    try {
      const response = await axios.post("http://localhost:5000/auth/login", formData);

      if (response.data.success) {
        if (formData.isAdmin) {
          localStorage.setItem("adminToken", response.data.token);
          window.location.href = "/admin/dashboard";
        } else {
          localStorage.setItem("userToken", response.data.token);
          localStorage.setItem("username", response.data.username);

          window.dispatchEvent(new CustomEvent("userLogin", {
            detail: { username: response.data.username }
          }));

          closeModal();
        }
      } else {
        setError(response.data.message || "Invalid login credentials");
      }
    } catch (error) {
      console.error("Login Error:", error); // ✅ Debug
      setError(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="auth-box" onClick={(e) => e.stopPropagation()}>
        <span className="close-btn" onClick={closeModal}>&times;</span>
        <form className="auth-form" onSubmit={handleLogin}>
          <h2>{formData.isAdmin ? "Admin Login" : "User Login"}</h2>
          {error && <p className="error-message">{error}</p>}

          <input
            type="text"
            name="emailOrPhone"
            placeholder="Email or Mobile Number"
            value={formData.emailOrPhone}
            onChange={handleChange}
            required
          />

          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)} className="eye-icon">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <label className="admin-checkbox">
            <input
              type="checkbox"
              checked={formData.isAdmin}
              onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
            />
            Login as Admin
          </label>

          <button type="submit">Login</button>

          <p>
            New User? <span className="link-text" onClick={switchForm}>Create an account</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
