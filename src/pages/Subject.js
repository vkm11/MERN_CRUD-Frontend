import React, { useState } from 'react';
import Layout from "../components/Layouts/Layout";

function Subject() {
    const [userForm, setUserForm] = useState({
        firstName: "",
        lastName: "",
        status: "1",
    });
    const [isChecked, setIsChecked] = useState(true);
    const [touchedFields, setTouchedFields] = useState({
        firstName: false,
        lastName: false,
        status: true
    });
    const [errors, setErrors] = useState({});

    const validateFirstName = (firstName) => {
        let error = "";
        if (!firstName || !firstName.trim()) {
            error = "First Name is required";
        } else if (!/^[A-Z]/.test(firstName.trim())) {
            error = "First Name should start with a capital letter";
        } else if (/^\s/.test(firstName)) {
            error = "First Name should not start with a space";
        }
        return error;
    };

    const handleFirstNameChange = (e) => {
        const value = e.target.value;
        setUserForm(prevState => ({
            ...prevState,
            firstName: value,
            lastName: isChecked ? value : prevState.lastName
        }));
        setTouchedFields(prevState => ({
            ...prevState,
            firstName: true
        }));

        setErrors(prevErrors => ({
            ...prevErrors,
            firstName: validateFirstName(value)
        }));
    };

    const handleLastNameChange = (e) => {
        setUserForm(prevState => ({
            ...prevState,
            lastName: e.target.value
        }));
        setTouchedFields(prevState => ({
            ...prevState,
            lastName: true
        }));
    };

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
        if (isChecked) {
            setUserForm(prevState => ({
                ...prevState,
                lastName: ""
            }));
        } else {
            setUserForm(prevState => ({
                ...prevState,
                lastName: userForm.firstName
            }));
        }
        setTouchedFields(prevState => ({
            ...prevState,
            lastName: true
        }));
    };

    const handleStatusChange = (e) => {
        setUserForm(prevState => ({
            ...prevState,
            status: e.target.value
        }));
        setTouchedFields(prevState => ({
            ...prevState,
            status: true
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const firstNameError = validateFirstName(userForm.firstName);
        setErrors(prevErrors => ({
            ...prevErrors,
            firstName: firstNameError
        }));

        if (firstNameError) {
            return;
        }

        console.log('Form submitted:', userForm);
    };

    const isFormValid = () => {
        if (isChecked) {
            return userForm.firstName.trim() !== '' && userForm.status !== '' &&
                touchedFields.firstName && touchedFields.status && !errors.firstName;
        } else {
            return userForm.firstName.trim() !== '' && userForm.lastName.trim() !== '' && userForm.status !== '' &&
                touchedFields.firstName && touchedFields.lastName && touchedFields.status && !errors.firstName;
        }
    };

    return (
        <Layout>
            <div className='container-fluid'>
                <form onSubmit={handleSubmit}>
                    <div className='row'>
                        <div className='col-sm-4'>
                            <label className='form-label'>First Name</label>
                            <input className='form-control'
                                type="text"
                                value={userForm.firstName}
                                onChange={handleFirstNameChange}
                                onBlur={() => setTouchedFields(prevState => ({ ...prevState, firstName: true }))}
                            />
                            {errors.firstName && <span className="text-danger">{errors.firstName}</span>}
                        </div>
                        <div className='col-sm-4'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div>
                                    <label className='form-label'>Last Name</label>
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={handleCheckboxChange}
                                    />
                                    <label className='ps-2'>Same as First Name</label>
                                </div>
                            </div>
                            <input className='form-control'
                                type="text"
                                value={userForm.lastName}
                                onChange={handleLastNameChange}
                                onBlur={() => setTouchedFields(prevState => ({ ...prevState, lastName: true }))}
                                disabled={isChecked}
                            />
                            {!isChecked && touchedFields.lastName && userForm.lastName.trim() === '' &&
                                <span className="text-danger">Last Name is required</span>}
                        </div>
                        <div className="col-sm-4">
                            <label className='form-label'>Status</label>
                            <select
                                className="form-control"
                                value={userForm.status}
                                onChange={handleStatusChange}
                                onBlur={() => setTouchedFields(prevState => ({ ...prevState, status: true }))}
                            >
                                <option value="" disabled>Select status</option>
                                <option value="0" className="text-danger">Inactive</option>
                                <option value="1" className="text-primary">Active</option>
                            </select>
                            {touchedFields.status && userForm.status === '' &&
                                <span className="text-danger">Status is required</span>}
                        </div>
                    </div>
                    <br />
                    <button type="submit" disabled={!isFormValid()}>Submit</button>
                </form>
            </div>
        </Layout>
    );
}

export default Subject;
