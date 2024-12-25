import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import WorkspaceNavigation from "./workspace_naviagtion";
import "../css/add_appointment.css";
import Navbar from "./navbar";

const ClientAppointments = () => {
  const username = localStorage.getItem("username");

  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    client_id: "",
    client_name: "",
    mobile_number: "",
    appointment_date: "",
    appointment_time: "",
    note: "",
    lawyer_username: username, // Ensure lawyer_username is a string
  });

  const fetchClients = async () => {
    try {
      const response = await fetch("http://localhost:5000/clients");
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Clients:", data);
        setClients(data);
      } else {
        const errorText = await response.text();
        console.error(
          "Failed to fetch clients, status:",
          response.status,
          "Response:",
          errorText
        );
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Log the formData for debugging
    console.log("Form Data before submission:", formData);
  
    // Check if the appointment already exists for the client on the specified date
    try {
      const checkResponse = await fetch(
        `http://localhost:5000/check_appointment?client_name=${formData.client_name}&appointment_date=${formData.appointment_date}&lawyer_username=${formData.lawyer_username}`
      );
      
      if (checkResponse.ok) {
        const checkResult = await checkResponse.json();
        if (checkResult.exists) {
          console.log(checkResult.message); // Log the specific message
          alert(checkResult.message); // Show the message in an alert
          return; // Stop the form submission if a duplicate is found
        }
      }
  
      const response = await fetch("http://localhost:5000/add_appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
      console.log("Response from server:", result); // Log the response from the server
  
      if (response.ok) {
        alert(result.message); // Alert on success
        // Reset the form after submission
        setFormData({
          client_id: "",
          client_name: "",
          mobile_number: "",
          appointment_date: "",
          appointment_time: "",
          note: "",
          lawyer_username: username || "", // Ensure this is set
        });
      } else {
        alert("Error adding appointment: " + result.error);
      }
    } catch (error) {
      console.error("Error adding appointment:", error);
    }
  };
  

  const handleClientSelect = (e) => {
    const selectedClient = clients.find((c) => c.full_name === e.target.value);
    if (selectedClient) {
      setFormData({
        client_id: selectedClient.id,
        client_name: selectedClient.full_name,
        mobile_number: selectedClient.mobile_number,
        appointment_date: "",
        appointment_time: "",
        note: "",
        lawyer_username: username || "",
      });
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <>
    <Navbar/>
      <div className="appointment-container">
        <h2 className="appointment-header">Add Appointment</h2>
        <form className="appointment-form" onSubmit={handleSubmit}>
          <select
            className="form-select"
            name="client_name"
            value={formData.client_name}
            onChange={handleClientSelect}
            required
          >
            <option value="">Select Client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.full_name}>
                {client.full_name}
              </option>
            ))}
          </select>
          <input
            className="form-input"
            type="text"
            name="mobile_number"
            value={formData.mobile_number}
            readOnly
          />
          <input
            className="form-input"
            type="date"
            name="appointment_date"
            value={formData.appointment_date}
            onChange={handleInputChange}
            required
          />
          <input
            className="form-input"
            type="time"
            name="appointment_time"
            value={formData.appointment_time}
            onChange={handleInputChange}
            required
          />
          <textarea
            className="form-textarea"
            name="note"
            placeholder="Note"
            value={formData.note}
            onChange={handleInputChange}
            required
          ></textarea>
          <div className="add-task-form-row">
            <button className="add-appoint-form-button" type="submit">
              Submit
            </button>
              <Link className="add-appoint-form-link" to="/appointments">
                Appointment Table
              </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default ClientAppointments;
