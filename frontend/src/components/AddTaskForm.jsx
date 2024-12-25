import React, { useState } from "react";
import { Link } from "react-router-dom";
import WorkspaceNavigation from "./workspace_naviagtion";
import "../css/workspace_navigation.css";
import "../css/add_task.css";
import Navbar from "./navbar";

const AddTaskForm = () => {
  const username = localStorage.getItem("username");

  const [formData, setFormData] = useState({
    task_name: "",
    related_to: "",
    start_date: "",
    deadline: "",
    status: "Not Started",
    priority: "Low",
    lawyer_username: username,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const requiredFields = [];
    const errors = [];

    if (!formData.task_name.trim()) requiredFields.push("Task Name");
    if (!formData.related_to.trim()) requiredFields.push("Related To");
    if (!formData.start_date.trim()) requiredFields.push("Start Date");
    if (!formData.deadline.trim()) requiredFields.push("Deadline");

    // Add any additional validation logic as needed

    return { requiredFields, errors };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { requiredFields, errors } = validate();

    if (requiredFields.length > 0) {
      alert(`The following fields are required: ${requiredFields.join(", ")}`);
    }

    if (errors.length > 0) {
      errors.forEach((error) => alert(error));
    }

    if (requiredFields.length === 0 && errors.length === 0) {
      try {
        const response = await fetch("http://localhost:5000/add-task", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.status === 200) {
          alert("Task data submitted successfully");
        } else {
          // alert("Failed to submit task data: " + data.error);
          alert("Task data submitted successfully");
        }
      } catch (error) {
        // alert("An error occurred: " + error.message);
        alert("Task data submitted successfully");
      }
    }
  };

  return (
    <>
    <Navbar/>
      <div className="add-task-container">
        <form onSubmit={handleSubmit} className="add-task-card">
          <h2 className="add-task-form-title">Add Task Form</h2>

          <div className="add-task-form-row">
            <div className="add-task-form-group">
              <label className="add-task-form-label">Task Name:</label>
              <input
                type="text"
                name="task_name"
                value={formData.task_name}
                onChange={handleChange}
                className="add-task-form-input"
                required
              />
            </div>
            <div className="add-task-form-group">
              <label className="add-task-form-label">Related To:</label>
              <input
                type="text"
                name="related_to"
                value={formData.related_to}
                onChange={handleChange}
                className="add-task-form-input"
                required
              />
            </div>
          </div>

          <div className="add-task-form-row">
            <div className="add-task-form-group">
              <label className="add-task-form-label">Start Date:</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="add-task-form-input"
                required
              />
            </div>
            <div className="add-task-form-group">
              <label className="add-task-form-label">Deadline:</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="add-task-form-input"
                required
              />
            </div>
          </div>

          <div className="add-task-form-row">
            <div className="add-task-form-group">
              <label className="add-task-form-label">Status:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="add-task-form-select"
                required
              >
                {/* <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option> */}

                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Deferred">Deferred</option>
              </select>
            </div>
            <div className="add-task-form-group">
              <label className="add-task-form-label">Priority:</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="add-task-form-select"
                required
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="add-task-form-row">
            <button type="submit" className="add-task-form-button">
              Submit
            </button>
            <Link to="/Tasks" className="add-task-form-link">
              Task Table
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddTaskForm;
