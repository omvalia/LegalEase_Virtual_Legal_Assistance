import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import WorkspaceNavigation from "./workspace_naviagtion";
import "../css/workspace_navigation.css";
import "../css/our_client.css";
import Navbar from "./navbar";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [formData, setFormData] = useState({
    task_name: "",
    related_to: "",
    start_date: "",
    deadline: "",
    status: "",
    priority: "",
    lawyer_username: "",
  });

  const username = localStorage.getItem("username");

  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter(
          (client) => client.lawyer_username === username
        ); // Filter based on lawyer_username
        setTasks(filteredData);
        setFilteredTasks(filteredData);
      })
      .catch((error) => console.error("Error fetching clients:", error));
  }, [username]);

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = tasks.filter((task) =>
      task.task_name.toLowerCase().includes(searchValue)
    );
    setFilteredTasks(filtered);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      fetch(`http://localhost:5000/delete-task/${id}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then(() => {
          const updatedTasks = tasks.filter((task) => task.id !== id);
          setTasks(updatedTasks);
          setFilteredTasks(updatedTasks);
        })
        .catch((error) => console.error("Error deleting task:", error));
    }
  };

  const handleEdit = (task) => {
    setEditTask(task.id);
    setFormData(task);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/update-task/${editTask}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      alert("Task details updated successfully");
      setEditTask(null);
      setIsModalOpen(false);

      const updatedTasks = tasks.map((task) =>
        task.id === editTask ? { ...task, ...formData } : task
      );
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task");
    }
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filteredTasks.length / pageSize);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Function to get button styles based on priority
  const getPriorityButtonStyle = (priority) => {
    switch (priority) {
      case "High":
        return {
          backgroundColor: "red",
          color: "white",
        };
      case "Medium":
        return {
          backgroundColor: "yellow",
          color: "black",
        };
      case "Low":
        return {
          backgroundColor: "green",
          color: "white",
        };
      default:
        return {};
    }
  };

  // Function to get button styles based on status
  const getStatusButtonStyle = (status) => {
    switch (status) {
      case "Completed":
        return {
          backgroundColor: "green",
          color: "white",
        };
      case "Pending":
        return {
          backgroundColor: "red",
          color: "white",
        };
      case "In Progress":
        return {
          backgroundColor: "yellow",
          color: "black",
        };
      default:
        return {};
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
              <h1>View Your Tasks</h1>
            </div>
            <div>
              <Link to="/AddTaskForm" className="add-client-btn">
                + Add Task
              </Link>
            </div>
          </div>

          {/* Card Container for Search, Pagination, and Table */}
          <div className="card-container">
            {/* Search and Pagination section */}
            <div className="search-pagination">
              <label className="search-client-label">Search Tasks:</label>
              <input
                type="text"
                className="search-input"
                placeholder="Search by Task Name"
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
                  <th className="client-table-header-cell">No</th>
                  <th className="client-table-header-cell">Task Name</th>
                  <th className="client-table-header-cell">Related To</th>
                  <th className="client-table-header-cell">Start Date</th>
                  <th className="client-table-header-cell">Deadline</th>
                  <th className="client-table-header-cell">Status</th>
                  <th className="client-table-header-cell">Priority</th>
                  <th className="client-table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="client-table-body">
                {paginatedTasks.map((task, index) => (
                  <tr className="client-table-row" key={task.id}>
                    <td className="client-table-cell">
                      {startIndex + index + 1}
                    </td>
                    <td className="client-table-cell">{task.task_name}</td>
                    <td className="client-table-cell">{task.related_to}</td>
                    <td className="client-table-cell">{task.start_date}</td>
                    <td className="client-table-cell">{task.deadline}</td>
                    <td className="client-table-cell">
                      <button
                        style={{
                          ...getStatusButtonStyle(task.status),
                          padding: "5px 10px",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        {task.status}
                      </button>
                    </td>
                    <td className="client-table-cell">
                      <button
                        style={{
                          ...getPriorityButtonStyle(task.priority),
                          padding: "5px 10px",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        {task.priority}
                      </button>
                    </td>
                    <td className="client-table-cell action">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(task.id)}
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
            <h3 className="modal-title">Edit Task Details</h3>
            <form className="edit-client-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Task Name:</label>
                  <input
                    className="form-input"
                    type="text"
                    name="task_name"
                    value={formData.task_name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Related To:</label>
                  <input
                    className="form-input"
                    type="text"
                    name="related_to"
                    value={formData.related_to}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Start Date:</label>
                  <input
                    className="form-input"
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Deadline:</label>
                  <input
                    className="form-input"
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Status:</label>
                  <select
                    className="form-input"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority:</label>
                  <select
                    className="form-input"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button
                  className="submit-btn-clients"
                  type="button"
                  onClick={handleUpdate}
                >
                  Update
                </button>
                <button
                  className="cancel-btn-clients"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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

export default Tasks;
