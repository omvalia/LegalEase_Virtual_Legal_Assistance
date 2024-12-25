import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate(); // Initialize navigate hook

    const [formData, setFormData] = useState({
      username: "",
      name: "",
      email: "",
      password: "",
      address: "",
      licenseNumber: "",
      field: "",
    });
  
    const [message, setMessage] = useState(""); // State for message
    const [validationError, setValidationError] = useState(""); // State for validation errors
  
    // Validation function
    const validateForm = () => {
      const { username, name, password, address, licenseNumber, field } = formData;
  
      // Username: At least 4 characters
      if (username.length < 4) {
        setValidationError("Username must be at least 4 characters long.");
        return false;
      }
  
      // Name: Should contain only letters and spaces
      const nameRegex = /^[A-Za-z\s]+$/;
      if (!nameRegex.test(name) || name.length < 3) {
        setValidationError("Name must be at least 3 characters long and contain only letters.");
        return false;
      }
  
      // Password: At least 6 characters, must contain letters and numbers
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
      if (!passwordRegex.test(password)) {
        setValidationError("Password must be at least 6 characters long and contain both letters and numbers.");
        return false;
      }
  
      // Address: Minimum 5 characters
      if (address.length < 5) {
        setValidationError("Address must be at least 5 characters long.");
        return false;
      }
  
      // License Number: Exactly 8 alphanumeric characters
      const licenseRegex = /^[A-Za-z0-9]{8}$/;
      if (!licenseRegex.test(licenseNumber)) {
        setValidationError("License Number must be exactly 8 alphanumeric characters.");
        return false;
      }
  
      // Field: Must be selected
      if (!field) {
        setValidationError("Please select a field.");
        return false;
      }
  
      setValidationError("");
      return true;
    };
  
    // Handle input changes
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  
    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
      setMessage(""); // Reset message on submit

      
      // Validate form before submission
      if (!validateForm()) return;
  
      try {
        const response = await fetch("http://localhost:5000/signup/lawyer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        // const result = await response.json();

        console.log("Response status: ", response.status);  // Check response status

        const result = await response.json();
        console.log("Response result: ", result);  // Log result for debugging
    
  
        if (response.ok) {
          alert("Signup successful!"); // Set success message
          setFormData({ // Clear form data
            username: "",
            name: "",
            email: "",
            password: "",
            address: "",
            licenseNumber: "",
            field: "",
          });
          // Optionally navigate to another page after a delay
          setTimeout(() => navigate("/"), 2000); // Redirect after 2 seconds
        } else {
          setMessage(result.error); // Set error message
        }
      } catch (error) {
        setMessage("An error occurred during signup."); // Handle error message
      }
    };
  
    // Back button handler
    const handleBackClick = () => {
      navigate("/"); // Redirect to homepage or any desired page
    };

  return (
    <div className="login-form-container sign-up-container">
    <form className="form-container" onSubmit={handleSubmit}> 
        <h1 className="h1-login" >Create Account</h1>
        <input
              className="input-login"
              type="text"
              name="username"
              placeholder="Enter Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              className="input-login"
              type="text"
              name="name"
              placeholder="Enter Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              className="input-login"
              type="email"
              name="email"
              placeholder="Enter Email ID"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              className="input-login"
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              className="input-login"
              type="text"
              name="address"
              placeholder="Enter Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <input
              className="input-login"
              type="text"
              name="licenseNumber"
              placeholder="Lawyer License Number"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
            />
            <select
              name="field"
              value={formData.field}
              onChange={handleChange}
              required
            >
              <option value="">Select Field</option>
              <option value="criminal">Criminal</option>
              <option value="civil">Civil</option>
              <option value="corporate">Corporate</option>
              <option value="family">Family</option>
            </select>
        <button className="button-login">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;


