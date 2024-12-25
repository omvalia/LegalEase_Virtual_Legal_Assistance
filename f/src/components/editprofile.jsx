import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import WorkspaceNavigation from "./workspace_naviagtion";

function EditProfile() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const [formData, setFormData] = useState({
    username: username,
    name: "",
    email: "",
    password: "",
    address: "",
    licenseNumber: "",
    field: "",
  });

  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    // Fetch user data on load
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/profile/${username}`
        );
        const data = await response.json();
        if (response.ok) {
          setFormData({
            username: data.username,
            name: data.name,
            email: data.email, // Ensure email is populated
            password: data.password, // Ensure password is populated
            address: data.address,
            licenseNumber: data.licenseNumber,
            field: data.field, // Ensure field is populated
          });
        } else {
          setMessage(data.error);
        }
      } catch (error) {
        setMessage("Error loading profile data.");
      }
    };
    fetchUserData();
  }, [username]);

  const validateForm = () => {
    const { username, name, password, address, licenseNumber, field } =
      formData;

    if (username.length < 4) {
      setValidationError("Username must be at least 4 characters long.");
      return false;
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name) || name.length < 3) {
      setValidationError(
        "Name must be at least 3 characters and contain only letters."
      );
      return false;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (password && !passwordRegex.test(password)) {
      setValidationError(
        "Password must contain at least 6 characters, with letters and numbers."
      );
      return false;
    }

    if (address.length < 5) {
      setValidationError("Address must be at least 5 characters long.");
      return false;
    }

    const licenseRegex = /^[A-Za-z0-9]{8}$/;
    if (!licenseRegex.test(licenseNumber)) {
      setValidationError(
        "License Number must be exactly 8 alphanumeric characters."
      );
      return false;
    }

    if (!field) {
      setValidationError("Please select a field.");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return;

    try {
      const response = await fetch(
        `http://localhost:5000/editProfile/${username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Profile updated successfully!");
        // setTimeout(() => navigate("/profile"), 2000);
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      setMessage("An error occurred during profile update.");
    }
  };

  const handleBackClick = () => {
    navigate("/profile");
  };

  return (
    <>
      <Navbar />
      <div className="sidebar">
        <WorkspaceNavigation />
      </div>
      <div className="add-client-container">
        <form onSubmit={handleSubmit} className="add-client-card">
          <h2 className="add-client-form-title">Edit Profile</h2>
  
          {validationError && (
            <p className="error-message">{validationError}</p>
          )}
          {message && <p className="error-message">{message}</p>}
  
          <div className="add-client-form-row">
            <div className="add-client-form-group">
              <label className="add-client-form-label">Username:</label>
              <input
                type="text"
                name="username"
                placeholder="Enter Username"
                value={formData.username}
                onChange={handleChange}
                className="add-client-form-input"
                readOnly
              />
            </div>
            <div className="add-client-form-group">
              <label className="add-client-form-label">Name:</label>
              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleChange}
                className="add-client-form-input"
                required
              />
            </div>
          </div>
  
          <div className="add-client-form-row">
            <div className="add-client-form-group">
              <label className="add-client-form-label">Email:</label>
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                className="add-client-form-input"
                required
              />
            </div>
            <div className="add-client-form-group">
              <label className="add-client-form-label">Password:</label>
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                className="add-client-form-input"
              />
            </div>
          </div>
  
          <div className="add-client-form-row">
            <div className="add-client-form-group">
              <label className="add-client-form-label">Address:</label>
              <input
                type="text"
                name="address"
                placeholder="Enter Address"
                value={formData.address}
                onChange={handleChange}
                className="add-client-form-input"
                required
              />
            </div>
            <div className="add-client-form-group">
              <label className="add-client-form-label">License Number:</label>
              <input
                type="text"
                name="licenseNumber"
                placeholder="Enter License Number"
                value={formData.licenseNumber}
                onChange={handleChange}
                className="add-client-form-input"
                required
              />
            </div>
          </div>
  
          <div className="add-client-form-row">
            <div className="add-client-form-group">
              <label className="add-client-form-label">Field:</label>
              <select
                name="field"
                value={formData.field}
                onChange={handleChange}
                className="add-client-form-select"
                required
              >
                <option value="">Select Field</option>
                <option value="Family Law">Family Law</option>
                <option value="Criminal Law">Criminal Law</option>
                <option value="Corporate Law">Corporate Law</option>
                {/* Add more fields as needed */}
              </select>
            </div>
          </div>
  
          <div className="add-client-form-row">
            <button type="submit" className="add-client-form-button">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditProfile;
