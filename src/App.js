import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import CreateStudent from "./pages/CreateStudent";
import CreateSchool from "./pages/SchoolMaster"
import Dashboard from "./pages/Dashboard";
function App() {
  return (
    <div className="App">
      {/* <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container">
          <Link to={"/create-student"} className="nav-link">
            React MERN Stack App
          </Link>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to={"/create-student"} className="nav-link">
                  Create Student
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/create-school"} className="nav-link">
                  Add School
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav> */}
      <div className="conatiner-fluid">
        <div className="wrapper">
          <Routes>
            <Route exact path="/" element={<Dashboard />} />
            <Route exact path="/create-student" element={<CreateStudent />} />
            <Route exact path="/create-school" element={<CreateSchool />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
export default App;