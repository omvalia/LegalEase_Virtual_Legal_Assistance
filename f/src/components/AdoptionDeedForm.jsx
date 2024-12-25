import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar";

const AdoptionDeedForm = () => {
  const username = localStorage.getItem("username");
  const [formData, setFormData] = useState({
    place_of_execution: "",
    day: "",
    month: "",
    year: "",
    adoptive_father_name: "",
    adoptive_father_residence: "",
    adoptive_father_address: "",
    natural_mother_name: "",
    natural_mother_residence: "",
    natural_mother_address: "",
    adopted_son_name: "",
    former_husband_name: "",
    marriage_date: "",
    marriage_location: "",
    former_name: "",
    adopted_son_dob: "",
    petition_number: "",
    divorce_court_location: "",
    exhibit_number: "",
    divorce_date: "",
    marriage_registration_location: "",
    receipt_number: "",
    marriage_registration_date: "",
    adoption_date: "",
    court_location: "",
    witness1_name: "",
    witness2_name: "",
    witness3_name: "",
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

    if (!formData.place_of_execution.trim())
      requiredFields.push("Place of Execution");
    if (!formData.adoptive_father_name.trim())
      requiredFields.push("Adoptive Father Name");
    if (!formData.natural_mother_name.trim())
      requiredFields.push("Natural Mother Name");
    if (!formData.adopted_son_name.trim())
      requiredFields.push("Adopted Son Name");
    if (!formData.marriage_location.trim())
      requiredFields.push("Marriage Location");
    if (!formData.divorce_court_location.trim())
      requiredFields.push("Divorce Court Location");
    if (!formData.court_location.trim()) requiredFields.push("Court Location");

    if (!formData.day || formData.day < 1 || formData.day > 31) {
      errors.push("Day must be between 1 and 31.");
    }
    if (!formData.year || formData.year <= 0) {
      errors.push("Year must be a positive number.");
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
          "http://localhost:5000/submitAdoptionDeed",
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
          <h2 className="lease-form-title">Adoption Deed Form</h2>
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
              <label className="lease-form-label">Place of Execution:</label>
              <input
                type="text"
                name="place_of_execution"
                value={formData.place_of_execution}
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
  
          <div className="lease-form-row">
            <div className="lease-form-column">
              <label className="lease-form-label">Adoptive Father Name:</label>
              <input
                type="text"
                name="adoptive_father_name"
                value={formData.adoptive_father_name}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Adoptive Father Residence:</label>
              <input
                type="text"
                name="adoptive_father_residence"
                value={formData.adoptive_father_residence}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Adoptive Father Address:</label>
              <input
                type="text"
                name="adoptive_father_address"
                value={formData.adoptive_father_address}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Natural Mother Name:</label>
              <input
                type="text"
                name="natural_mother_name"
                value={formData.natural_mother_name}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
          </div>
  
          <div className="lease-form-row">
            <div className="lease-form-column">
              <label className="lease-form-label">Natural Mother Residence:</label>
              <input
                type="text"
                name="natural_mother_residence"
                value={formData.natural_mother_residence}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Natural Mother Address:</label>
              <input
                type="text"
                name="natural_mother_address"
                value={formData.natural_mother_address}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Adopted Son Name:</label>
              <input
                type="text"
                name="adopted_son_name"
                value={formData.adopted_son_name}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Former Husband Name:</label>
              <input
                type="text"
                name="former_husband_name"
                value={formData.former_husband_name}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
          </div>
  
          <div className="lease-form-row">
            <div className="lease-form-column">
              <label className="lease-form-label">Marriage Date:</label>
              <input
                type="date"
                name="marriage_date"
                value={formData.marriage_date}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Marriage Location:</label>
              <input
                type="text"
                name="marriage_location"
                value={formData.marriage_location}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Former Name:</label>
              <input
                type="text"
                name="former_name"
                value={formData.former_name}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Adopted Son DOB:</label>
              <input
                type="date"
                name="adopted_son_dob"
                value={formData.adopted_son_dob}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
          </div>
  
          <div className="lease-form-row">
            <div className="lease-form-column">
              <label className="lease-form-label">Petition Number:</label>
              <input
                type="text"
                name="petition_number"
                value={formData.petition_number}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Divorce Court Location:</label>
              <input
                type="text"
                name="divorce_court_location"
                value={formData.divorce_court_location}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Exhibit Number:</label>
              <input
                type="text"
                name="exhibit_number"
                value={formData.exhibit_number}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Divorce Date:</label>
              <input
                type="date"
                name="divorce_date"
                value={formData.divorce_date}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
          </div>
  
          <div className="lease-form-row">
            <div className="lease-form-column">
              <label className="lease-form-label">Marriage Registration Location:</label>
              <input
                type="text"
                name="marriage_registration_location"
                value={formData.marriage_registration_location}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Receipt Number:</label>
              <input
                type="text"
                name="receipt_number"
                value={formData.receipt_number}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
            <div className="lease-form-column">
              <label className="lease-form-label">Marriage Registration Date:</label>
              <input
                type="date"
                name="marriage_registration_date"
                value={formData.marriage_registration_date}
                onChange={handleChange}
                className="lease-input-rent-form"
              />
            </div>
          </div>
  
          <div className="lease-form-row">
            <button type="submit" className="lease-submit-button">
              Submit
            </button>
            <Link to="/adoption_details" className="leese-form-link">
              Adoption Deed Table
            </Link>
          </div>
        </form>
      </div>
    </>
  );
  
};

export default AdoptionDeedForm;
