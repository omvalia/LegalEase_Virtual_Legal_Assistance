import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import '../css/TaskStatistics.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registering necessary chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const TaskStatistics = () => {
  const username = localStorage.getItem("username");

  const [taskData, setTaskData] = useState({
    completed: 0,
    pending: 0,
    inProgress: 0,
    total: 0,
  });

  const [casesByStatus, setCasesByStatus] = useState({
    Closed: 0,
    'In Progress': 0,
    'On Hold': 0,
    Adjourned: 0,
    Dismissed: 0,
    Settled: 0,
    Reopened: 0,
  });

  const [isDataAvailable, setIsDataAvailable] = useState(false);

  useEffect(() => {
    // Fetch task statistics from the API
    fetch('http://localhost:5000/task-stats')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(stats => {
        // Check if the task data belongs to the current user
        if (stats[username]) {
          setTaskData({
            completed: stats[username].Completed || 0,
            pending: stats[username].Pending || 0,
            inProgress: stats[username]['In Progress'] || 0,
            total: stats[username].total || 0,
          });
          setIsDataAvailable(true);
        }
      })
      .catch(error => {
        console.error("Error fetching task statistics:", error);
        setIsDataAvailable(false);
      });

    // Fetch cases per status statistics
    fetch('http://localhost:5000/cases-per-status')
      .then(response => response.json())
      .then(data => {
        // Check if the cases data belongs to the current user
        if (data[username]) {
          setCasesByStatus(data[username]);
        }
      })
      .catch(error => {
        console.error("Error fetching cases per status:", error);
      });
  }, [username]);

  if (!isDataAvailable) {
    return (
      <div className="task-statistics-container">
        <h2>No data available for the current user.</h2>
      </div>
    );
  }

  // Data for Task Doughnut Chart
  const taskDataChart = {
    labels: ['Completed', 'Pending', 'In Progress'],
    datasets: [
      {
        data: [taskData.completed, taskData.pending, taskData.inProgress],
        backgroundColor: ['#007bff', '#ffc107', '#fd7e14'],
        hoverBackgroundColor: ['#007bff', '#ffc107', '#fd7e14'],
        borderWidth: 1,
      },
    ],
  };

  // Options for Task Doughnut Chart
  const taskOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false, // Hide default legend to use a custom one
      },
    },
  };

  // Data for Cases By Status Doughnut Chart (only if data exists for the current user)
  const casesDataChart = {
    labels: ['Closed', 'In Progress', 'On Hold', 'Adjourned', 'Dismissed', 'Settled', 'Reopened'],
    datasets: [
      {
        data: [
          casesByStatus.Closed,
          casesByStatus['In Progress'],
          casesByStatus['On Hold'],
          casesByStatus.Adjourned,
          casesByStatus.Dismissed,
          casesByStatus.Settled,
          casesByStatus.Reopened,
        ],
        backgroundColor: ['#dc3545', '#ffc107', '#28a745', '#17a2b8', '#6c757d', '#007bff', '#fd7e14'],
        hoverBackgroundColor: ['#dc3545', '#ffc107', '#28a745', '#17a2b8', '#6c757d', '#007bff', '#fd7e14'],
        borderWidth: 1,
      },
    ],
  };

  const taskStatistics = {
    total: taskData.total,
    completed: taskData.completed,
    pending: taskData.pending,
    inProgress: taskData.inProgress,
  };

  return (
    <div className="task-statistics-container">
      {/* Task Statistics Section */}
      <div className="task-statistics">
        <h2 className="title-stats">Task Statistics</h2>
        <div className="chart-container">
          <Doughnut data={taskDataChart} options={taskOptions} />
          <div className="inner-circle">
            {/* <strong>{taskStatistics.total}</strong> */}
            {/* <span>Total Tasks</span> */}
          </div>
        </div>
        <div className="legend">
          {['Completed', 'Pending', 'In Progress'].map((label, index) => (
            <div key={index} className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: taskDataChart.datasets[0].backgroundColor[index] }}
              ></span>
              {label}: {taskStatistics[label.toLowerCase()]} tasks
            </div>
          ))}
        </div>
      </div>

      {/* Cases Per Status Section (only if data exists for the current user) */}
      {casesByStatus && Object.keys(casesByStatus).length > 0 ? (
        <div className="cases-statistics">
          <h2 className="title-stats">Cases Per Status</h2>
          <div className="chart-container">
            <Doughnut data={casesDataChart} options={taskOptions} />
            <div className="inner-circle"></div>
          </div>
          <div className="legend cases-legend">
            {casesDataChart.labels.map((label, index) => (
              <div key={index} className="legend-item">
                <span
                  className="legend-color"
                  style={{ backgroundColor: casesDataChart.datasets[0].backgroundColor[index] }}
                ></span>
                {label}: {casesDataChart.datasets[0].data[index]} cases
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="cases-statistics">
          {/* <h2>No cases data available for the current user.</h2> */}
        </div>
      )}
    </div>
  );
};

export default TaskStatistics;




