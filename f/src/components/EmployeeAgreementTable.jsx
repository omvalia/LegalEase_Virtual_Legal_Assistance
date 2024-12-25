import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar";

const EmployeeAgreementTable = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);
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
    lawyer_username: "",
  });

  const username = localStorage.getItem("username"); 

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const result = employees.filter(
      (employee) =>
        employee.representative_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        employee.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(result);
    setCurrentPage(1);
  }, [searchTerm, employees]);

  // const fetchEmployees = async () => {
  //   try {
  //     const response = await fetch("http://localhost:5000/getEmployees");
  //     const data = await response.json();
      
  //     setEmployees(data);
  //     setFilteredEmployees(data);
  //   } catch (error) {
  //     console.error("Error fetching employees:", error);
  //   }
  // };

  const fetchEmployees = async () => {
    try {
      const username = localStorage.getItem("username");
      
      // Check if username exists and is the expected one
      if (username === username) {  // Replace "expectedUsername" with the actual username to check against
        const response = await fetch("http://localhost:5000/getEmployees");
        const data = await response.json();
  
        setEmployees(data);
        setFilteredEmployees(data);
      } else {
        console.warn("Username does not match, data not displayed.");
        setEmployees([]); // Optionally, clear data if the username does not match
        setFilteredEmployees([]);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleEdit = (employee) => {
    setEditEmployee(employee.id);
    const updatedEmployee = {
      ...employee,
      application_date: employee.application_date
        ? new Date(employee.application_date).toISOString().slice(0, 10)
        : "",
      reporting_date: employee.reporting_date
        ? new Date(employee.reporting_date).toISOString().slice(0, 10)
        : "",
    };
    setFormData(updatedEmployee);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/updateEmployee/${editEmployee}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update employee");
      }

      alert("Employee details updated successfully");
      setEditEmployee(null);
      fetchEmployees();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Failed to update employee");
    }
  };

  const handleGenerateDocument = async (employeeId) => {
    console.log(`Generating document for employee ID: ${employeeId}`);
    try {
      const response = await fetch(
        `http://localhost:5000/generateServiceDocument/${employeeId}`,
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
        `employee_${employeeId}_service_agreement.docx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove(); // Remove the link element after download
    } catch (error) {
      console.error("Error generating document:", error);
      alert("Failed to generate document");
    }
  };

  const handleDelete = async (employeeId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:5000/deleteEmployee/${employeeId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete employee");
        }

        alert("Employee deleted successfully");
        fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error);
        alert("Failed to delete employee");
      }
    }
  };

  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

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
            <h1>Employee Agreement Details</h1>
          </div>
          <div>
            <Link to="/agreement_form" className="add-client-btn">
              + Create Agreement Form
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
                placeholder="Search by Representative or Employee Name"
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
                <th>Company Name</th>
                <th>Representative Name</th>
                <th>Employee Name</th>
                <th>Post Title</th>
                <th>Work Location</th>
                <th>Witness Name 1</th>
                <th>Witness Name 2</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.company_name}</td>
                  <td>{employee.representative_name}</td>
                  <td>{employee.employee_name}</td>
                  <td>{employee.post_title}</td>
                  <td>{employee.work_location}</td>
                  <td>{employee.witness_name1}</td>
                  <td>{employee.witness_name2}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(employee)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(employee.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="cnr-btn"
                      onClick={() => handleGenerateDocument(employee.id)}
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
                <h3>Edit Employee Details</h3>
                <form className="employee-form">
                  <div className="form-row">
                    <label>
                      Place of Execution:
                      <input
                        type="text"
                        name="place_of_execution"
                        value={formData.place_of_execution}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      Day:
                      <input
                        type="number"
                        name="day"
                        value={formData.day}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      Month:
                      <input
                        type="text"
                        name="month"
                        value={formData.month}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      Year:
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                  {/* Additional form fields with modified class names */}
                  <button type="button" onClick={handleUpdate}>
                    Update
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};


export default EmployeeAgreementTable;
