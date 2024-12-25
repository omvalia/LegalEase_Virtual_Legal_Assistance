import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar";

const BailPetitionForm = () => {
  const username = localStorage.getItem("username");

  const [formData, setFormData] = useState({
    court_location: "",
    accused_name: "",
    fir_number: "",
    section: "",
    police_station: "",
    residence_address: "",
    applicant_name: "",
    counsel_name: "",
    counsel_designation: "",
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

    if (!formData.court_location.trim()) requiredFields.push("Court Location");
    if (!formData.accused_name.trim()) requiredFields.push("Accused Name");
    if (!formData.fir_number.trim()) requiredFields.push("FIR Number");
    if (!formData.section.trim()) requiredFields.push("Section");
    if (!formData.police_station.trim()) requiredFields.push("Police Station");
    if (!formData.residence_address.trim())
      requiredFields.push("Residence Address");
    if (!formData.applicant_name.trim()) requiredFields.push("Applicant Name");
    if (!formData.counsel_name.trim()) requiredFields.push("Counsel Name");
    if (!formData.counsel_designation.trim())
      requiredFields.push("Counsel Designation");

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
          "http://localhost:5000/submitBailPetition",
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
          <h2 className="lease-form-title">Bail Petition Form</h2>
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

          <div className="lease-form-row">
            <div className="lease-form-column">
              <label className="lease-form-label">Court Location:</label>
              <input
                type="text"
                name="court_location"
                value={formData.court_location}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Accused Name:</label>
              <input
                type="text"
                name="accused_name"
                value={formData.accused_name}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
          </div>

          <div className="lease-form-row">
            <div className="lease-form-column">
              <label className="lease-form-label">FIR Number:</label>
              <input
                type="text"
                name="fir_number"
                value={formData.fir_number}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Section:</label>
              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
          </div>

          <div className="lease-form-row">
            <div className="lease-form-column">
              <label className="lease-form-label">Police Station:</label>
              <input
                type="text"
                name="police_station"
                value={formData.police_station}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Residence Address:</label>
              <input
                type="text"
                name="residence_address"
                value={formData.residence_address}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
          </div>

          <div className="lease-form-row">
            <div className="lease-form-column">
              <label className="lease-form-label">Applicant Name:</label>
              <input
                type="text"
                name="applicant_name"
                value={formData.applicant_name}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Counsel Name:</label>
              <input
                type="text"
                name="counsel_name"
                value={formData.counsel_name}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
          </div>

          <div className="lease-form-row">
            <div className="lease-form-column">
              <label className="lease-form-label">Counsel Designation:</label>
              <input
                type="text"
                name="counsel_designation"
                value={formData.counsel_designation}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
          </div>

          <div className="lease-form-row">
            <button type="submit" className="lease-submit-button">
              Submit
            </button>
            <Link to="/bail_details" className="leese-form-link">
              Bail Petition Table
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default BailPetitionForm;
