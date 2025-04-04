import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Auth.css";

const SignUp = ({ closeModal, switchForm }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });
  const [loginData, setLoginData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isSignUp) {
      setFormData({ ...formData, [name]: value });
    } else {
      setLoginData({ ...loginData, [name]: value });
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.gender) {
      setError("Please select your gender.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/auth/register", formData);
      if (response.data.success) {
        setIsSignUp(false); // Switch to login after successful sign-up
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/auth/login", loginData);
      if (response.data.success) {
        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem("username", response.data.username);

        // Trigger navbar update
        window.dispatchEvent(new CustomEvent("userLogin", {
          detail: { username: response.data.username }
        }));

        closeModal();
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login error. Please try again.");
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="auth-box" onClick={(e) => e.stopPropagation()}>
        <span className="close-btn" onClick={closeModal}>&times;</span>

        {isSignUp ? (
          <form className="auth-form" onSubmit={handleSignUp}>
            <h2>Sign Up</h2>
            {error && <p className="error-message">{error}</p>}

            <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
            <input type="text" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />

            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <div className="password-container">
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
              <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="password-container">
              <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
              <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit">Sign Up</button>
            <p>
              Already have an account?{" "}
              <span className="link-text" onClick={() => setIsSignUp(false)}>
                Sign in
              </span>
            </p>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleLogin}>
            <h2>Sign In</h2>
            {error && <p className="error-message">{error}</p>}

            <input type="text" name="emailOrPhone" placeholder="Email or Mobile" value={loginData.emailOrPhone} onChange={handleChange} required />
            <div className="password-container">
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={loginData.password} onChange={handleChange} required />
              <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit">Sign In</button>
            <p>
              Don't have an account?{" "}
              <span className="link-text" onClick={() => setIsSignUp(true)}>
                Sign up
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
