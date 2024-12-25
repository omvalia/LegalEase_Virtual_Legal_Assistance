import React, { useState, useEffect } from "react";
import WorkspaceNavigation from "./workspace_naviagtion.jsx";
import Navbar from "./navbar.jsx";
import Calendar from "./Calender.jsx";
import TaskStatistics from './TaskStatistics.jsx';
import "../css/workspace.css";
import { FaHandshake, FaGavel, FaBalanceScale, FaHourglassHalf, FaClipboardList } from "react-icons/fa";

const Workspace = () => {

  const username = localStorage.getItem("username");

const [clientsCount, setClientsCount] = useState(0);
const [casesCount, setCasesCount] = useState(0);
const [appointmentsCount, setAppointmentsCount] = useState(0);
const [tasksCount, setTasksCount] = useState(0);

useEffect(() => {
  // Fetch clients and filter by lawyer_username
  fetch("http://localhost:5000/clients")
    .then((response) => response.json())
    .then((data) => {
      const filteredClients = data.filter(
        (client) => client.lawyer_username === username
      );
      setClientsCount(filteredClients.length);
    })
    .catch((error) => console.error("Error fetching clients:", error));

  // Fetch cases and filter by lawyer_username
  fetch("http://localhost:5000/cases")
    .then((response) => response.json())
    .then((data) => {
      const filteredCases = data.filter(
        (caseItem) => caseItem.lawyer_username === username
      );
      setCasesCount(filteredCases.length);
    })
    .catch((error) => console.error("Error fetching cases:", error));

  // Fetch tasks and filter by lawyer_username
  fetch("http://localhost:5000/tasks")
    .then((response) => response.json())
    .then((data) => {
      const filteredTasks = data.filter(
        (task) => task.lawyer_username === username
      );
      setTasksCount(filteredTasks.length);
    })
    .catch((error) => console.error("Error fetching tasks:", error));

  // Fetch appointments and filter by lawyer_username
  fetch("http://localhost:5000/get_appointments")
    .then((response) => response.json())
    .then((data) => {
      const filteredAppointments = data.filter(
        (appointment) => appointment.lawyer_username === username
      );
      setAppointmentsCount(filteredAppointments.length);
    })
    .catch((error) => console.error("Error fetching appointments:", error));
}, [username]);


  return (
    <>
      <Navbar />
      <div className="main-content">
        <div className="sidebar">
          <WorkspaceNavigation />
        </div>
        <div className="content-container-dashboard">
          <div className="header-section-dashboard">
            <div className="client-table-title-dashboard">
              <h1>Dashboard</h1>
            </div>
          </div>
          <div className="dashboard-container">
            <div className="info-box client-box">
              <FaHandshake className="icon-workspace" />
              <div className="info-content">
                <h3>My Clients</h3>
                <p>{clientsCount}</p>
              </div>
            </div>
            <div className="info-box cases-box">
              <FaGavel className="icon-workspace" />
              <div className="info-content">
                <h3>Total Cases</h3>
                <p>{casesCount}</p>
              </div>
            </div>
            <div className="info-box tasks-box">
              <FaClipboardList className="icon-workspace" />
              <div className="info-content">
                <h3>Total Tasks</h3>
                <p>{tasksCount}</p>
              </div>
            </div>
            <div className="info-box appointments-box">
              <FaBalanceScale className="icon-workspace" />
              <div className="info-content">
                <h3>Total Appointments</h3>
                <p>{appointmentsCount}</p>
              </div>
            </div>
          </div>
          <div>
            <TaskStatistics />
            <Calendar />
          </div>
        </div>
      </div>
    </>
  );
};

export default Workspace;



