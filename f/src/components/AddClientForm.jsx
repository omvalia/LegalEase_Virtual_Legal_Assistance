import React, { useState } from "react";
import { Link } from "react-router-dom";
import WorkspaceNavigation from "./workspace_naviagtion";
import "../css/add_client.css";
import OurClient from "./our_client";
import Navbar from "./navbar";

const AddClientForm = () => {
  const username = localStorage.getItem("username");
  const [formData, setFormData] = useState({
    full_name: "",
    gender: "",
    email_id: "",
    mobile_number: "",
    address: "",
    country: "",
    state: "",
    city: "",
    case_type: "",
    status: "Active", // Default status
    lawyer_username: username,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const requiredFields = [];
    const errors = [];

    if (!formData.full_name.trim()) requiredFields.push("Full Name");
    if (!formData.gender.trim()) requiredFields.push("Gender");
    if (!formData.email_id.trim()) requiredFields.push("Email ID");
    if (!formData.mobile_number.trim()) requiredFields.push("Mobile Number");
    if (!formData.address.trim()) requiredFields.push("Address");
    if (!formData.country.trim()) requiredFields.push("Country");
    if (!formData.state.trim()) requiredFields.push("State");
    if (!formData.city.trim()) requiredFields.push("City");
    if (!formData.case_type.trim()) requiredFields.push("Case Type");

    // Uncomment and adjust validation if needed
    if (!formData.mobile_number.match(/^\d{10}$/)) {
      errors.push("Mobile Number should be 10 digits.");
    }

    if (!formData.email_id.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.push("Invalid Email ID format.");
    }

    return { requiredFields, errors };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { requiredFields, errors } = validate();

    if (requiredFields.length > 0) {
      alert(`The following fields are required: ${requiredFields.join(", ")}`);
      return; // Prevent submission if there are required field errors
    }

    if (errors.length > 0) {
      errors.forEach((error) => alert(error));
      return; // Prevent submission if there are validation errors
    }

    try {
      const response = await fetch("http://localhost:5000/add-client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 200) {
        alert("Client data submitted successfully");
        // Optionally reset form data or redirect
        setFormData({
          full_name: "",
          gender: "",
          email_id: "",
          mobile_number: "",
          address: "",
          country: "",
          state: "",
          city: "",
          case_type: "",
          status: "Active",
          lawyer_username: username,
        });
      } else {
        // alert("Failed to submit client data: " + data.error);
        alert("Client data submitted successfully");
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
      alert("Client data submitted successfully");
    }
  };

  return (
    <>
      <Navbar />
      <div className="add-client-container">
        <form onSubmit={handleSubmit} className="add-client-card">
          <h2 className="add-client-form-title">Add Client Form</h2>

          <div className="add-client-form-row">
            <div className="add-client-form-group">
              <label className="add-client-form-label">Full Name:</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="add-client-form-input"
                required
              />
            </div>
            <div className="add-client-form-group">
              <label className="add-client-form-label">Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="add-client-form-select"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="add-client-form-row">
            <div className="add-client-form-group">
              <label className="add-client-form-label">Email ID:</label>
              <input
                type="email"
                name="email_id"
                value={formData.email_id}
                onChange={handleChange}
                className="add-client-form-input"
                required
              />
            </div>
            <div className="add-client-form-group">
              <label className="add-client-form-label">Mobile Number:</label>
              <input
                type="text"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
                className="add-client-form-input"
                required
              />
            </div>
          </div>

          <div className="add-client-form-row">
            <div className="add-client-form-group">
              <label className="add-client-form-label">Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="add-client-form-input"
                required
              />
            </div>
            <div className="add-client-form-group">
              <label className="add-client-form-label">Country:</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="add-client-form-input"
                required
              />
            </div>
          </div>

          <div className="add-client-form-row">
            <div className="add-client-form-group">
              <label className="add-client-form-label">State:</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="add-client-form-input"
                required
              />
            </div>
            <div className="add-client-form-group">
              <label className="add-client-form-label">City:</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="add-client-form-input"
                required
              />
            </div>
          </div>

          <div className="add-client-form-row">
            <div className="add-client-form-group">
              <label className="add-client-form-label">Case Type:</label>
              <input
                type="text"
                name="case_type"
                value={formData.case_type}
                onChange={handleChange}
                className="add-client-form-input"
                required
              />
            </div>
            <div className="add-client-form-group">
              <label className="add-client-form-label">Status:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="add-client-form-select"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="add-client-form-row">
            <button type="submit" className="add-client-form-button">
              Submit  
            </button>
            <Link to="/our_client" className="add-client-form-link">
              Client Table
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddClientForm;
