import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar";

const AdoptionDeedTable = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [editClient, setEditClient] = useState(null);
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
    lawyer_username: "",
  });

  // const username = localStorage.getItem("username");

  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 5;
  // const [searchTerm, setSearchTerm] = useState("");
  // const [isModalOpen, setIsModalOpen] = useState(false); // New state for modal visibility

  // useEffect(() => {
  //   fetchClients();
  // }, []);

  // useEffect(() => {
  //   const result = clients.filter(
  //     (client) =>
  //       client.adoptive_father_name
  //         .toLowerCase()
  //         .includes(searchTerm.toLowerCase()) ||
  //       client.natural_mother_name
  //         .toLowerCase()
  //         .includes(searchTerm.toLowerCase())
  //   );
  //   setFilteredClients(result);
  //   setCurrentPage(1);
  // }, [searchTerm, clients]);

  // const fetchClients = async () => {
  //   try {
  //     const response = await fetch("http://localhost:5000/getAdoption");
  //     const data = await response.json();
  //     const userClients = data.filter(client => client.lawyer_username === username);
  //     setClients(data);
  //     setFilteredClients(data);
  //   } catch (error) {
  //     console.error("Error fetching clients:", error);
  //   }
  // };

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
        (client.adoptive_father_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
          client.natural_mother_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    );
    setFilteredClients(result);
    setCurrentPage(1);
  }, [searchTerm, clients, username]); // Ensure that 'username' is included in the dependencies

  const fetchClients = async () => {
    try {
      const response = await fetch("http://localhost:5000/getAdoption");
      const data = await response.json();
      // Filter initially by lawyer_username to avoid displaying unrelated records
      const userClients = data.filter(
        (client) => client.lawyer_username === username
      );
      setClients(userClients);
      setFilteredClients(userClients);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleEdit = (client) => {
    setEditClient(client.deed_id);
    const updatedClient = {
      ...client,
      place_of_execution: client.place_of_execution || "",
      day: client.day || "",
      month: client.month || "",
      year: client.year || "",
      adoptive_father_name: client.adoptive_father_name || "",
      adoptive_father_residence: client.adoptive_father_residence || "",
      adoptive_father_address: client.adoptive_father_address || "",
      natural_mother_name: client.natural_mother_name || "",
      natural_mother_residence: client.natural_mother_residence || "",
      natural_mother_address: client.natural_mother_address || "",
      adopted_son_name: client.adopted_son_name || "",
      former_husband_name: client.former_husband_name || "",
      marriage_location: client.marriage_location || "",
      former_name: client.former_name || "",
      petition_number: client.petition_number || "",
      divorce_court_location: client.divorce_court_location || "",
      exhibit_number: client.exhibit_number || "",
      court_location: client.court_location || "",
      witness1_name: client.witness1_name || "",
      witness2_name: client.witness2_name || "",
      witness3_name: client.witness3_name || "",
      marriage_date: client.marriage_date
        ? new Date(client.marriage_date).toISOString().slice(0, 10)
        : "",
      adopted_son_dob: client.adopted_son_dob
        ? new Date(client.adopted_son_dob).toISOString().slice(0, 10)
        : "",
      divorce_date: client.divorce_date
        ? new Date(client.divorce_date).toISOString().slice(0, 10)
        : "",
      marriage_registration_date: client.marriage_registration_date
        ? new Date(client.marriage_registration_date).toISOString().slice(0, 10)
        : "",
      adoption_date: client.adoption_date
        ? new Date(client.adoption_date).toISOString().slice(0, 10)
        : "",
      receipt_number: client.receipt_number || "",
      marriage_registration_location:
        client.marriage_registration_location || "",
    };
    setFormData(updatedClient);
    setIsModalOpen(true); // Open the modal
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/updateAdoption/${editClient}`,
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
      fetchClients(); // Refresh the table after update
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      console.error("Error updating client:", error);
      alert("Failed to update client");
    }
  };

  const handleGenerateDocument = async (clientId) => {
    console.log(`Generating document for client ID: ${clientId}`);
    try {
      const response = await fetch(
        `http://localhost:5000/generateAdoptionDocument/${clientId}`,
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
      link.setAttribute("download", `client_${clientId}_adoption_deed.docx`);
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
          `http://localhost:5000/deleteAdoption/${clientId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete client");
        }

        alert("Client deleted successfully");
        fetchClients(); // Refresh the table after deletion
      } catch (error) {
        console.error("Error deleting client:", error);
        alert("Failed to delete client");
      }
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
            <h1>Adoption Deed Details</h1>
          </div>
          <div>
            <Link to="/adoption_form" className="add-client-btn">
              + Create Adoption Form
            </Link>
          </div>
        </div>
        {/* Search Input */}
        <div className="card-container">
          <div className="search-pagination">
            <div className="rent-search">
              <label className="search-client-label">Search Details:</label>
              <input
                type="text"
                className="search-input"
                placeholder="Search by Adopted Son Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Pagination */}
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
                <th>Place of Execution</th>
                <th>Adoptive Father Name</th>
                <th>Natural Mother Name</th>
                <th>Adopted Son Name</th>
                <th>Adopted Son DOB</th>
                <th>Adoption Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentClients
                .filter((client) => {
                  return client.adopted_son_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                })
                .map((client) => (
                  <tr key={client.deed_id}>
                    <td>{client.place_of_execution}</td>
                    <td>{client.adoptive_father_name}</td>
                    <td>{client.natural_mother_name}</td>
                    <td>{client.adopted_son_name}</td>
                    <td>{client.adopted_son_dob}</td>
                    <td>{client.adoption_date}</td>
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
                        onClick={() => handleDelete(client.deed_id)}
                      >
                        Delete
                      </button>
                      <br />
                      <button
                        className="cnr-btn"
                        onClick={() => handleGenerateDocument(client.deed_id)}
                      >
                        Generate
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {isModalOpen && (
            <div className="modal-overlay modal-adoption-deed">
              <div className="modal-content">
                <h3 className="modal-title">Edit Adoption Deed Details</h3>
                <form className="edit-client-form">
                  {/* First Form Row with 4 input fields */}
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Place of Execution:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="place_of_execution"
                        value={formData.place_of_execution}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Day:</label>
                      <input
                        type="number"
                        className="form-input"
                        name="day"
                        value={formData.day}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Month:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="month"
                        value={formData.month}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Year:</label>
                      <input
                        type="number"
                        className="form-input"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Second Form Row with 4 input fields */}
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        Adoptive Father Name:
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        name="adoptive_father_name"
                        value={formData.adoptive_father_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Natural Mother Name:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="natural_mother_name"
                        value={formData.natural_mother_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Adopted Son Name:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="adopted_son_name"
                        value={formData.adopted_son_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Adopted Son DOB:</label>
                      <input
                        type="date"
                        className="form-input"
                        name="adopted_son_dob"
                        value={formData.adopted_son_dob}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Third Form Row with 4 input fields */}
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Adoption Date:</label>
                      <input
                        type="date"
                        className="form-input"
                        name="adoption_date"
                        value={formData.adoption_date}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Adoptive Father Residence:
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        name="adoptive_father_residence"
                        value={formData.adoptive_father_residence}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Adoptive Father Address:
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        name="adoptive_father_address"
                        value={formData.adoptive_father_address}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Natural Mother Residence:
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        name="natural_mother_residence"
                        value={formData.natural_mother_residence}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Fourth Form Row with 4 input fields */}
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        Natural Mother Address:
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        name="natural_mother_address"
                        value={formData.natural_mother_address}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Former Husband Name:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="former_husband_name"
                        value={formData.former_husband_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Marriage Date:</label>
                      <input
                        type="date"
                        className="form-input"
                        name="marriage_date"
                        value={formData.marriage_date}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Marriage Location:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="marriage_location"
                        value={formData.marriage_location}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Fifth Form Row with 4 input fields */}
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Former Name:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="former_name"
                        value={formData.former_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Petition Number:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="petition_number"
                        value={formData.petition_number}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Divorce Court Location:
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        name="divorce_court_location"
                        value={formData.divorce_court_location}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Exhibit Number:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="exhibit_number"
                        value={formData.exhibit_number}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Sixth Form Row with 4 input fields */}
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Divorce Date:</label>
                      <input
                        type="date"
                        className="form-input"
                        name="divorce_date"
                        value={formData.divorce_date}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Marriage Registration Location:
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        name="marriage_registration_location"
                        value={formData.marriage_registration_location}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Receipt Number:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="receipt_number"
                        value={formData.receipt_number}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Marriage Registration Date:
                      </label>
                      <input
                        type="date"
                        className="form-input"
                        name="marriage_registration_date"
                        value={formData.marriage_registration_date}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Seventh Form Row with 4 input fields */}
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Court Location:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="court_location"
                        value={formData.court_location}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Exhibit Number Date:</label>
                      <input
                        type="date"
                        className="form-input"
                        name="exhibit_number_date"
                        value={formData.exhibit_number_date}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Adoptive Mother's Name:
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        name="adoptive_mother_name"
                        value={formData.adoptive_mother_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Witness Name:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="witness_name"
                        value={formData.witness_name}
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

export default AdoptionDeedTable;
