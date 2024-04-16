import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import '../../index.css';
function Header() {
    const navBg = {
        background: 'linear-gradient(58deg, #5d203d36, #2a228e)'
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg" style={navBg}>
                <div className="container-fluid">
                    <Link to='/' className="navbar-brand text-white py-0"> <img src="./images/logo3.png" alt='' width="150px" height="50px" /></Link>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                        {/* <Link to='/' className="navbar-brand" >    Ecommerce App</Link> */}
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink to='/' className="nav-link text-light py-1">Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to='/create-student' className="nav-link text-light py-1" aria-current="page" >Student</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to='/create-school' className="nav-link text-light py-1" aria-current="page" >School</NavLink>
                            </li>
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