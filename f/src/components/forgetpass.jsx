// // ForgetPass.jsx
// import React, { useState } from "react";
// import "../css/forgetpassword.css";

// const ForgetPass = () => {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const handleSendRecoveryLink = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("http://localhost:5000/password-recovery", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setMessage(data.message);
//         setError("");
//       } else {
//         setMessage("");
//         setError(data.error);
//       }
//     } catch (error) {
//       setMessage("");
//       setError("An error occurred. Please try again.");
//     }
//   };

//   return (
//     <div className="forgot-password-page">
//     <div className="forget-pass-container">
//       <h2 className="forget-pass-title">Password Recovery</h2>
//       <p className="forget-pass-subtitle">
//         Enter your registered email to recover your account
//       </p>
//       {message && <div className="alert alert-success">{message}</div>}
//       {error && <div className="alert alert-danger">{error}</div>}
//       <form onSubmit={handleSendRecoveryLink}>
//         <div className="form-group-forget-pass">
//           <input
//             id="email"
//             type="email"
//             className="form-control-forget-pass "
//             placeholder="Enter your registered email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" className="btn btn-primar">
//           Send Recovery Link
//         </button>
//       </form>
//     </div>
//     </div>
//   );
// };

// export default ForgetPass;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/forgetpassword.css";

const ForgetPass = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendRecoveryLink = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/password-recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setError("");
      } else {
        setMessage("");
        setError(data.error);
      }
    } catch (error) {
      setMessage("");
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="forgot-password-page">
      <h1 className="forget-pass-title" onClick={() => navigate('/')}>LegalEase</h1>
      <div className="forget-pass-container">
        <h2 className="forget-pass-title-name">Password Recovery</h2>
        <p className="forget-pass-subtitle">
          Enter your registered email to recover your account
        </p>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSendRecoveryLink}>
          <div className="form-group-forget-pass">
            <input
              id="email"
              type="email"
              className="form-control-forget-pass"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">
            Send Recovery Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPass;
