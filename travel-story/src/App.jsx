import {BrowserRouter as Router,Routes,Route,Navigate} from "react-router-dom"
import React from 'react'
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home/Home";
import './index.css';
import Explore from "./pages/Home/Explore";

// Function to check if token is valid
const isTokenValid = () => {
  const token = localStorage.getItem("token");
  const tokenExpiry = localStorage.getItem("tokenExpiry");

  if (!token || !tokenExpiry) return false; // No token or expiry found

  // Check if the token expiry time has passed
  if (Date.now() > parseInt(tokenExpiry, 10)) {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    return false; // Token is expired
  }
  
  return true; // Token is valid
};

// Root component to handle initial redirection
const Root = () => {
  return isTokenValid() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" exact element={<Root/>} />
          <Route path="/dashboard" exact element={<Home/>} />
          <Route path="/login" exact element={<Login/>} />
          <Route path="/signup" exact element={<SignUp/>} />
          <Route path="/explore" exact element={<Explore/>} />
        </Routes>
      </Router>
    </div>
  )
}


export default App