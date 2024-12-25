import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/calender.css";

const Calendar = () => {
  const username = localStorage.getItem("username");

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState({});
  const [tasks, setTasks] = useState({});
  const [hearings, setHearings] = useState({}); // New state for hearings
  const [selectedDay, setSelectedDay] = useState(null);
  const [eventInput, setEventInput] = useState("");

  const getStartOfWeek = (date) => {
    const dayOfWeek = date.getDay();
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - dayOfWeek
    );
  };

  const startOfWeek = getStartOfWeek(today);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  useEffect(() => {
    // Fetching appointments
    // axios.get("http://localhost:5000/get_appointments")
    //     .then(response => {
    //         const appointments = response.data;
    //         const updatedEvents = {};
    //         appointments.forEach(appointment => {
    //             const dateKey = formatDate(appointment.appointment_date);
    //             updatedEvents[dateKey] = updatedEvents[dateKey] || [];
    //             updatedEvents[dateKey].push(`Appointment: ${appointment.client_name}`);
    //         });
    //         setEvents(updatedEvents);
    //     })
    //     .catch(error => console.error("Error fetching appointments:", error));

    // Fetching appointments
    axios
      .get("http://localhost:5000/get_appointments")
      .then((response) => {
        const appointments = response.data;
        const updatedEvents = {};
        appointments.forEach((appointment) => {
          // Check if the appointment's username matches the current user's username
          if (appointment.lawyer_username === username) {
            const dateKey = formatDate(appointment.appointment_date);
            updatedEvents[dateKey] = updatedEvents[dateKey] || [];
            updatedEvents[dateKey].push(
              `Appointment: ${appointment.client_name}`
            );
          }
        });
        setEvents(updatedEvents);
      })
      .catch((error) => console.error("Error fetching appointments:", error));

    // Fetching tasks
    axios
      .get("http://localhost:5000/tasks")
      .then((response) => {
        const tasksData = response.data;
        const updatedTasks = {};
        tasksData.forEach((task) => {
          // Filter tasks to only include those with the same lawyer username
          if (task.lawyer_username === username) {
            const dateKey = formatDate(task.start_date);
            updatedTasks[dateKey] = updatedTasks[dateKey] || [];
            updatedTasks[dateKey].push(
              `Task: ${task.task_name} (Priority: ${task.priority})`
            );
          }
        });
        setTasks(updatedTasks);
      })
      .catch((error) => console.error("Error fetching tasks:", error));

    // Fetching cases for next hearing dates
    axios
      .get("http://localhost:5000/cases")
      .then((response) => {
        const cases = response.data;
        const updatedHearings = {};
        cases.forEach((caseItem) => {
          // Filter cases to only include those with the same lawyer username
          if (caseItem.lawyer_username === username) {
            const dateKey = formatDate(caseItem.next_hearing_date);
            updatedHearings[dateKey] = updatedHearings[dateKey] || [];
            updatedHearings[dateKey].push(
              `Next Hearing: ${caseItem.petitioner_name} vs ${caseItem.respondent_name}`
            );
          }
        });
        setHearings(updatedHearings);
      })
      .catch((error) => console.error("Error fetching cases:", error));

    // Fetching tasks
    // axios
    //   .get("http://localhost:5000/tasks")
    //   .then((response) => {
    //     const tasksData = response.data;
    //     const updatedTasks = {};
    //     tasksData.forEach((task) => {
    //       const dateKey = formatDate(task.start_date);
    //       updatedTasks[dateKey] = updatedTasks[dateKey] || [];
    //       updatedTasks[dateKey].push(
    //         `Task: ${task.task_name} (Priority: ${task.priority})`
    //       );
    //     });
    //     setTasks(updatedTasks);
    //   })
    //   .catch((error) => console.error("Error fetching tasks:", error));

    // // Fetching cases for next hearing dates
    // axios
    //   .get("http://localhost:5000/cases")
    //   .then((response) => {
    //     const cases = response.data;
    //     const updatedHearings = {};
    //     cases.forEach((caseItem) => {
    //       const dateKey = formatDate(caseItem.next_hearing_date);
    //       updatedHearings[dateKey] = updatedHearings[dateKey] || [];
    //       updatedHearings[dateKey].push(
    //         `Next Hearing: ${caseItem.petitioner_name} vs ${caseItem.respondent_name}`
    //       );
    //     });
    //     setHearings(updatedHearings);
    //   })
    //   .catch((error) => console.error("Error fetching cases:", error));
  }, [currentMonth, currentYear]);

  const isToday = (date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setEventInput("");
  };

  const handleEventInputChange = (e) => {
    setEventInput(e.target.value);
  };

  const handleAddEvent = () => {
    if (eventInput.trim() === "") return;
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(selectedDay.getDate()).padStart(2, "0")}`;
    setEvents({
      ...events,
      [dateKey]: [...(events[dateKey] || []), eventInput],
    });
    setEventInput("");
    setSelectedDay(null);
  };

  const renderDays = () => {
    let days = [];
    for (let d = 0; d <= 6; d++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + d);
      const dateKey = formatDate(date);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

      days.push(
        <div
          key={d}
          className={`calendar-card ${isToday(date) ? "calendar-today" : ""}`}
          onClick={() => handleDayClick(date)}
        >
          <div className="calendar-card-header">
            <span className="calendar-day-name">{dayName}</span>
          </div>
          <div className="calendar-card-body">
            {/* Displaying appointments, tasks, and hearings */}
            {events[dateKey] &&
              events[dateKey].map((event, index) => (
                <div key={index} className="calendar-event">
                  {event}
                </div>
              ))}
            {tasks[dateKey] &&
              tasks[dateKey].map((task, index) => (
                <div key={index} className="calendar-task">
                  {task}
                </div>
              ))}
            {hearings[dateKey] &&
              hearings[dateKey].map((hearing, index) => (
                <div key={index} className="calendar-hearing">
                  {hearing}
                </div>
              ))}
          </div>
        </div>
      );
    }
    return days;
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>Your Schedule</h2>
      </div>
      <div className="calendar-week">{renderDays()}</div>
    </div>
  );
};

export default Calendar;
