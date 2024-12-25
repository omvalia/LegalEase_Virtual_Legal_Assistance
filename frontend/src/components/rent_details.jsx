import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/rent_details.css";
import Navbar from "./navbar";

const RentDetails = () => {
  // const [clients, setClients] = useState([]);
  // const [filteredClients, setFilteredClients] = useState([]);
  // const [editClient, setEditClient] = useState(null);
  // const [formData, setFormData] = useState({
  //   lessor_name: "",
  //   lessee_name: "",
  //   property_location: "",
  //   lease_term: "",
  //   rent_amount: "",
  //   interest_rate: "",
  //   lawyer_username: "",
  // });

  // const username = localStorage.getItem("username");

  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 5;
  // const [searchTerm, setSearchTerm] = useState("");
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // useEffect(() => {
  //   fetchClients();
  // }, []);

  // useEffect(() => {
  //   const result = clients.filter(
  //     (client) =>
  //       client.lessor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       client.lessee_name.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  //   setFilteredClients(result);
  //   setCurrentPage(1);
  // }, [searchTerm, clients]);

  // const fetchClients = async () => {
  //   try {
  //     const response = await fetch("http://localhost:5000/getClients");
  //     const data = await response.json();
  //     setClients(data);
  //     setFilteredClients(data);
  //   } catch (error) {
  //     console.error("Error fetching clients:", error);
  //   }
  // };

  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [editClient, setEditClient] = useState(null);
  const [formData, setFormData] = useState({
    lessor_name: "",
    lessee_name: "",
    property_location: "",
    lease_term: "",
    rent_amount: "",
    interest_rate: "",
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
        client.lawyer_username === username && // Only show clients with the same lawyer_username
        (client.lessor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.lessee_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredClients(result);
    setCurrentPage(1);
  }, [searchTerm, clients, username]); // Ensure that 'username' is included in the dependencies

  const fetchClients = async () => {
    try {
      const response = await fetch("http://localhost:5000/getClients");
      const data = await response.json();
      setClients(data);
      setFilteredClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);  
    }
  };

  const handleEdit = (client) => {
    setEditClient(client.id);
    setFormData({
      ...client,
      start_date: client.start_date
        ? new Date(client.start_date).toISOString().slice(0, 10)
        : "",
      first_rent_date: client.first_rent_date
        ? new Date(client.first_rent_date).toISOString().slice(0, 10)
        : "",
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/updateClient/${editClient}`,
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
      fetchClients();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating client:", error);
      alert("Failed to update client");
    }
  };

  const handleGenerateDocument = async (clientId) => {
    console.log(`Generating document for client ID: ${clientId}`);
    try {
      const response = await fetch(
        `http://localhost:5000/generateDocument/${clientId}`,
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
      link.setAttribute("download", `client_${clientId}_rent_agreement.docx`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error generating document:", error);
      alert("Failed to generate document");
    }
  };

  const handleDelete = async (clientId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this client?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:5000/deleteClient/${clientId}`,
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
            <h1>RENT FORM DETAILS</h1>
          </div>
          <div>
            <Link to="/rent_form" className="add-client-btn">
              + Create Rent Form
            </Link>
          </div>
        </div>
        <div className="card-container">
          <div className="search-pagination">
            <div className="rent-search">
              <label className="search-client-label">Search Details:</label>
              <input
                type="text"
                className="search-input"
                placeholder="Search by Lessor or Lessee Name"
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
                <th>Lessor Name</th>
                <th>Lessee Name</th>
                <th>Property Location</th>
                <th>Lease Term</th>
                <th>Rent Amount</th>
                <th>Interest Rate</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentClients.map((client) => (
                <tr key={client.id}>
                  <td>{client.lessor_name}</td>
                  <td>{client.lessee_name}</td>
                  <td>{client.property_location}</td>
                  <td>{client.lease_term}</td>
                  <td>{client.rent_amount}</td>
                  <td>{client.interest_rate}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(client)}
                    >
                      Edit
                    </button>{" "}
                    <br />
                    <button
                      className="delete-btn "
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
                <h3 className="modal-title">Edit Client Details</h3>
                <form className="edit-client-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Lessor Name:</label>
                      <input
                        className="form-input"
                        type="text"
                        name="lessor_name"
                        value={formData.lessor_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Lessee Name:</label>
                      <input
                        className="form-input"
                        type="text"
                        name="lessee_name"
                        value={formData.lessee_name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Property Location:</label>
                      <input
                        className="form-input"
                        type="text"
                        name="property_location"
                        value={formData.property_location}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Lease Term:</label>
                      <input
                        className="form-input"
                        type="text"
                        name="lease_term"
                        value={formData.lease_term}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Rent Amount:</label>
                      <input
                        className="form-input"
                        type="text"
                        name="rent_amount"
                        value={formData.rent_amount}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Interest Rate:</label>
                      <input
                        className="form-input"
                        type="text"
                        name="interest_rate"
                        value={formData.interest_rate}
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

export default RentDetails;
