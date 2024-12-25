import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/workspace_navigation.css";
import {
  FaHandshake,
  FaGavel,
  FaTasks,
  FaCalendarAlt,
  FaUsers,
  FaCog, // Import the Edit Profile icon

} from "react-icons/fa";

function WorkspaceNavigation() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username"); // Retrieve the username from localStorage

  return (
    <div className="workspace-navigation">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Welcome {username ? username : "your"} </h2>
          <h2>Manage your Workspace</h2>
        </div>
        <ul className="nav-list">
          <li>
            <Link to="/workspace" className="nav-link">
              <FaUsers className="icon" />
              <span className="nav-name">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/our_client" className="nav-link">
              <FaHandshake className="icon" />
              <span className="nav-name">Clients</span>
            </Link>
          </li>
          <li>
            <Link to="/CaseTable" className="nav-link">
              <FaGavel className="icon" />
              <span className="nav-name">Cases</span>
            </Link>
          </li>
          <li>
            <Link to="/tasks" className="nav-link">
              <FaTasks className="icon" />
              <span className="nav-name">Tasks</span>
            </Link>
          </li>
          <li>
            <Link to="/appointments" className="nav-link">
              <FaCalendarAlt className="icon" />
              <span className="nav-name">Appointments</span>
            </Link>
          </li>
          {/* Edit Profile Link */}
          <li>
            <Link to="/edit-profile" className="nav-link">
              <FaCog className="icon" />
              <span className="nav-name icon-bottom">Edit Profile</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default WorkspaceNavigation;

