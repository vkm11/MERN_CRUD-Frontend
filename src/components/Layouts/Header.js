import React, { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import '../../index.css';
function Header() {
    const navBg = {
        background: 'linear-gradient(58deg, #5d203d36, #2a228e)'
    }
    // const navbarIcon ={
    //     backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Cpath stroke='rgba(255,255,255,1)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E\")",
    // }


    const [isNavbarOpen, setIsNavbarOpen] = useState(false);

    const handleNavbarToggle = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };

    const navbarIcon = isNavbarOpen ? (
        <span className="btn-close btn-close-white px-2" style={{ transform: 'rotate(45deg)', transition: 'transform 0.3s' }}></span>
    ) : (
        <span className="navbar-toggler-icon" style={{ transform: 'rotate(0deg)', transition: 'transform 0.3s', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 30 30\'%3E%3Cpath stroke=\'rgba(255,255,255,1)\' stroke-linecap=\'round\' stroke-miterlimit=\'10\' stroke-width=\'2\' d=\'M4 7h22M4 15h22M4 23h22\'/%3E%3C/svg%3E")', }}></span>
    );





    return (
        <>
            <nav className="navbar navbar-expand-lg" style={navBg}>
                <div className="container-fluid">
                    <Link to='/' className="navbar-brand text-white py-0"> <img src="./images/logo3.png" alt='' width="150px" height="50px" /></Link>

                    {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" style={navbarIcon}></span>
                    </button> */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarTogglerDemo01"
                        aria-controls="navbarTogglerDemo01"
                        aria-expanded={isNavbarOpen ? 'true' : 'false'}
                        aria-label="Toggle navigation"
                        onClick={handleNavbarToggle}
                    >
                        {navbarIcon}
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                        {/* <Link to='/' className="navbar-brand" >    Ecommerce App</Link> */}
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink to='/' className="nav-link text-light py-1">Home</NavLink>
                            </li>
                            {/* <div className="dropdown nav-item">
                                <a className="btn nav-link text-light dropdown-toggle py-1"  role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                   Masters
                                </a>

                                <ul className="dropdown-menu">
                                    <li className="">
                                        <NavLink to='/create-student' className="text-decoration-none py-1 px-2" aria-current="page" >Student</NavLink>
                                    </li>
                                    <li className="">
                                        <NavLink to='/create-school' className="text-decoration-none py-1 px-2" aria-current="page" >School</NavLink>
                                    </li>
                                </ul>
                            </div> */}
                            <div className="dropdown nav-item">
                                <button className="btn nav-link text-light dropdown-toggle py-1" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                    Masters
                                </button>

                                <ul className="dropdown-menu py-0">
                                    <li>
                                        <NavLink to='/create-student' className="dropdown-item  py-1 px-2" aria-current="page">Student</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/create-school' className="dropdown-item  py-1 px-2" aria-current="page">School</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/create-parent' className="dropdown-item  py-1 px-2" aria-current="page">Parents</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/create-section' className="dropdown-item  py-1 px-2" aria-current="page">Section</NavLink>
                                    </li>
                                   
                                </ul>
                            </div>
                            <div className="dropdown nav-item">
                                <button className="btn nav-link text-light dropdown-toggle py-1" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                    user and management
                                </button>

                                <ul className="dropdown-menu py-0">
                                    <li>
                                        <NavLink to='/create-user' className="dropdown-item py-1 px-2" aria-current="page">User</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/create-role' className="dropdown-item py-1 px-2" aria-current="page">Role</NavLink>
                                    </li>
                                </ul>
                            </div>

                            
                            {/* <li className="nav-item">
                                <NavLink to='/register' className="nav-link text-light" >SignUp</NavLink>
                            </li> */}
                            <li className="nav-item">
                                <NavLink to='/signin' className="nav-link text-light py-1" >SignIn</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to='/signin' className="nav-link text-light py-1" >Logout</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header