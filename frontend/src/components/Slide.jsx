import React, { useState } from "react";
import { Link } from 'react-router-dom';

import "../css/login_style.css";
import Login from "./login";
import Signup from "./signup";

function Slide() {
  const [type, setType] = useState("signIn");
  const handleOnClick = text => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");
  return (
    <div className="container-login">
    <div className="App-login">
      <div className={containerClass} id="container">
        <Signup />
        <Login />
        <div className="overlay-container-login">
          <div className="overlay-login">
            <div className="overlay-panel overlay-left">
              <h1 className="h1-login">Welcome Back!</h1>
              <p className="p-login">
                To keep connected with us please login with your personal info
              </p>
              <button className="ghost-login"  onClick={() => handleOnClick("signIn")} > Sign In  </button>
              <button className="ghost-login-back"><Link to="/">Homepage</Link></button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="h1-login">You're Just a Few Steps Away!</h1>
              <p className="p-login">Enter your personal details and start journey with us</p>
              <button className="ghost-login" id="signUp" onClick={() => handleOnClick("signUp")} > Sign Up  </button>
              <button className="ghost-login-back"><Link to="/" className="">Homepage</Link></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>  
  );
}

export default Slide;