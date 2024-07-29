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

    const [loginForm, setLoginForm] = useState(clearForm);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
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
                setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds
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

    const inputsHandler = (e) => {
        setLoginForm({
            ...loginForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const apiUrl = "http://localhost:4000/auth/login";
            const response = await axios.post(apiUrl, loginForm);
            const { token } = response.data;

            setSuccessMessage("Successfully logged in");
            setLoginForm(clearForm);
            if (rememberMe) {
                localStorage.setItem('loginForm', JSON.stringify(loginForm));
                localStorage.setItem('token', token); // Save the token as well
            } else {
                localStorage.removeItem('loginForm');
                localStorage.setItem('token', token); // Save the token if not remembered
            }
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);

            console.log(response.data); // example usage

        } catch (error) {
            setErrorMessage(error.response?.data?.msg || 'Login failed');
        }
    };

    return (
        <div className='container d-flex align-items-center justify-content-center min-vh-100'>
            <div className='card signIn'>
                <p className='fw-bold h1 text-center py-4'>Sign In</p>
                <div className='card-body p-0'>
                    <form onSubmit={handleSubmit}>
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
                            <label className="input-label" htmlFor="email">Email</label>
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
                        <div className="form-check d-flex">
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
                            <p className='text-end ms-auto'>Forgot password?</p>
                        </div>

                        {successMessage && <p className='text-success'>{successMessage}</p>}
                        {errorMessage && <p className='text-danger'>{errorMessage}</p>}
                        <div className='mt-3 text-center mb-auto'>
                            <button type='submit' className='btn btn-info signinBtn'>Login</button>
                        </div>
                    </form>
                    <p className="text-center mt-3 small">Click here to <Link to='/register'>register</Link> if you don't have an account.</p>
                </div>
            </div>
        </div>
    );
}

export default Login;
