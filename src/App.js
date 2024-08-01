import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import CreateStudent from "./pages/CreateStudent";
import CreateSchool from "./pages/SchoolMaster"
import Dashboard from "./pages/Dashboard";
import CreateUsers from "./pages/Users";
import CreateParent from "./pages/Parents";
import CreateRole from "./pages/Roles";
import CreateSection from "./pages/Section"
import Teacher from "./pages/Teacher";
import Login from "./auth/Login";
import Register from "./auth/Register";
function App() {
  
  return (
    <div className="App">
      <div className="conatiner-fluid">
        <div className="wrapper">
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/dashboard" element={<Dashboard />} />
            <Route exact path="/create-student" element={<CreateStudent />} />
            <Route exact path="/create-school" element={<CreateSchool />} />
            <Route exact path="/create-user" element={<CreateUsers />} />
            <Route exact path="/create-parent" element={<CreateParent />} />
            <Route exact path="/create-role" element={<CreateRole />} />
            <Route exact path="/create-section" element={<CreateSection />} />
            <Route exact path="/teacher" element={<Teacher />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
export default App;