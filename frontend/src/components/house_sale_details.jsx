import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar";

const HouseSaleDetails = () => {
  // const [agreements, setAgreements] = useState([]);
  // const [filteredAgreements, setFilteredAgreements] = useState([]);
  // const [editAgreement, setEditAgreement] = useState(null);
  // const [formData, setFormData] = useState({
  //   location: "",
  //   day: "",
  //   month: "",
  //   year: "",
  //   vendor_name: "",
  //   vendor_father_name: "",
  //   vendor_address: "",
  //   purchaser_name: "",
  //   purchaser_father_name: "",
  //   purchaser_address: "",
  //   house_no: "",
  //   road_name: "",
  //   sale_price: "",
  //   earnest_money: "",
  //   earnest_money_date: "",
  //   completion_period: "",
  //   title_report_days: "",
  //   refund_days: "",
  //   refund_delay_days: "",
  //   interest_rate: "",
  //   liquidated_damages: "",
  //   witness_1_name: "",
  //   witness_2_name: "",
  //   lawyer_username: "",
  // });

  // const username = localStorage.getItem("username");

  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 5;
  // const [searchTerm, setSearchTerm] = useState("");
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // useEffect(() => {
  //   fetchAgreements();
  // }, []);

  // useEffect(() => {
  //   const result = agreements.filter(
  //     (agreement) =>
  //       agreement.vendor_name
  //         .toLowerCase()
  //         .includes(searchTerm.toLowerCase()) ||
  //       agreement.purchaser_name
  //         .toLowerCase()
  //         .includes(searchTerm.toLowerCase())
  //   );
  //   setFilteredAgreements(result);
  //   setCurrentPage(1);
  // }, [searchTerm, agreements]);

  // const fetchAgreements = async () => {
  //   try {
  //     const response = await fetch("http://localhost:5000/getHouseSaleClients");
  //     const data = await response.json();
  //     setAgreements(data);
  //     setFilteredAgreements(data);
  //   } catch (error) {
  //     console.error("Error fetching agreements:", error);
  //   }
  // };

  const [agreements, setAgreements] = useState([]);
  const [filteredAgreements, setFilteredAgreements] = useState([]);
  const [editAgreement, setEditAgreement] = useState(null);
  const [formData, setFormData] = useState({
    location: "",
    day: "",
    month: "",
    year: "",
    vendor_name: "",
    vendor_father_name: "",
    vendor_address: "",
    purchaser_name: "",
    purchaser_father_name: "",
    purchaser_address: "",
    house_no: "",
    road_name: "",
    sale_price: "",
    earnest_money: "",
    earnest_money_date: "",
    completion_period: "",
    title_report_days: "",
    refund_days: "",
    refund_delay_days: "",
    interest_rate: "",
    liquidated_damages: "",
    witness_1_name: "",
    witness_2_name: "",
    lawyer_username: "",
  });

  const username = localStorage.getItem("username");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAgreements();
  }, []);

  useEffect(() => {
    const result = filteredAgreements.filter(
      (agreement) =>
        agreement.vendor_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        agreement.purchaser_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredAgreements(result);
    setCurrentPage(1);
  }, [searchTerm]);

  // Fetch agreements for the current user (based on username)
  const fetchAgreements = async () => {
    try {
      const response = await fetch("http://localhost:5000/getHouseSaleClients");
      const data = await response.json();

      // Filter agreements to show only those belonging to the current user
      const userAgreements = data.filter(
        (agreement) => agreement.lawyer_username === username
      );

      setAgreements(userAgreements);
      setFilteredAgreements(userAgreements);
    } catch (error) {
      console.error("Error fetching agreements:", error);
    }
  };

  const handleEdit = (agreement) => {
    setEditAgreement(agreement.id);
    const updatedAgreement = {
      ...agreement,
      earnest_money_date: agreement.earnest_money_date
        ? new Date(agreement.earnest_money_date).toISOString().slice(0, 10)
        : "",
    };
    setFormData(updatedAgreement);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/updateHouseSaleClients/${editAgreement}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update agreement");
      }

      alert("Agreement details updated successfully");
      setEditAgreement(null);
      fetchAgreements();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating agreement:", error);
      alert("Failed to update agreement");
    }
  };

  const handleGenerateDocument = async (agreementId) => {
    console.log(`Generating document for client ID: ${agreementId}`);
    try {
      const response = await fetch(
        `http://localhost:5000/generateHouseSaleDocument/${agreementId}`,
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
      link.setAttribute(
        "download",
        `client_${agreementId}_house_sale_agreement.docx`
      );
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error generating document:", error);
      alert("Failed to generate document");
    }
  };

  const handleDelete = async (agreementId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this agreement?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:5000/deleteHouseSaleClients/${agreementId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete agreement");
        }

        alert("Agreement deleted successfully");
        fetchAgreements();
      } catch (error) {
        console.error("Error deleting agreement:", error);
        alert("Failed to delete agreement");
      }
    }
  };

  // Pagination logic
  const indexOfLastAgreement = currentPage * itemsPerPage;
  const indexOfFirstAgreement = indexOfLastAgreement - itemsPerPage;
  const currentAgreements = filteredAgreements.slice(
    indexOfFirstAgreement,
    indexOfLastAgreement
  );
  const totalPages = Math.ceil(filteredAgreements.length / itemsPerPage);

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
            <h1>HOUSE SALES DETAILS</h1>
          </div>
          <div>
            <Link to="/house_sale_form" className="add-client-btn">
              + Create House Sales Form
            </Link>
          </div>
        </div>
        <div className="card-container">
          <div className="search-pagination">
            <div className="rent-search">
              <label className="search-client-label">Search Details:</label>
              <input
                type="text"
                placeholder="Search by Vendor or Purchaser Name"
                className="search-input"
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
                <th>Location</th>
                <th>Vendor Name</th>
                <th>Purchaser Name</th>
                <th>Sale Price</th>
                <th>Completion Period</th>
                <th>Interest Rate</th>
                <th>Witness 1 Name</th>
                <th>Witness 2 Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentAgreements.map((agreement) => (
                <tr key={agreement.id}>
                  <td>{agreement.location}</td>
                  <td>{agreement.vendor_name}</td>
                  <td>{agreement.purchaser_name}</td>
                  <td>{agreement.sale_price}</td>
                  <td>{agreement.completion_period}</td>
                  <td>{agreement.interest_rate}</td>
                  <td>{agreement.witness_1_name}</td>
                  <td>{agreement.witness_2_name}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(agreement)}
                    >
                      Edit
                    </button>
                    <br />
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(agreement.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="cnr-btn"
                      onClick={() => handleGenerateDocument(agreement.id)}
                    >
                      Generate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* {isModalOpen && (
            <div className="house-sale-modal-overlay">
              <div className="house-sale-modal-content">
                <h3>EDIT HOUSE SALE AGREEMENT</h3>
                <form className="agreement-form">
                  <div className="house-sale-form-row">
                    <label className="house-sale-update-form-label">
                      Location: &nbsp;&nbsp;
                      <input
                        type="text"
                        className="house-sale-form-input"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label className="house-sale-update-form-label">
                      Day:
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <input
                        type="text"
                        className="house-sale-form-input"
                        name="day"
                        value={formData.day}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label className="house-sale-update-form-label">
                      Month: &nbsp;&nbsp;&nbsp;&nbsp;
                      <input
                        type="text"
                        className="house-sale-form-input"
                        name="month"
                        value={formData.month}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label className="house-sale-update-form-label">
                      Year: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <input
                        type="text"
                        className="house-sale-form-input"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                  <div className="house-sale-form-row">
                    <label className="house-sale-update-form-label">
                      Vendor Name: &nbsp;&nbsp;
                      <input
                        type="text"
                        className="house-sale-form-input"
                        name="vendor_name"
                        value={formData.vendor_name}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label className="house-sale-update-form-label">
                      Vendor Father Name:{" "}
                      <input
                        type="text"
                        className="house-sale-form-input"
                        name="vendor_father_name"
                        value={formData.vendor_father_name}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label className="house-sale-update-form-label">
                      Vendor Address:{" "}
                      <input
                        type="text"
                        className="house-sale-form-input"
                        name="vendor_address"
                        value={formData.vendor_address}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label className="house-sale-update-form-label">
                      Purchaser Name:{" "}
                      <input
                        type="text"
                        className="house-sale-form-input"
                        name="purchaser_name"
                        value={formData.purchaser_name}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                  <div className="house-sale-form-row">
                    <label className="house-sale-update-form-label">
                      Purchaser Father Name:{" "}
                      <input
                        type="text"
                        className="house-sale-form-input"
                        name="purchaser_father_name"
                        value={formData.purchaser_father_name}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label className="house-sale-update-form-label">
                      Purchaser Address:{" "}
                      <input
                        type="text"
                        className="house-sale-form-input"
                        name="purchaser_address"
                        value={formData.purchaser_address}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label className="house-sale-update-form-label">
                      House No:{" "}
                      <input
                        type="text"
                        className="house-sale-form-input"
                        name="house_no"
                        value={formData.house_no}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label className="house-sale-update-form-label">
                      Road Name:{" "}
                      <input
                        type="text"
                        className="house-sale-form-input"
                        name="road_name"
                        value={formData.road_name}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                  <div className="house-sale-form-row">
                    <label className="house-sale-update-form-label">
                      Sale Price:{" "}
                      <input
                        type="text"
                        className="house-sale-form-input"
                        name="sale_price"
                        value={formData.sale_price}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label className="house-sale-update-form-label">
                      Earnest Money:{" "}
                      <input
                        type="text"
                        className="house-sale-form-input"
                        name="earnest_money"
                        value={formData.earnest_money}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label className="house-sale-update-form-label">
                      Earnest Money Date:{" "}
                      <input
                        type="date"
                        className="house-sale-form-input"
                        name="earnest_money_date"
                        value={formData.earnest_money_date}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label className="house-sale-update-form-label">
                      Completion Period:{" "}
                      <input
                        type="text"
                        className="house-sale-form-input"
                        name="completion_period"
                        value={formData.completion_period}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                  <div className="house-sale-form-row">
                    <label className="house-sale-update-form-label">
                      Title Report Days:{" "}
                      <input
                        type="text"
                        className="house-sale-form-input"
                        name="title_report_days"
                        value={formData.title_report_days}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label className="house-sale-update-form-label">
                      Refund Days:{" "}
                      <input
                        type="text"
                        className="house-sale-form-input"
                        name="refund_days"
                        value={formData.refund_days}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label className="house-sale-update-form-label">
                      Refund Delay Days:{" "}
                      <input
                        type="text"
                        className="house-sale-form-input"
                        name="refund_delay_days"
                        value={formData.refund_delay_days}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label className="house-sale-update-form-label">
                      Interest Rate:{" "}
                      <input
                        type="text"
                        className="house-sale-form-input"
                        name="interest_rate"
                        value={formData.interest_rate}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                  <div className="house-sale-form-row">
                    <label className="house-sale-update-form-label">
                      Liquidated Damages:{" "}
                      <input
                        type="text"
                        className="house-sale-form-input"
                        name="liquidated_damages"
                        value={formData.liquidated_damages}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label className="house-sale-update-form-label">
                      Witness 1 Name:{" "}
                      <input
                        type="text"
                        className="house-sale-form-input"
                        name="witness_1_name"
                        value={formData.witness_1_name}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label className="house-sale-update-form-label">
                      Witness 2 Name:{" "}
                      <input
                        type="text"
                        className="house-sale-form-input"
                        name="witness_2_name"
                        value={formData.witness_2_name}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      <label></label>
                    </label>
                  </div>
                  <button
                    type="button"
                    className="house-sale-update-btn"
                    onClick={handleUpdate}
                  >
                    Update
                  </button>
                  &nbsp;&nbsp;
                  <button
                    type="button"
                    className="house-sale-cancel-btn"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          )} */}
          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3 className="modal-title">EDIT HOUSE SALE AGREEMENT</h3>
                <form className="edit-client-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Location:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Day:</label>
                      <input
                        type="text"
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
                        type="text"
                        className="form-input"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Vendor Name:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="vendor_name"
                        value={formData.vendor_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Vendor Father Name:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="vendor_father_name"
                        value={formData.vendor_father_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Vendor Address:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="vendor_address"
                        value={formData.vendor_address}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Purchaser Name:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="purchaser_name"
                        value={formData.purchaser_name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        Purchaser Father Name:
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        name="purchaser_father_name"
                        value={formData.purchaser_father_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Purchaser Address:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="purchaser_address"
                        value={formData.purchaser_address}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">House No:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="house_no"
                        value={formData.house_no}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Road Name:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="road_name"
                        value={formData.road_name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Sale Price:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="sale_price"
                        value={formData.sale_price}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Earnest Money:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="earnest_money"
                        value={formData.earnest_money}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Earnest Money Date:</label>
                      <input
                        type="date"
                        className="form-input"
                        name="earnest_money_date"
                        value={formData.earnest_money_date}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Completion Period:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="completion_period"
                        value={formData.completion_period}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Title Report Days:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="title_report_days"
                        value={formData.title_report_days}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Refund Days:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="refund_days"
                        value={formData.refund_days}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Refund Delay Days:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="refund_delay_days"
                        value={formData.refund_delay_days}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Interest Rate:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="interest_rate"
                        value={formData.interest_rate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Liquidated Damages:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="liquidated_damages"
                        value={formData.liquidated_damages}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Witness 1 Name:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="witness_1_name"
                        value={formData.witness_1_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Witness 2 Name:</label>
                      <input
                        type="text"
                        className="form-input"
                        name="witness_2_name"
                        value={formData.witness_2_name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button
                      type="button"
                      className="submit-btn-clients"
                      onClick={handleUpdate}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      className="cancel-btn-clients"
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

export default HouseSaleDetails;
