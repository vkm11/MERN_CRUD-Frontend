# fontawesome:

npm install --save @fortawesome/fontawesome-svg-core
npm install --save @fortawesome/free-solid-svg-icons
npm install --save @fortawesome/react-fontawesome


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';


  <div>
      <h1>Hello World</h1>
      <FontAwesomeIcon icon={faCoffee} />
      </div>

## React icons
npm install react-icons --save
npm install react-icons/fa --save

## Pagination
npm install react-js-pagination

import Pagination from "react-js-pagination";

## Sweetalert
npm install sweetalert2

import Swal from 'sweetalert2';





# login.js
import React, { useState, useEffect, useCallback } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import "../App.css";
import axios from 'axios';

function Login() {
    const clearForm = {
        email: "",
        password: "",
        role: "",
    };
    const clearForgotForm = {
        username: "",
        newpassword: "",
        confirmpassword: "",
    }

    const [isFlipped, setIsFlipped] = useState(false);
    const [loginForm, setLoginForm] = useState(clearForm);
    const [forgotpswForm, setForgotpswForm] = useState(clearForgotForm)
    const [currentView, setCurrentView] = useState('signIn');
    const [showPassword, setShowPassword] = useState(false);
    const [newshowPassword, setNewshowPassword] = useState(false);
    const [confirmshowPassword, setConfirmshowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Memoize the checkTokenValidity function
    const checkTokenValidity = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const apiUrl = "http://localhost:4000/auth/verify-token";
            await axios.get(apiUrl, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            if (error.response?.status === 401) {
                // Token is expired or invalid
                setErrorMessage('Session expired. Please log in again.');
                localStorage.removeItem('token');
                localStorage.removeItem('loginForm');
                setTimeout(() => {
                    navigate('/')
                    setErrorMessage('')
                }, 1000)
            } else {
                // Handle other errors if needed
                setErrorMessage('An error occurred. Please try again.');
            }
        }
    }, [navigate]);

    useEffect(() => {
        const savedForm = JSON.parse(localStorage.getItem('loginForm'));
        if (savedForm) {
            setLoginForm(savedForm);
            setRememberMe(true);
        }

        // Check token validity on component mount
        checkTokenValidity();
    }, [checkTokenValidity]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const confirmPswd = () => {
        setConfirmshowPassword(!confirmshowPassword);
    }

    const newPswd = () => {
        setNewshowPassword(!newshowPassword);
    }
    const inputsHandler = (e) => {
        setLoginForm({
            ...loginForm,
            [e.target.name]: e.target.value,
        });
    };

    const inputsPswdHandler = (e) => {
        setForgotpswForm({
            ...forgotpswForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked);
    };


    /* Old Code */
    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     try {
    //         const apiUrl = "http://localhost:4000/auth/login";
    //         const response = await axios.post(apiUrl, loginForm);
    //         const { token, name } = response.data;

    //         setSuccessMessage("Login Successfully");
    //         setLoginForm(clearForm);
    //         if (rememberMe) {
    //             localStorage.setItem('loginForm', JSON.stringify(loginForm));
    //             localStorage.setItem('token', token); // Save the token as well
    //             localStorage.setItem('name', name); // Save the user's name
    //         } else {
    //             localStorage.removeItem('loginForm');
    //             localStorage.setItem('token', token); // Save the token if not remembered
    //             localStorage.setItem('name', name); // Save the user's name
    //         }
    //         setTimeout(() => {
    //             navigate("/user-dashboard");
    //             setSuccessMessage("");
    //         }, 2000);

    //     } catch (error) {
    //         setErrorMessage(error.response?.data?.msg || 'Login failed');
    //         setTimeout(() => {
    //             setErrorMessage('');
    //         }, 1000)
    //     }
    // };

    /* new code     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        const localStoragedata = localStorage.getItem('loginForm');
        if (localStoragedata) {
            const loginForm = JSON.parse(localStoragedata);
            const role = loginForm.role
            console.log(role)
        } else {
            console.log('No login form data found in localStorage.');
        }

        try {
            const apiUrl = "http://localhost:4000/auth/login";
            const response = await axios.post(apiUrl, loginForm);
            const { token, name, role } = response.data;
            setSuccessMessage("Login Successfully");

            setLoginForm(clearForm);


            if (rememberMe) {
                localStorage.setItem('loginForm', JSON.stringify(loginForm));
                localStorage.setItem('token', token);
                localStorage.setItem('name', name);
            } else {
                localStorage.removeItem('loginForm');
                localStorage.setItem('token', token);
                localStorage.setItem('name', name);
            }

            setTimeout(() => {
                // switch (role) {
                //     case 1:
                //         navigate("/admin-dashboard");
                //         break;
                //     case 2:
                //         navigate("/user-dashboard");
                //         break;
                //     default:
                //         navigate("/");
                //         break;
                // }

                /*  or using If else */
                if (role === 1) {
                    navigate("/admin-dashboard");
                } else if (role === 2) {
                    navigate("/user-dashboard");
                } else {
                    navigate("/");
                }


                setSuccessMessage("");
            }, 2000);

        } catch (error) {
            setErrorMessage(error.response?.data?.msg || 'Login failed');
            setTimeout(() => {
                setErrorMessage('');
            }, 1000);
        }
    };

    const forgotPswdCard = () => {
        setIsFlipped(true);
        setTimeout(() => {
            setCurrentView('forgot');

        }, 600)
    };
    const registerCard = () => {
        setIsFlipped(true);
        setTimeout(() => {
            setCurrentView('register');
        }, 600)
    };



    const submitupdateBtn = async (e) => {
        e.preventDefault();

        console.log(forgotpswForm);
        setForgotpswForm(clearForgotForm)
        setSuccessMsg("Successfully Changed Password")
        setTimeout(() => {
            setSuccessMsg('')
            setIsFlipped(false);
            setCurrentView('signIn');
        }, 1000)
    }


    const registerBtn =  (e) => {
        setTimeout(() => {
            setSuccessMsg('')
            setIsFlipped(false);
            setCurrentView('signIn');
        }, 600)
    }


    return (
        <>
            <div className='container-fluid backBg px-0'>
                <div className='background-design row mx-0'>
                    <div className='container col d-flex align-items-center justify-content-center min-vh-100'>

                        <div className={`cards-flip ${isFlipped ? 'flip' : ''}`}>
                            {currentView === 'signIn' && (
                                <div className='card signIn-face signIn-front'>
                                    <p className='fw-bold h1 text-center py-2 mb-0'>Sign In</p>
                                    <p className='mb-0 pt-2 pb-4 small text-center'>Please enter your username and password!</p>

                                    <form onSubmit={handleSubmit}>
                                        <div className='card-body p-0'>
                                            <div className="input-container mb-3">
                                                <input
                                                    className="input-text"
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={loginForm.email}
                                                    onChange={inputsHandler}
                                                    placeholder=" "
                                                    required
                                                />
                                                <label className="input-label" htmlFor="email">Username</label>
                                            </div>

                                            <div className="input-container mb-3">
                                                <input
                                                    className="input-text"
                                                    type={showPassword ? 'text' : 'password'}
                                                    id="password"
                                                    name="password"
                                                    value={loginForm.password}
                                                    onChange={inputsHandler}
                                                    placeholder=" "
                                                    required
                                                />
                                                <label className="input-label" htmlFor="password">Password</label>
                                                <div className="eye-icon pb-2" onClick={togglePasswordVisibility}>
                                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                                </div>
                                            </div>

                                            <div className="input-container">
                                                <select
                                                    className="input-text"
                                                    id="role"
                                                    name="role"
                                                    value={loginForm.role}
                                                    onChange={inputsHandler}
                                                    placeholder=" "
                                                    required
                                                >
                                                    <option value="">Select role</option>
                                                    <option value="1">Admin</option>
                                                    <option value="2">User</option>
                                                    <option value="3">Client</option>
                                                </select>
                                            </div>
                                            <div className="form-check d-flex pb-2">
                                                <input
                                                    className="form-check-input border border-secondary"
                                                    type="checkbox"
                                                    id="rememberMe"
                                                    checked={rememberMe}
                                                    onChange={handleRememberMeChange}
                                                />
                                                <label className='ps-1' htmlFor="rememberMe">
                                                    Remember me
                                                </label>
                                                <Link className='text-end ms-auto flip-forgot-card' onClick={forgotPswdCard}>Forgot password?</Link>
                                            </div>
                                            <div className='d-flex justify-content-center'>
                                                {successMessage && <p className='text-success my-0 py-0'>{successMessage}</p>}
                                                {errorMessage && <p className='text-danger my-0 py-0'>{errorMessage}</p>}
                                            </div>


                                        </div>
                                        <div className='card-footer border-0 text-center mb-auto px-0 loginbtnDiv'>
                                            <button type='submit' className='btn btn-info signinBtn'>Login</button>
                                            {/* <p className="text-center my-0 small py-0">Click here to <Link to='/register'>register</Link> if you don't have an account.</p> */}
                                            <p className="text-center my-0 small py-0">Click here to <span onClick={registerCard}>register</span> if you don't have an account.</p>

                                        </div>
                                    </form>


                                </div>)}
                            {currentView === 'forgot' && (
                                <div className="card signIn-face forgot-back">
                                    <h1 className='fw-bold h3 text-center pt-4 mb-0'>Forgot password</h1>
                                    <form>
                                        <div className='card-body'>
                                            <div className="input-container my-4">
                                                <input
                                                    className="input-text"
                                                    type="email"
                                                    id="username"
                                                    name="username"
                                                    value={forgotpswForm.username}
                                                    onChange={inputsPswdHandler}
                                                    placeholder=" "
                                                    required
                                                />
                                                <label className="input-label" htmlFor="email">Username</label>
                                            </div>
                                            <div className="input-container mb-4">
                                                <input
                                                    className="input-text"
                                                    type={newshowPassword ? 'text' : 'password'}
                                                    id="newpassword"
                                                    name="newpassword"
                                                    value={forgotpswForm.newpassword}
                                                    onChange={inputsPswdHandler}
                                                    placeholder=" "
                                                    required
                                                />
                                                <label className="input-label" htmlFor="newpassword">New Password</label>
                                                <div className="eye-icon pb-2" onClick={newPswd}>
                                                    {newshowPassword ? <FaEye /> : <FaEyeSlash />}
                                                </div>
                                            </div>
                                            <div className="input-container mb-4">
                                                <input
                                                    className="input-text"
                                                    type={confirmshowPassword ? 'text' : 'password'}
                                                    id="confirmpassword"
                                                    name="confirmpassword"
                                                    value={forgotpswForm.confirmpassword}
                                                    onChange={inputsPswdHandler}
                                                    placeholder=" "
                                                    required
                                                />
                                                <label className="input-label" htmlFor="confirmpassword">Confirm Password</label>
                                                <div className="eye-icon pb-2" onClick={confirmPswd}>
                                                    {confirmshowPassword ? <FaEye /> : <FaEyeSlash />}
                                                </div>
                                            </div>

                                            <div className='text-center'>
                                                <p className='text-success'>{successMsg}</p>
                                            </div>
                                        </div>
                                        <div className='card-footer border-0 forgot-button'>
                                            <div className='d-grid'>
                                                <button type='submit' className='btn btn-info' onClick={submitupdateBtn}>Update</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>)}
                            {currentView === 'register' && (
                                <div className="card signIn-face register-back">
                                    <h1 className='fw-bold h3 text-center pt-4 mb-0'>Register</h1>
                                    <form>
                                        <div className='card-body'>
                                            <div className="input-container my-4">
                                                <input
                                                    className="input-text"
                                                    type="email"
                                                    id="username"
                                                    name="username"
                                                    value=''
                                                    onChange={inputsPswdHandler}
                                                    placeholder=" "
                                                    required
                                                />
                                                <label className="input-label" htmlFor="email">Username</label>
                                            </div>
                                        </div>
                                        <div className='card-footer border-0 text-center mb-auto px-0 loginbtnDiv'>
                                            <button type='submit' className='btn btn-info signinBtn' onClick={registerBtn}>Register</button>
                                        </div>
                                    </form>
                                </div>)}
                        </div>
                    </div>
                    <div className='col d-none d-sm-block'>
                        <img src="./images/logo3.png" alt="" />
                        <div>
                            <img className="loginpng" src="./images/l.png" alt="" />
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;


# App.css
.input-label,
.input-text {
  display: block;
  width: 100%;
}

.input-container {
  width: 100%;
  position: relative;
}

.input-text {
  padding: 10px 10px 10px 10px;
  background: #e9f8ef;
  border: 1px solid;
  border-radius: 8px;
  position: relative;
}

.input-label {
  position: absolute;
  margin: 0;
  font-size: 15px;
  top: 12px;
  left: 5px;
  width: max-content;
  padding: 0 4px;
  border-radius: 2px;
  transition: 0.2s ease-in-out;
}

/* .input-text:focus,
.input-text:not(:placeholder-shown) {
  outline: 2px solid #1eb15b;
} */

.input-text:focus + .input-label,
.input-text:not(:placeholder-shown) + .input-label {
  background: #e9f8ef;
  top: -14px;
  left: 10px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
}

.eye-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 1;
}
.background-design {
  background: linear-gradient(45deg, #6f2cc5, #eedada, transparent);
  border-radius: 0px 0px 900px 0px;
  /* filter: drop-shadow(4px 1px 4px pink); */
  /* border-right: 20px solid rgb(245, 172, 16); */
}
.backBg {
  background-color: rgb(194, 148, 236);
  
}
/* select {
	appearance: none;
} */

.nav-menu {
    z-index: 1;
    top: 50%;
    left: 0;
    position: fixed;
}

.menu-item {
    display: flex;
    align-items: center;
    margin: 5px 0; 
    position: relative;
    
}

.icon {
    cursor: pointer;
}

.text {
    opacity: 0;
    transform: translateX(-20px); 
    transition: opacity 0.3s ease, transform 0.3s ease;
    position: absolute;
    left: 100%; 
    white-space: nowrap;
}

.menu-item .icon:hover + .text {
    opacity: 1; 
    transform: translateX(0); 
}
/* .signIn {
  width: 400px;
  padding: 20px;
  background: linear-gradient(#fcf4f4, #efe6e6);
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  min-height: 400px;
} */
.loginbtnDiv{
      bottom: 0;
    left: 20px;
    position: fixed;
    right: 20px;
}
.signinBtn {
  background: linear-gradient(#0a52da, #2e3f5e);
  transition: transform 0.3s ease-out;
  width: 100%;
  color: #ffffff !important;
}

.signinBtn:active {
  background: linear-gradient(#07098b, #5c1596);
  transform: scale(0.9);
  color: #ffffff;
  width: 100%;
}


.cards-flip {
  width: 400px;
  height: 450px;
  position: relative;
  perspective: 1000px; 
}

.signIn-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transition: transform 0.5s ease-in-out;
  padding: 20px;
  padding-bottom: 10px;
}

.signIn-front {
  background: linear-gradient(#fcf4f4, #efe6e6);
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.forgot-back {
  background: linear-gradient(#fcf4f4, #efe6e6);
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transform: rotateY(180deg);
  padding: 0px;
}

.cards-flip.flip .signIn-front {
  transform: rotateY(-180deg);
}

.cards-flip.flip .forgot-back {
  transform: rotateY(0deg);
}
.loginpng{
  filter: drop-shadow(2px 4px 6px black)
}


.forgot-button {
    bottom: 10px;
    display: block;
    position: absolute;
    width: 100%;
}




