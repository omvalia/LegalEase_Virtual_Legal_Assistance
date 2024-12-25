import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/document_generation.css";
import '../css/rent_form.css';
import Navbar from "./navbar";

const RentForm = () => {
  const username = localStorage.getItem("username");
  const [formData, setFormData] = useState({
    lessor_name: "",
    lessor_address: "",
    lessee_name: "",
    lessee_address: "",
    location: "",
    day: "",
    month: "",
    year: "",
    lease_term: "",
    property_location: "",
    start_date: "",
    rent_amount: "",
    first_rent_date: "",
    interest_rate: "",
    taxes_amount: "",
    arrears_months: "",
    lawyer_username: username,
  });

  const formFields = Object.keys(formData).length;

  // Calculate the percentage of filled fields
  const calculateProgress = () => {
    const filledFields = Object.values(formData).filter(
      (value) => value.trim() !== ""
    ).length;
    return Math.round((filledFields / formFields) * 100);
  };

  const progress = calculateProgress();

  // Determine the color of the progress bar based on the percentage
  const getProgressBarColor = () => {
    if (progress <= 25) return "red";
    if (progress <= 50) return "orange";
    if (progress <= 75) return "yellow";
    return "green";
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const requiredFields = [];
    const errors = [];

    if (!formData.lessor_name.trim()) requiredFields.push("Lessor Name");
    if (!formData.lessee_name.trim()) requiredFields.push("Lessee Name");
    if (!formData.lessor_address.trim()) requiredFields.push("Lessor Address");
    if (!formData.lessee_address.trim()) requiredFields.push("Lessee Address");
    if (!formData.location.trim()) requiredFields.push("Location");
    if (!formData.property_location.trim())
      requiredFields.push("Property Location");

    if (!formData.start_date) {
      errors.push("Start date is required.");
    }
    if (!formData.first_rent_date) {
      errors.push("First rent date is required.");
    }
    if (
      formData.start_date &&
      formData.first_rent_date &&
      new Date(formData.first_rent_date) <= new Date(formData.start_date)
    ) {
      errors.push("First rent date should be after the start date.");
    }

    if (!formData.day || formData.day < 1 || formData.day > 31) {
      errors.push("Day must be between 1 and 31.");
    }
    if (!formData.year || formData.year <= 0) {
      errors.push("Year must be a positive number.");
    }
    if (!formData.lease_term || formData.lease_term <= 0) {
      errors.push("Lease term must be a positive number.");
    }
    if (!formData.rent_amount || formData.rent_amount <= 0) {
      errors.push("Rent amount must be a positive number.");
    }
    if (
      !formData.interest_rate ||
      formData.interest_rate < 0 ||
      formData.interest_rate > 100
    ) {
      errors.push("Interest rate must be between 0 and 100%.");
    }
    if (!formData.arrears_months || formData.arrears_months < 0) {
      errors.push("Arrears months cannot be negative.");
    }

    return { requiredFields, errors };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { requiredFields, errors } = validate();
    console.log("Submitting form data:", JSON.stringify(formData, null, 2));

    if (requiredFields.length > 0) {
      alert(`The following fields are required: ${requiredFields.join(", ")}`);
    }

    if (errors.length > 0) {
      errors.forEach((error) => alert(error));
    }

    if (requiredFields.length === 0 && errors.length === 0) {
      try {
        const response = await fetch("http://localhost:5000/submitForm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.status === 200) {
          alert("Form data submitted successfully");
        } else {
          alert("Failed to submit form: " + data.error);
        }
      } catch (error) {
        alert("An error occurred: " + error.message);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="lease-form">
        <form onSubmit={handleSubmit} className="lease-form-card">
          <h2 className="lease-form-title">Lease Agreement Form</h2>
          <div className="lease-progress-bar-container">
            <div
              className="lease-progress-bar"
              style={{
                width: `${progress}%`,
                backgroundColor: getProgressBarColor(),
                transition: "width 0.5s ease, background-color 0.5s ease",
              }}
            >
              {progress}%
            </div>
          </div>
  
          {/* First Row */}
          <div className="lease-form-row">
            <div className="lease-form-column">
              <label className="lease-form-label">Lessor Name:</label>
              <input
                type="text"
                name="lessor_name"
                value={formData.lessor_name}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Lessor Address:</label>
              <input
                type="text"
                name="lessor_address"
                value={formData.lessor_address}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Lessee Name:</label>
              <input
                type="text"
                name="lessee_name"
                value={formData.lessee_name}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Lessee Address:</label>
              <input
                type="text"
                name="lessee_address"
                value={formData.lessee_address}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
          </div>
  
          {/* Second Row */}
          <div className="lease-form-row">
            <div className="lease-form-column">
              <label className="lease-form-label">Location:</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Day:</label>
              <input
                type="number"
                name="day"
                value={formData.day}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Month:</label>
              <input
                type="text"
                name="month"
                value={formData.month}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Year:</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
          </div>
  
          {/* Third Row */}
          <div className="lease-form-row">
            <div className="lease-form-column">
              <label className="lease-form-label">Lease Term (Years):</label>
              <input
                type="number"
                name="lease_term"
                value={formData.lease_term}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Property Location:</label>
              <input
                type="text"
                name="property_location"
                value={formData.property_location}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Start Date:</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">First Rent Date:</label>
              <input
                type="date"
                name="first_rent_date"
                value={formData.first_rent_date}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
          </div>
  
          {/* Fourth Row */}
          <div className="lease-form-row">
            <div className="lease-form-column">
              <label className="lease-form-label">Rent Amount (Rs):</label>
              <input
                type="number"
                name="rent_amount"
                value={formData.rent_amount}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Interest Rate (%):</label>
              <input
                type="number"
                name="interest_rate"
                value={formData.interest_rate}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Taxes Amount (Rs):</label>
              <input
                type="number"
                name="taxes_amount"
                value={formData.taxes_amount}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Arrears (Months):</label>
              <input
                type="number"
                name="arrears_months"
                value={formData.arrears_months}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
          </div>
  
          <div className="lease-form-row">
            <button type="submit" className="lease-submit-button">
              Submit
            </button>
            <Link to="/rent_details" className="leese-form-link">
              Lease Agreement Table
            </Link>
          </div>
        </form>
      </div>
    </>
  );
  
};

export default RentForm;
