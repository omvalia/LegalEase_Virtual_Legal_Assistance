import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar";
import WorkspaceNavigation from "./workspace_naviagtion";
import "../css/casetable.css";

const CaseTable = () => {
  const [cases, setCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCases, setFilteredCases] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCnrModalOpen, setIsCnrModalOpen] = useState(false);
  const [editCase, setEditCase] = useState(null);
  const [formData, setFormData] = useState({
    filling_number: "",
    filling_date: "",
    cnr_number: "",
    first_hearing_date: "",
    next_hearing_date: "",
    case_status: "", // This will now be a dropdown
    court_name: "",
    judge_name: "",
    petitioner_name: "",
    petitioner_advocate_name: "",
    respondent_name: "",
    respondent_advocate_name: "",
    session_notes: "",
    lawyer_username: "",
  });

  const [cnrDetails, setCnrDetails] = useState(null);

  const username = localStorage.getItem("username");

  useEffect(() => {
    fetch("http://localhost:5000/cases")
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter(
          (client) => client.lawyer_username === username
        );
        setCases(filteredData);
        setFilteredCases(filteredData);
      })
      .catch((error) => console.error("Error fetching cases:", error));
  }, [username]);

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);
    const filtered = cases.filter(
      (caseData) =>
        caseData.petitioner_name.toLowerCase().includes(searchValue) ||
        caseData.respondent_name.toLowerCase().includes(searchValue)
    );
    setFilteredCases(filtered);
  };

  const handleDelete = (filling_number) => {
    if (window.confirm("Are you sure you want to delete this case?")) {
      fetch(`http://localhost:5000/delete-case/${filling_number}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then(() => {
          const updatedCases = cases.filter(
            (caseData) => caseData.filling_number !== filling_number
          );
          setCases(updatedCases);
          setFilteredCases(updatedCases);
        })
        .catch((error) => console.error("Error deleting case:", error));
    }
  };

  const handleEdit = (caseData) => {
    setEditCase(caseData.filling_number);
    setFormData(caseData);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/update-case/${editCase}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update case");

      alert("Case details updated successfully");
      setEditCase(null);
      setIsModalOpen(false);
      const updatedCases = cases.map((caseData) =>
        caseData.filling_number === editCase
          ? { ...caseData, ...formData }
          : caseData
      );
      setCases(updatedCases);
      setFilteredCases(updatedCases);
    } catch (error) {
      console.error("Error updating case:", error);
      alert("Failed to update case");
    }
  };

  const handleCnrClick = (caseData) => {
    setCnrDetails(caseData);
    setIsCnrModalOpen(true);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCases = Array.isArray(filteredCases)
    ? filteredCases.slice(startIndex, startIndex + pageSize)
    : [];
  const totalPages = Math.ceil((filteredCases.length || 0) / pageSize);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Define case status options for the dropdown
  const caseStatusOptions = [
    { value: "", label: "Select Status" },
    { value: "Open", label: "Open" },
    { value: "Closed", label: "Closed" },
    { value: "Pending", label: "Pending" },
    { value: "Resolved", label: "Resolved" },
    // Add more statuses as needed
  ];

  return (
    <>
      <Navbar />
      <div className="main-case-content">
        <div className="case-sidebar">
          <WorkspaceNavigation />
        </div>

        <div className="content-container">
          <div className="case-header-section">
            <div className="client-table-title">
              <h1>View Your Cases</h1>
            </div>
            <div>
              <Link to="/CaseForm" className="add-client-btn">
                + Add Cases
              </Link>
            </div>
          </div>

          <div className="case-card-container">
            <div className="case-pagination-controls">
              <label className="case-search-label">Search Cases:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by Petitioner or Respondent"
                className="case-search-input"
              />
              <div className="case-pagination-controls">
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
            <table className="case-table">
              <thead className="case-table-header">
                <tr>
                  <th className="case-table-header-cell">Filing Number</th>
                  <th className="case-table-header-cell">Filing Date</th>
                  <th className="case-table-header-cell">Petitioner</th>
                  <th className="case-table-header-cell">Respondent</th>
                  <th className="case-table-header-cell">Case Status</th>
                  <th className="case-table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="case-table-body">
                {paginatedCases.map((caseData) => (
                  <tr className="case-table-row" key={caseData.filling_number}>
                    <td className="case-table-cell">
                      {caseData.filling_number}
                    </td>
                    <td className="case-table-cell">{caseData.filling_date}</td>
                    <td className="case-table-cell">
                      {caseData.petitioner_name}
                    </td>
                    <td className="case-table-cell">
                      {caseData.respondent_name}
                    </td>
                    <td className="case-table-cell">{caseData.case_status}</td>
                    <td className="case-table-cell action">
                      <button
                        onClick={() => handleEdit(caseData)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(caseData.filling_number)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleCnrClick(caseData)}
                        className="cnr-btn"
                      >
                        View CNR
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal for CNR Details */}
          {/* {isCnrModalOpen && (
            <div className="modal-overlay">
              <div className="case-modal-content">
                <h3 className="case-modal-title">Case Details</h3>
                {cnrDetails && (
                  <div>
                    {Object.entries(cnrDetails).map(([key, value]) => (
                      <p key={key} className="cases-cnr-modal-item">
                        {`${key.replace(/_/g, " ")}: ${value}`}
                      </p>
                    ))}
                  </div>
                )}
                <button
                  className="case-close-modal-btn"
                  onClick={() => setIsCnrModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )} */}

{isCnrModalOpen && (
  <div className="modal-overlay-cnr">
    <div className="case-modal-content-cnr">
      <h3 className="case-modal-title-cnr">Case Details</h3>
      {cnrDetails && (
        <div className="cnr-details-container-cnr">
          {Object.entries(cnrDetails).map(([key, value]) => (
            <div key={key} className="cnr-detail-item-cnr">
              <span className="cnr-detail-label-cnr">
                {key.replace(/_/g, " ")}:
              </span>
              <span className="cnr-detail-value-cnr">{value}</span>
            </div>
          ))}
        </div>
      )}
      <button
        className="case-close-modal-btn"
        onClick={() => setIsCnrModalOpen(false)}
      >
        Close
      </button>
    </div>
  </div>
)}


          {/* Modal for Editing Case Details */}
          {isModalOpen && (
            <div className="modal-overlay-case">
              <div className="case-modal-content-case">
                <h3 className="case-modal-title-case">Edit Case Details</h3>
                <form onSubmit={(e) => e.preventDefault()}>
                  {Object.keys(formData).map((key) => (
                    <div key={key} className="form-field-case">
                      <label>{key.replace(/_/g, " ")}</label>
                      {key === "case_status" ? (
                        <select
                          name={key}
                          value={formData[key]}
                          onChange={handleInputChange}
                        >
                          {caseStatusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={key.includes("date") ? "date" : "text"}
                          name={key}
                          value={formData[key]}
                          onChange={handleInputChange}
                        />
                      )}
                    </div>
                  ))}
                  <div className="form-field-case button-container-case">
                    <button
                      type="button"
                      className="edit-btn"
                      onClick={handleUpdate}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => setIsModalOpen(false)}
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

export default CaseTable;

