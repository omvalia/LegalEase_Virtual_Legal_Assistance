import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar";

const BailPetitionTable = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [editClient, setEditClient] = useState(null);
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
    lawyer_username: "",
  });

  const username = localStorage.getItem("username");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const result = clients.filter(
      (client) =>
        client.lawyer_username === username && // Check if lawyer_username matches the current logged-in username
        (client.court_location
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
          client.accused_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredClients(result);
    setCurrentPage(1);
  }, [searchTerm, clients, username]); // Add `username` to dependencies

  const fetchClients = async () => {
    try {
      const response = await fetch("http://localhost:5000/getBail");
      const data = await response.json();
      setClients(data);
      setFilteredClients(
        data.filter((client) => client.lawyer_username === username)
      ); // Filter on fetch as well
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleEdit = (client) => {
    setEditClient(client.id);
    setFormData(client);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/updateBail/${editClient}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update client");
      }

      alert("Bail details updated successfully");
      setEditClient(null);
      fetchClients();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating client:", error);
      alert("Failed to update client");
    }
  };

  const handleDelete = async (clientId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this client?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:5000/deleteBail/${clientId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete client");
        }

        alert("Client deleted successfully");
        fetchClients();
      } catch (error) {
        console.error("Error deleting client:", error);
        alert("Failed to delete client");
      }
    }
  };

  const handleGenerateDocument = async (clientId) => {
    console.log(`Generating document for client ID: ${clientId}`);
    try {
      const response = await fetch(
        `http://localhost:5000/generateBailDocument/${clientId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate document");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
    //   link.setAttribute('download', `bail_petition_${petitionId}.docx`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error generating document:", error);
      alert("Failed to generate document");
    }
  };

  // Pagination logic
  const indexOfLastClient = currentPage * itemsPerPage;
  const indexOfFirstClient = indexOfLastClient - itemsPerPage;
  const currentClients = filteredClients.slice(
    indexOfFirstClient,
    indexOfLastClient
  );
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <Navbar />
      <div className="rent-details">
        <div className="rent-header">
          <div className="rent-header-title">
            <h1>BAIL PETITION DETAILS</h1>
          </div>
          <div className="rent-create-btn-container">
            <Link to="/bail_form" className="add-client-btn">
              + Create Bail Petition
            </Link>
          </div>
        </div>
        <div className="card-container">
          <div className="search-pagination">
            <div className="rent-search">
              <label className="search-client-label">
                Search by Court Location or Accused Name:
              </label>
              <input
                type="text"
                className="search-input"
                placeholder="Search by Court Location or Accused Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="pagination">
              <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span>
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
          <table className="rent-table">
            <thead>
              <tr>
                <th>Court Location</th>
                <th>Accused Name</th>
                <th>FIR Number</th>
                <th>Section</th>
                <th>Police Station</th>
                <th>Applicant Name</th>
                <th>Counsel Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentClients.map((client) => (
                <tr key={client.id}>
                  <td>{client.court_location}</td>
                  <td>{client.accused_name}</td>
                  <td>{client.fir_number}</td>
                  <td>{client.section}</td>
                  <td>{client.police_station}</td>
                  <td>{client.applicant_name}</td>
                  <td>{client.counsel_name}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(client)}
                    >
                      Edit
                    </button>
                    <br />
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(client.id)}
                    >
                      Delete
                    </button>
                    <br />
                    <button
                      className="cnr-btn"
                      onClick={() => handleGenerateDocument(client.id)}
                    >
                      Generate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3 className="modal-title">Edit Bail Petition Details</h3>
                <form className="edit-client-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Court Location:</label>
                      <input
                        className="form-input"
                        type="text"
                        name="court_location"
                        value={formData.court_location}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Accused Name:</label>
                      <input
                        className="form-input"
                        type="text"
                        name="accused_name"
                        value={formData.accused_name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">FIR Number:</label>
                      <input
                        className="form-input"
                        type="text"
                        name="fir_number"
                        value={formData.fir_number}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Section:</label>
                      <input
                        className="form-input"
                        type="text"
                        name="section"
                        value={formData.section}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Police Station:</label>
                      <input
                        className="form-input"
                        type="text"
                        name="police_station"
                        value={formData.police_station}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Applicant Name:</label>
                      <input
                        className="form-input"
                        type="text"
                        name="applicant_name"
                        value={formData.applicant_name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Counsel Name:</label>
                      <input
                        className="form-input"
                        type="text"
                        name="counsel_name"
                        value={formData.counsel_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Counsel Designation:</label>
                      <input
                        className="form-input"
                        type="text"
                        name="counsel_designation"
                        value={formData.counsel_designation}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button
                      type="button"
                      onClick={handleUpdate}
                      className="submit-btn-clients"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="cancel-btn-clients"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BailPetitionTable;
