import React, { useState } from "react";
import Navbar from "./navbar";

const EmployeeAgreementForm = () => {
  const username = localStorage.getItem("username");
  const [formData, setFormData] = useState({
    place_of_execution: "",
    day: "",
    month: "",
    year: "",
    company_name: "",
    representative_position: "",
    representative_name: "",
    representative_father_name: "",
    registered_office_address: "",
    employee_name: "",
    employee_father_name: "",
    nationality: "",
    employee_age: "",
    employee_address: "",
    business_nature: "",
    post_title: "",
    application_date: "",
    appointment_position: "",
    probation_period: "",
    employment_duration: "",
    work_location: "",
    reporting_date: "",
    work_start_time: "",
    work_end_time: "",
    weekly_holiday: "",
    probation_stipend: "",
    basic_salary: "",
    company_policy_reference: "",
    witness_name1: "",
    witness_name2: "",
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
    if (!formData.company_name.trim()) requiredFields.push("Company Name");
    if (!formData.representative_position.trim())
      requiredFields.push("Representative Position");
    if (!formData.representative_name.trim())
      requiredFields.push("Representative Name");
    if (!formData.representative_father_name.trim())
      requiredFields.push("Representative Father Name");
    if (!formData.registered_office_address.trim())
      requiredFields.push("Registered Office Address");
    if (!formData.employee_name.trim()) requiredFields.push("Employee Name");
    if (!formData.employee_father_name.trim())
      requiredFields.push("Employee Father Name");
    if (!formData.nationality.trim()) requiredFields.push("Nationality");
    if (!formData.employee_age || formData.employee_age <= 0)
      errors.push("Employee Age must be a positive number");
    if (!formData.employee_address.trim())
      requiredFields.push("Employee Address");
    if (!formData.business_nature.trim())
      requiredFields.push("Business Nature");
    if (!formData.post_title.trim()) requiredFields.push("Post Title");
    if (!formData.application_date)
      errors.push("Application Date is required.");
    if (!formData.appointment_position.trim())
      requiredFields.push("Appointment Position");
    if (!formData.probation_period.trim())
      requiredFields.push("Probation Period");
    if (!formData.employment_duration.trim())
      requiredFields.push("Employment Duration");
    if (!formData.work_location.trim()) requiredFields.push("Work Location");
    if (!formData.reporting_date) errors.push("Reporting Date is required.");
    if (!formData.work_start_time) errors.push("Work Start Time is required.");
    if (!formData.work_end_time) errors.push("Work End Time is required.");
    if (!formData.weekly_holiday.trim()) requiredFields.push("Weekly Holiday");
    if (!formData.probation_stipend || formData.probation_stipend <= 0)
      errors.push("Probation Stipend must be a positive number.");
    if (!formData.basic_salary || formData.basic_salary <= 0)
      errors.push("Basic Salary must be a positive number.");
    if (!formData.company_policy_reference.trim())
      requiredFields.push("Company Policy Reference");
    if (!formData.witness_name1.trim()) requiredFields.push("Witness Name 1");
    if (!formData.witness_name2.trim()) requiredFields.push("Witness Name 2");

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
        const response = await fetch("http://localhost:5000/submitEmployee", {
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
      <div className="employee-service-form">
        <form onSubmit={handleSubmit} className="employee-service-global-form">
          <h2 className="employee-service-form-h2">
            Employee Service Agreement Form
          </h2>
          <div className="employee-service-progress-bar-container">
            <div
              className="employee-service-progress-bar"
              style={{
                width: `${progress}%`,
                backgroundColor: getProgressBarColor(),
                transition: "width 0.5s ease, background-color 0.5s ease",
              }}
            >
              {progress}%
            </div>
          </div>
          <div className="employee-service-form-row">
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">
                Place of Execution:
              </label>
              <input
                type="text"
                name="place_of_execution"
                value={formData.place_of_execution}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">Day:</label>
              <input
                type="number"
                name="day"
                value={formData.day}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
          </div>

          <div className="employee-service-form-row">
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">Month:</label>
              <input
                type="text"
                name="month_year"
                value={formData.month_year}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">Year:</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
          </div>

          <div className="employee-service-form-row">
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">
                Company Name:
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">
                Representative Position:
              </label>
              <input
                type="text"
                name="representative_position"
                value={formData.representative_position}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
          </div>

          <div className="employee-service-form-row">
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">
                Representative Name:
              </label>
              <input
                type="text"
                name="representative_name"
                value={formData.representative_name}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">
                Representative Father Name:
              </label>
              <input
                type="text"
                name="representative_father_name"
                value={formData.representative_father_name}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
          </div>

          <div className="employee-service-form-row">
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">
                Registered Office Address:
              </label>
              <input
                type="text"
                name="registered_office_address"
                value={formData.registered_office_address}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">
                Employee Name:
              </label>
              <input
                type="text"
                name="employee_name"
                value={formData.employee_name}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
          </div>

          <div className="employee-service-form-row">
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">
                Employee Father Name:
              </label>
              <input
                type="text"
                name="employee_father_name"
                value={formData.employee_father_name}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">
                Nationality:
              </label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
          </div>

          <div className="employee-service-form-row">
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">
                Employee Age:
              </label>
              <input
                type="number"
                name="employee_age"
                value={formData.employee_age}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">
                Employee Address:
              </label>
              <input
                type="text"
                name="employee_address"
                value={formData.employee_address}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
          </div>

          <div className="employee-service-form-row">
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">
                Business Nature:
              </label>
              <input
                type="text"
                name="business_nature"
                value={formData.business_nature}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">Post Title:</label>
              <input
                type="text"
                name="post_title"
                value={formData.post_title}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
          </div>

          <div className="employee-service-form-row">
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">
                Application Date:
              </label>
              <input
                type="date"
                name="application_date"
                value={formData.application_date}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">
                Appointment Position:
              </label>
              <input
                type="text"
                name="appointment_position"
                value={formData.appointment_position}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
          </div>

          <div className="employee-service-form-row">
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">
                Probation Period:
              </label>
              <input
                type="text"
                name="probation_period"
                value={formData.probation_period}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">
                Employment Duration:
              </label>
              <input
                type="text"
                name="employment_duration"
                value={formData.employment_duration}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
          </div>

          <div className="employee-service-form-row">
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">
                Work Location:
              </label>
              <input
                type="text"
                name="work_location"
                value={formData.work_location}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">
                Reporting Date:
              </label>
              <input
                type="date"
                name="reporting_date"
                value={formData.reporting_date}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
          </div>

          <div className="employee-service-form-row">
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">
                Work Start Time:
              </label>
              <input
                type="time"
                name="work_start_time"
                value={formData.work_start_time}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">
                Work End Time:
              </label>
              <input
                type="time"
                name="work_end_time"
                value={formData.work_end_time}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
          </div>

          <div className="employee-service-form-row">
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">
                Weekly Holiday:
              </label>
              <input
                type="text"
                name="weekly_holiday"
                value={formData.weekly_holiday}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">
                Probation Stipend:
              </label>
              <input
                type="number"
                name="probation_stipend"
                value={formData.probation_stipend}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
          </div>

          <div className="employee-service-form-row">
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">
                Monthly Salary:
              </label>
              <input
                type="number"
                name="monthly_salary"
                value={formData.monthly_salary}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">
                Other Benefits:
              </label>
              <input
                type="text"
                name="other_benefits"
                value={formData.other_benefits}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
          </div>

          <div className="employee-service-form-row">
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">
                Employment Type:
              </label>
              <input
                type="text"
                name="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
            <div className="employee-service-form-column">
              <label className="employee-service-form-label">
                Contract Start Date:
              </label>
              <input
                type="date"
                name="contract_start_date"
                value={formData.contract_start_date}
                onChange={handleChange}
                className="employee-service-input"
              />
            </div>
          </div>

          {/* <button type="button" className="employee-service-btn" onClick={handlePrev}>Previous</button>
                    <button type="button" className="employee-service-btn" onClick={handleNext}>Next</button> */}

          <button type="submit" className="employee-service-btn">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default EmployeeAgreementForm;
