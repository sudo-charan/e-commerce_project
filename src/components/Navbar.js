import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaChevronDown,
  FaSignInAlt,
  FaUserPlus,
  FaHeart,
  FaBox,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import "../styles/Navbar.css";

const Navbar = ({ setSelectedCategory }) => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [dropdownClicked, setDropdownClicked] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const storedUsername = localStorage.getItem("username");
    if (token) {
      setIsAuthenticated(true);
      setUsername(storedUsername || "User");
    }

    const handleUserLogin = (e) => {
      setIsAuthenticated(true);
      setUsername(e.detail.username);
    };

    window.addEventListener("userLogin", handleUserLogin);
    return () => window.removeEventListener("userLogin", handleUserLogin);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setDropdownClicked(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownClick = () => {
    setDropdownOpen((prev) => !prev);
    setDropdownClicked(true);
  };

  const handleMouseEnter = () => {
    if (!dropdownClicked) setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    if (!dropdownClicked) setDropdownOpen(false);
  };

  const switchForm = () => {
    setShowSignIn(!showSignIn);
    setShowSignUp(!showSignUp);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    setUsername("");
  };

  const handleLogoClick = () => {
    setSelectedCategory(null); // reset category if needed
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <span className="logo-link" onClick={handleLogoClick}>
            <span className="logo">Nittekart</span>
          </span>
        </div>

        <div className="search-box">
          <input type="text" placeholder="Search for products..." />
          <button className="search-icon">
            <FaSearch />
          </button>
        </div>

        <div className="navbar-right">
          <div
            className="profile-dropdown"
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="profile-button" onClick={handleDropdownClick}>
              <FaUser /> {isAuthenticated ? username : "More"} <FaChevronDown />
            </button>

            <div
              className={`dropdown-content ${dropdownOpen ? "dropdown-open" : ""}`}
            >
              {!isAuthenticated ? (
                <>
                  <button onClick={() => setShowSignIn(true)}>
                    <FaSignInAlt /> Sign In
                  </button>
                  <button onClick={() => setShowSignUp(true)}>
                    <FaUserPlus /> Sign Up
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      const userId = localStorage.getItem("userId");
                      if (!userId) {
                        alert("User not logged in. Please sign in first.");
                        return;
                      }
                      window.dispatchEvent(
                        new CustomEvent("openProfileModal", {
                          detail: { userId },
                        })
                      );
                    }}
                  >
                    <FaUserCircle /> Profile
                  </button>
                  <Link to="/orders">
                    <FaBox /> Orders
                  </Link>
                  <Link to="/wishlist">
                    <FaHeart /> Wishlist
                  </Link>
                  <button onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </>
              )}
            </div>
          </div>

          <Link to="/cart" className="cartlink">
            <div className="cart-button">
              <FaShoppingCart className="cart-icon" /> Cart
            </div>
          </Link>
        </div>
      </nav>

      {showSignIn && (
        <SignIn closeModal={() => setShowSignIn(false)} switchForm={switchForm} />
      )}
      {showSignUp && (
        <SignUp closeModal={() => setShowSignUp(false)} switchForm={switchForm} />
      )}
    </>
  );
};

export default Navbar;
