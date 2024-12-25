import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import WorkspaceNavigation from "./workspace_naviagtion";
import "../css/workspace_navigation.css";
import "../css/our_client.css";
import Navbar from "./navbar";

function OurClient() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editClient, setEditClient] = useState(null);
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
    status: "",
    lawyer_username: "",
  });

  const username = localStorage.getItem("username"); // Get username from local storage

  useEffect(() => {
    fetch("http://localhost:5000/clients")
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter(
          (client) => client.lawyer_username === username
        ); // Filter based on lawyer_username
        setClients(filteredData);
        setFilteredClients(filteredData);
      })
      .catch((error) => console.error("Error fetching clients:", error));
  }, [username]);

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = clients.filter((client) =>
      client.full_name.toLowerCase().includes(searchValue)
    );
    setFilteredClients(filtered);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      fetch(`http://localhost:5000/delete-client/${id}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then(() => {
          const updatedClients = clients.filter((client) => client.id !== id);
          setClients(updatedClients);
          setFilteredClients(updatedClients);
        })
        .catch((error) => console.error("Error deleting client:", error));
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
        `http://localhost:5000/update-client/${editClient}`,
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

      alert("Client details updated successfully");
      setEditClient(null);
      setIsModalOpen(false);

      const updatedClients = clients.map((client) =>
        client.id === editClient ? { ...client, ...formData } : client
      );
      setClients(updatedClients);
      setFilteredClients(updatedClients);
    } catch (error) {
      console.error("Error updating client:", error);
      alert("Failed to update client");
    }
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedClients = filteredClients.slice(
    startIndex,
    startIndex + pageSize
  );
  const totalPages = Math.ceil(filteredClients.length / pageSize);

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

        <div className="content-container">
          <div className="header-section">
            <div className="client-table-title">
              <h1>View Your Clients</h1>
            </div>
            <div>
              <Link to="/AddClientForm" className="add-client-btn">
                + Add Client
              </Link>
            </div>
          </div>

          {/* Card Container for Search, Pagination, and Table */}
          <div className="card-container">
            {/* Search and Pagination section */}
            <div className="search-pagination">
              <label className="search-client-label">Search Clients:</label>
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
                  <th className="client-table-header-cell">ID</th>
                  <th className="client-table-header-cell">Full Name</th>
                  <th className="client-table-header-cell">Email</th>
                  <th className="client-table-header-cell">Phone</th>
                  <th className="client-table-header-cell">Status</th>
                  <th className="client-table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="client-table-body">
                {paginatedClients.map((client) => (
                  <tr className="client-table-row" key={client.id}>
                    <td className="client-table-cell">{client.id}</td>
                    <td className="client-table-cell">{client.full_name}</td>
                    <td className="client-table-cell">{client.email_id}</td>
                    <td className="client-table-cell">
                      {client.mobile_number}
                    </td>
                    <td className="client-table-cell">{client.status}</td>
                    <td className="client-table-cell action">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(client)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(client.id)}
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
            <h3 className="modal-title">Edit Client Details</h3>
            <form className="edit-client-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name:</label>
                  <input
                    className="form-input"
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender:</label>
                  <input
                    className="form-input"
                    type="text"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email:</label>
                  <input
                    className="form-input"
                    type="email"
                    name="email_id"
                    value={formData.email_id}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Number:</label>
                  <input
                    className="form-input"
                    type="text"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Address:</label>
                  <input
                    className="form-input"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Country:</label>
                  <input
                    className="form-input"
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State:</label>
                  <input
                    className="form-input"
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City:</label>
                  <input
                    className="form-input"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Case Type:</label>
                  <input
                    className="form-input"
                    type="text"
                    name="case_type"
                    value={formData.case_type}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Status:</label>
                  <input
                    className="form-input"
                    type="text"
                    name="status"
                    value={formData.status}
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
    </>
  );
}

export default OurClient;
