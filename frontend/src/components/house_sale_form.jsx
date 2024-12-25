import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar";

const HouseSaleForm = () => {
  const username = localStorage.getItem("username");

  const [formData, setFormData] = useState({
    location: "",
    day: "",
    month: "",
    year: "",
    vendor_name: "",
    vendor_father_name: "",
    vendor_address: "",
    purchaser_name: "",
    purchaser_father_name: "",
    purchaser_address: "",
    house_no: "",
    road_name: "",
    sale_price: "",
    earnest_money: "",
    earnest_money_date: "",
    completion_period: "",
    title_report_days: "",
    refund_days: "",
    refund_delay_days: "",
    interest_rate: "",
    liquidated_damages: "",
    witness_1_name: "",
    witness_2_name: "",
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

    // Validate text fields
    if (!formData.vendor_name.trim()) requiredFields.push("Vendor Name");
    if (!formData.vendor_father_name.trim())
      requiredFields.push("Vendor Father Name");
    if (!formData.vendor_address.trim()) requiredFields.push("Vendor Address");
    if (!formData.purchaser_name.trim()) requiredFields.push("Purchaser Name");
    if (!formData.purchaser_father_name.trim())
      requiredFields.push("Purchaser Father Name");
    if (!formData.purchaser_address.trim())
      requiredFields.push("Purchaser Address");
    if (!formData.location.trim()) requiredFields.push("Location");
    if (!formData.house_no.trim()) requiredFields.push("House Number");
    if (!formData.road_name.trim()) requiredFields.push("Road Name");
    if (!formData.witness_1_name.trim()) requiredFields.push("Witness 1 Name");
    if (!formData.witness_2_name.trim()) requiredFields.push("Witness 2 Name");

    // Validate date fields
    if (!formData.earnest_money_date) {
      errors.push("Earnest money date is required.");
    }

    // Validate numerical fields
    if (!formData.day || formData.day < 1 || formData.day > 31) {
      errors.push("Day must be between 1 and 31.");
    }
    if (!formData.year || formData.year <= 0) {
      errors.push("Year must be a positive number.");
    }
    if (!formData.sale_price || formData.sale_price <= 0) {
      errors.push("Sale price must be a positive number.");
    }
    if (!formData.earnest_money || formData.earnest_money <= 0) {
      errors.push("Earnest money must be a positive number.");
    }
    if (
      !formData.interest_rate ||
      formData.interest_rate < 0 ||
      formData.interest_rate > 100
    ) {
      errors.push("Interest rate must be between 0 and 100%.");
    }
    if (!formData.refund_delay_days || formData.refund_delay_days < 0) {
      errors.push("Refund delay days cannot be negative.");
    }

    if (!formData.completion_period || formData.completion_period <= 0) {
      errors.push("Completion period must be a positive number.");
    }
    if (!formData.title_report_days || formData.title_report_days <= 0) {
      errors.push("Title report days must be a positive number.");
    }
    if (!formData.refund_days || formData.refund_days <= 0) {
      errors.push("Refund days must be a positive number.");
    }
    if (!formData.liquidated_damages || formData.liquidated_damages <= 0) {
      errors.push("Liquidated damages must be a positive number.");
    }

    return { requiredFields, errors };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { requiredFields, errors } = validate();

    if (requiredFields.length > 0) {
      alert(`The following fields are required: ${requiredFields.join(", ")}`);
    }

    if (errors.length > 0) {
      errors.forEach((error) => alert(error));
    }

    if (requiredFields.length === 0 && errors.length === 0) {
      try {
        const response = await fetch(
          "http://localhost:5000/submitHouseSaleForm",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

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
          <h2 className="lease-form-title">House Sale Agreement Form</h2>
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
              <label className="lease-form-label">Vendor Name:</label>
              <input
                type="text"
                name="vendor_name"
                value={formData.vendor_name}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Vendor Father Name:</label>
              <input
                type="text"
                name="vendor_father_name"
                value={formData.vendor_father_name}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Vendor Address:</label>
              <input
                type="text"
                name="vendor_address"
                value={formData.vendor_address}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Purchaser Name:</label>
              <input
                type="text"
                name="purchaser_name"
                value={formData.purchaser_name}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
          </div>
  
          {/* Second Row */}
          <div className="lease-form-row">
            <div className="lease-form-column">
              <label className="lease-form-label">Purchaser Father Name:</label>
              <input
                type="text"
                name="purchaser_father_name"
                value={formData.purchaser_father_name}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Purchaser Address:</label>
              <input
                type="text"
                name="purchaser_address"
                value={formData.purchaser_address}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
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
              <label className="lease-form-label">House No:</label>
              <input
                type="text"
                name="house_no"
                value={formData.house_no}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
          </div>
  
          {/* Third Row */}
          <div className="lease-form-row">
            <div className="lease-form-column">
              <label className="lease-form-label">Road Name:</label>
              <input
                type="text"
                name="road_name"
                value={formData.road_name}
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
  
          {/* Fourth Row */}
          <div className="lease-form-row">
            <div className="lease-form-column">
              <label className="lease-form-label">Sale Price (Rs):</label>
              <input
                type="number"
                name="sale_price"
                value={formData.sale_price}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Earnest Money (Rs):</label>
              <input
                type="number"
                name="earnest_money"
                value={formData.earnest_money}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Earnest Money Date:</label>
              <input
                type="date"
                name="earnest_money_date"
                value={formData.earnest_money_date}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">
                Completion Period (Days):
              </label>
              <input
                type="number"
                name="completion_period"
                value={formData.completion_period}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
          </div>
  
          {/* Fifth Row */}
          <div className="lease-form-row">
            <div className="lease-form-column">
              <label className="lease-form-label">Title Report Days:</label>
              <input
                type="number"
                name="title_report_days"
                value={formData.title_report_days}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Refund Days:</label>
              <input
                type="number"
                name="refund_days"
                value={formData.refund_days}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Refund Delay Days:</label>
              <input
                type="number"
                name="refund_delay_days"
                value={formData.refund_delay_days}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Interest Rate (%):</label>
              <input
                type="number"
                step="0.01"
                name="interest_rate"
                value={formData.interest_rate}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
          </div>
  
          {/* Sixth Row */}
          <div className="lease-form-row">
            <div className="lease-form-column">
              <label className="lease-form-label">
                Liquidated Damages (₹):
              </label>
              <input
                type="number"
                step="0.01"
                name="liquidated_damages"
                value={formData.liquidated_damages}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Witness 1 Name:</label>
              <input
                type="text"
                name="witness_1_name"
                value={formData.witness_1_name}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Witness 2 Name:</label>
              <input
                type="text"
                name="witness_2_name"
                value={formData.witness_2_name}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
          </div>
  
          <div className="lease-form-row">
            <button type="submit" className="lease-submit-button">
              Submit
            </button>
            <Link to="/house_sale_details" className="leese-form-link">
              House Sales Details
            </Link>
          </div>
        </form>
      </div>
    </>
  );
  
};

export default HouseSaleForm;
