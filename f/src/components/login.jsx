// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import '../css/login.css';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: ''
//   });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:5000/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });
//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem('username', data.username);
//         localStorage.setItem('userType', data.userType);

//         // Redirect to workspace after login
//         navigate('/workspace');
//       } else {
//         setError(data.message);
//       }
//     } catch (err) {
//       console.error(err);
//       setError('An error occurred during login. Please try again.');
//     }
//   };

//   return (
//     <div className="login-page">
//       <h1 className="title-login" onClick={() => navigate('/')}>LegalEase</h1>
//       <div className="login-container">
//         <div className="login-right">
//           <h2>Login</h2>
//           {error && <p className="error-message">{error}</p>}
//           <form onSubmit={handleSubmit}>
//             <input
//               type="text"
//               name="username"
//               placeholder="Username"
//               value={formData.username}
//               onChange={handleChange}
//               required
//               className="input-field"
//             />
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className="input-field"
//             />
//             <button type="submit" className="login-btn">Login</button>
//           </form>
//           <div className="forgot-password">
//             <Link to="/forget_password" className="forgot-password">Forgot password?</Link>
//           </div>
//           <p className='signup-name'>New user? &nbsp;
//           <Link to="/signup" className="signup-link">Register now</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    newPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("username", data.username);
        localStorage.setItem("userType", data.userType);

        // Redirect to workspace after login
        navigate("/workspace");
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during login. Please try again.");
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordData.email || !forgotPasswordData.newPassword) {
      alert("Please fill out both fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(forgotPasswordData),
      });

      const data = await response.json();
      console.log("Server response:", data);  
      if (response.ok) {
        alert("Password updated successfully.");
        // Clear the fields and close the modal
        setForgotPasswordData({
          email: "",
          newPassword: "",
        });
        setForgotPasswordModal(false); // Close the modal
      } else {
        alert("Password could not be updated. Please check your email.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
      console.error("Forgot Password error:", error);
    }
  };

  const handleCancelForgotPassword = () => {
    // Clear the fields and close the modal when canceling
    setForgotPasswordData({
      email: "",
      newPassword: "",
    });
    setForgotPasswordModal(false); // Close the modal
  };

  return (
    <div className="login-form-container sign-in-container">
      <form className="form-container" onSubmit={handleSubmit}>
        <h1 className="h1-login">Sign in</h1>
        <input
          className="input-login"
          type="text"
          placeholder="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          className="input-login"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {/* <a href="#">Forgot your password?</a> */}
        <p
          className="forgot-pass-text"
          onClick={() => setForgotPasswordModal(true)}
        >
          {" "}
          Forgot Password?{" "}
        </p>
        <button className="button-login">Sign In</button>
      </form>

      {forgotPasswordModal && (
        <div className="forgot-pass-modal">
          <div className="forgot-pass-content">
            <h2>Reset Password</h2>
            <label className="forgot-pass-label">Email</label>
            <input
              type="email"
              name="email"
              value={forgotPasswordData.email}
              onChange={handleForgotPasswordChange}
              className="forgot-pass-input"
              required
            />{" "}
            <br></br>
            <label className="forgot-pass-label">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={forgotPasswordData.newPassword}
              onChange={handleForgotPasswordChange}
              className="forgot-pass-input"
              required
            />
            <button
              onClick={handleForgotPassword}
              className="forgot-pass-update-btn"
            >
              Update
            </button>
            <button
              onClick={handleCancelForgotPassword}
              className="forgot-pass-cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
