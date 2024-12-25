import React, { useState, useEffect } from "react";
import WorkspaceNavigation from "./workspace_naviagtion";
import "../css/workspace_navigation.css";
import "../css/our_client.css";
import { Link } from "react-router-dom";
import Navbar from "./navbar";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editAppointment, setEditAppointment] = useState(null);
  const [formData, setFormData] = useState({
    client_name: "",
    mobile_number: "",
    appointment_date: "",
    appointment_time: "",
    note: "",
    lawyer_username: "",
  });

  const username = localStorage.getItem("username");

  // Fetch appointments from the backend
  // useEffect(() => {
  //   const fetchAppointments = async () => {
  //     try {
  //       const response = await fetch("http://localhost:5000/get_appointments");
  //       const data = await response.json();

  //       // Filter appointments based on the username
  //       const filteredAppointments = data.filter(
  //         (appointment) => appointment.lawyer_username === username
  //       );
  //       setAppointments(filteredAppointments); // Set the filtered appointments
  //     } catch (error) {
  //       console.error("Error fetching appointments:", error);
  //     }
  //   };

  //   if (username) {
  //     fetchAppointments();
  //   }
  // }, [username]);

    // Fetch appointments from the backend
    useEffect(() => {
      const fetchAppointments = async () => {
        try {
          const response = await fetch("http://localhost:5000/get_appointments");
          const data = await response.json();
  
          // Filter appointments based on the username
          const filteredAppointments = data.filter(
            (appointment) => appointment.lawyer_username === username
          );
          setAppointments(filteredAppointments); // Set the filtered appointments
  
          // Send WhatsApp messages for today's appointments
          // if (filteredAppointments.length > 0) {
          //   await sendWhatsappMessages(filteredAppointments);
          // }
        } catch (error) {
          console.error("Error fetching appointments:", error);
        }
      };
  
      fetchAppointments();
    }, [username]); // Re-fetch when the username changes
  
    // Function to send WhatsApp messages to the clients
    // const sendWhatsappMessages = async (appointments) => {
    //   try {
    //     const response = await fetch("http://localhost:5000/whatsapp_message", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({ appointments }), // Send the appointments as the request body
    //     });
  
    //     if (response.ok) {
    //       console.log("WhatsApp messages sent successfully!");
    //     } else {
    //       console.error("Failed to send WhatsApp messages.");
    //     }
    //   } catch (error) {
    //     console.error("Error sending WhatsApp messages:", error);
    //   }
    // };

  // Delete an appointment by id
  const deleteAppointment = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/delete_appointment/${id}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setAppointments(
          appointments.filter((appointment) => appointment.id !== id)
        );
      } else {
        console.error("Error deleting appointment:", result.error);
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  // Handle opening the edit modal
  const handleEdit = (appointment) => {
    setEditAppointment(appointment.id);
    setFormData(appointment);
    setIsModalOpen(true);
  };

  // Handle form data change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/update-appointment/${editAppointment}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update appointment");
      }

      const result = await response.json();
      alert("Appointment details updated successfully");
      setEditAppointment(null);
      setIsModalOpen(false);

      const updatedAppointments = appointments.map((appointment) =>
        appointment.id === editAppointment
          ? { ...appointment, ...formData }
          : appointment
      );
      setAppointments(updatedAppointments);
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert("Failed to update appointment");
    }
  };

  // Search functionality
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter((appointment) =>
    appointment.client_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedAppointments = filteredAppointments.slice(
    startIndex,
    startIndex + pageSize
  );
  const totalPages = Math.ceil(filteredAppointments.length / pageSize);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <Navbar />
      <div className="main-content">
        <div className="sidebar">
          <WorkspaceNavigation />
        </div>
        <div className="appoint-client-table-container">
          <div className="header-section">
            <div className="client-table-title">
              <h1>View Your Appointments</h1>
            </div>
            <div>
              <Link to="/ClientAppointments" className="add-client-btn">
                + Add Appointment
              </Link>
            </div>
          </div>

          {/* Card Container for Search, Pagination, and Table */}
          <div className="card-container">
            {/* Search and Pagination section */}
            <div className="search-pagination">
              <label className="search-client-label">
                Search Appointments:
              </label>
              <input
                type="text"
                className="search-input"
                placeholder="Search by Name"
                value={searchTerm}
                onChange={handleSearch}
              />
              <div className="pagination-controls">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>

            <table className="client-table">
              <thead className="client-table-header">
                <tr>
                  <th className="client-table-header-cell">Client Name</th>
                  <th className="client-table-header-cell">Mobile Number</th>
                  <th className="client-table-header-cell">Date</th>
                  <th className="client-table-header-cell">Time</th>
                  <th className="client-table-header-cell">Note</th>
                  <th className="client-table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="client-table-body">
                {paginatedAppointments.map((appointment) => (
                  <tr className="client-table-row" key={appointment.id}>
                    <td className="client-table-cell">
                      {appointment.client_name}
                    </td>
                    <td className="client-table-cell">
                      {appointment.mobile_number}
                    </td>
                    <td className="client-table-cell">
                      {appointment.appointment_date}
                    </td>
                    <td className="client-table-cell">
                      {appointment.appointment_time}
                    </td>
                    <td className="client-table-cell">{appointment.note}</td>
                    <td className="client-table-cell action">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(appointment)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteAppointment(appointment.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Edit Appointment</h3>
            <form className="edit-client-form">
              {/* Form fields for editing the appointment */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Client Name:</label>
                  <input
                    type="text"
                    name="client_name"
                    value={formData.client_name}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Number:</label>
                  <input
                    type="text"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date:</label>
                  <input
                    type="date"
                    name="appointment_date"
                    value={formData.appointment_date}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Time:</label>
                  <input
                    type="time"
                    name="appointment_time"
                    value={formData.appointment_time}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Note:</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  className="form-textarea"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="submit-btn"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Appointments;

