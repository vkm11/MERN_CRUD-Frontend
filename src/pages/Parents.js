import React, { useState } from 'react';
import Layout from "../components/Layouts/Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
function Parents() {
    const [userForm, setUserForm] = useState({
        firstName: "",
        lastName: "",
        status: "1",
    });
    const [isChecked, setIsChecked] = useState(true);
    const[hideStatus, setHideStatus] = useState(false)


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


    const toggleSearchForm = () =>{
        setHideStatus(true)
        setUserForm({
            firstName: "",
            lastName: "",
            status: ""
        })
    }
    const toggleParentForm = () =>{
        setHideStatus(false)
        setIsChecked(true)
        setUserForm({
            firstName: "",
            lastName: "",
            status: "1"
        })
    }

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
        toggleParentForm()
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
        <>
            <Layout>
                <div className='container-fluid p-2'>
                    <div className='card p-2'>
                        <div className="d-flex justify-content-between" style={{ borderBottom: "1px solid red" }}>
                            <div>
                                <p className="h5">Parents</p>
                            </div>
                            <div>
                                <button className='searchBtn me-1' onClick={toggleSearchForm}><FontAwesomeIcon icon={faMagnifyingGlass} /> Search</button>
                                <button className='addBtn' onClick={toggleParentForm}><FontAwesomeIcon icon={faPlus} /> Add Parents</button>
                            </div>
                        </div>
                        <div>
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
                                    {hideStatus && ( <div className="col-sm-4">
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
                                    )}
                                </div>
                                <br />
                                <div className='text-end'>
                                <button className='btn btn-primary' type="submit" disabled={!isFormValid()}>Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default Parents;
