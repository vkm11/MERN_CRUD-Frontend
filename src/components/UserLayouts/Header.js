import React, { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import '../../index.css';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
function Header() {
  const navBg = {
    background: 'linear-gradient(#42266d, rgb(85 88 171))',
    filter: 'drop-shadow(-2px 4px 6px black)'
  }

  const [name, setName] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) {
      const username = storedName.split(' ')[0]
      setName(username);
    }
  }, []);
  const handleLogout = async (event) => {
    // Show confirmation dialog
    event.preventDefault();
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to logout?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'No, cancel!',
      allowOutsideClick: false
    });

    if (result.isConfirmed) {
      localStorage.removeItem('token');
      localStorage.removeItem('loginForm');
      localStorage.removeItem('name');

      navigate('/');

      Swal.fire(
        "Logged Out",
        "You have been logged out successfully.",
        'success'
      );
    }
  };

  const navigate = useNavigate();
  return (
    <>
      <div style={navBg}>
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <Link to='/user-dashboard' className="navbar-brand text-white py-0"> <img src="./images/logo3.png" alt='' width="150px" height="50px" /></Link>
            <button className="navbar-toggler py-2 px-2 border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              {/* <span className="navbar-toggler-icon"></span> */}
              <FontAwesomeIcon className='border-0' icon={faBars} style={{ color: "#e93fbb", }} />

            </button>
            <div className="collapse navbar-collapse border-0 fw-bold" id="navbarNavDropdown">
              {/* <Link to='/' className="navbar-brand" >    Ecommerce App</Link> */}
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item px-2">
                  <NavLink to='/user-dashboard' className="nav-link text-light py-1">Home</NavLink>
                </li>
                <li className="nav-item px-2">
                  <NavLink to='/aboutus' className="nav-link text-light py-1">About us</NavLink>
                </li>
                <li className="nav-item px-2">
                  <NavLink to='#' className="nav-link text-light py-1">iTWINE Advantages</NavLink>
                </li>
                <div className="dropdown nav-item px-2">
                  <button className="btn nav-link text-light dropdown-toggle py-1" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                    Solutions
                  </button>

                  <ul className="dropdown-menu py-0" style={{ filter: 'invert(1)', zIndex: 1060}}>
                    <li>
                      <NavLink to='/home' className="dropdown-item py-1 px-2" aria-current="page">E-com</NavLink>
                    </li>
                    <li>
                      <NavLink to='/home' className="dropdown-item py-1 px-2" aria-current="page">Logistics</NavLink>
                    </li>
                    <li>
                      <NavLink to='/home' className="dropdown-item py-1 px-2" aria-current="page">SMS</NavLink>
                    </li>
                    <li>
                      <NavLink to='/home' className="dropdown-item py-1 px-2" aria-current="page">FRM</NavLink>
                    </li>
                    <li>
                      <NavLink to='/home' className="dropdown-item py-1 px-2" aria-current="page">HRMS</NavLink>
                    </li>
                    <li>
                      <NavLink to='/home' className="dropdown-item py-1 px-2" aria-current="page">Social</NavLink>
                    </li>
                    <li>
                      <NavLink to='/home' className="dropdown-item py-1 px-2" aria-current="page">EMR</NavLink>
                    </li>
                    <li>
                      <NavLink to='/home' className="dropdown-item py-1 px-2" aria-current="page">HMS</NavLink>
                    </li>
                  </ul>
                </div>
               



                <li className="nav-item px-2">
                  <NavLink to='#' className="nav-link text-light py-1">Services</NavLink>
                </li>
                <li className="nav-item px-2">
                  <NavLink to='#' className="nav-link text-light py-1">Career</NavLink>
                </li>
              </ul>
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <div className="dropdown nav-item px-2">
                  <button className="btn nav-link text-light dropdown-toggle py-1" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                    {name}
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuButton">
                    <li >
                      <NavLink className="dropdown-item py-1 px-2" onClick={handleLogout} aria-current="page">Logout</NavLink>
                    </li>
                  </ul>
                </div>
              </ul>
            </div>
          </div>
        </nav>
      </div>

    </>
  )
}

export default Header
