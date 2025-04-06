import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Profile.css";

const Profile = ({ onClose }) => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [editMode, setEditMode] = useState(false);

  const userId = localStorage.getItem("userId");
  console.log("User ID from localStorage:", userId); // ✅ DEBUG LOG

  useEffect(() => {
    if (!userId) {
      alert("User not logged in.");
      return;
    }

    axios
      .get(`http://localhost:5000/api/profile/${userId}`)
      .then((res) => {
        console.log("Profile fetched from backend:", res.data); // ✅ DEBUG LOG
        if (res.data) {
          setProfile(res.data);
        } else {
          alert("Profile not found.");
        }
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        alert("Failed to load profile.");
      });
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    axios
      .put(`http://localhost:5000/api/profile/${userId}`, profile)
      .then(() => {
        alert("Profile updated successfully.");
        setEditMode(false);
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        alert("Failed to update profile.");
      });
  };

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        <div className="profile-header">
          <img src="/assets/user_demo.jpg" alt="User" className="profile-img" />
        </div>

        <div className="profile-form">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            disabled={!editMode}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            disabled
          />

          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            disabled={!editMode}
          />

          <label>Address</label>
          <textarea
            name="address"
            rows="3"
            value={profile.address}
            onChange={handleChange}
            disabled={!editMode}
          />

          {!editMode ? (
            <button className="update-btn" onClick={() => setEditMode(true)}>
              Update
            </button>
          ) : (
            <button className="save-btn" onClick={handleSave}>
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
