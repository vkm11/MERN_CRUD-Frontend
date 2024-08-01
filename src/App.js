import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import CreateStudent from "./pages/admin-pages/CreateStudent";
import CreateSchool from "./pages/admin-pages/SchoolMaster"
import Dashboard from "./pages/admin-pages/Dashboard";
import CreateParent from "./pages/admin-pages/Parents";
import CreateRole from "./pages/admin-pages/Roles";
import CreateSection from "./pages/admin-pages/Section"
import Teacher from "./pages/admin-pages/Teacher";
import CreateUsers from "./pages/admin-pages/Users";
import Login from "./auth/Login";
import Register from "./auth/Register";

// user 
import UserDashboard from './pages/user-pages/UserDashboard'
function App() {
  
  return (
    <div className="App">
      <div className="conatiner-fluid">
        <div className="wrapper">
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/admin-dashboard" element={<Dashboard />} />
            <Route exact path="/create-student" element={<CreateStudent />} />
            <Route exact path="/create-school" element={<CreateSchool />} />
            <Route exact path="/create-user" element={<CreateUsers />} />
            <Route exact path="/create-parent" element={<CreateParent />} />
            <Route exact path="/create-role" element={<CreateRole />} />
            <Route exact path="/create-section" element={<CreateSection />} />
            <Route exact path="/teacher" element={<Teacher />} />

            <Route exact path="/user-dashboard" element={<UserDashboard />} />

          </Routes>
        </div>
      </div>
    </div>
  );
}
export default App;