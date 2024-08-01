import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const clearForm = {
        name: "",
        email: "",
        phone: "",
        password: "",
        role: ""
    };

    const [signupForm, setSignupForm] = useState(clearForm);
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const inputsHandler = (e) => {
        setSignupForm({
            ...signupForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const apiUrl = "http://localhost:4000/auth/register";
            await axios.post(apiUrl, signupForm);
            setSuccessMessage("Successfully Registered");
            setTimeout(() => {
                setSuccessMessage('');
                navigate('/');
            }, 1000);
        } catch (error) {
            setErrorMessage(error.response?.data?.msg || 'Registration failed');
        }
    };

    return (
        <div className='container d-flex align-items-center justify-content-center min-vh-100'>
            <div className='card signIn'>
                <p className='fw-bold h1 text-center py-2'>Sign Up</p>
                <div className='card-body'>
                    <form onSubmit={handleSubmit}>
                       
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                placeholder="Enter your name"
                                value={signupForm.name}
                                onChange={inputsHandler}
                                required
                                autoComplete="name"
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                value={signupForm.email}
                                onChange={inputsHandler}
                                required
                                autoComplete="email"
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="phone"
                                name="phone"
                                placeholder="Enter your mobile number"
                                value={signupForm.phone}
                                onChange={inputsHandler}
                                required
                                autoComplete="tel"
                            />
                        </div>
                        <div className="mb-3">
                            <div className="input-group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    placeholder="Enter password"
                                    value={signupForm.password}
                                    onChange={inputsHandler}
                                    required
                                    autoComplete="new-password"
                                />
                                <span className="input-group-text" onClick={togglePasswordVisibility}>
                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                </span>
                            </div>
                        </div>
                        <div className="">
                            <select
                                className="form-control"
                                id="role"
                                name="role"
                                value={signupForm.role}
                                onChange={inputsHandler}
                                required
                            >
                                <option value="">Select Role</option>
                                <option value="1">Admin</option>
                                <option value="2">User</option>
                                <option value="3">Client</option>
                            </select>
                        </div>
                        <div className='text-center pt-2'>
                            {successMessage && <p className='text-success'>{successMessage}</p>}
                            {errorMessage && <p className='text-danger'>{errorMessage}</p>}
                        </div>
                        <div className='mt-3 text-center mb-auto'>
                            <button type='submit' className='btn btn-info signinBtn'>Signup</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
