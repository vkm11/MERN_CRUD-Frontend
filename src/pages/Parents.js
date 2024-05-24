import React, { useState, useEffect } from 'react';
import Layout from "../components/Layouts/Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlus, faPenToSquare, faTrashCan} from '@fortawesome/free-solid-svg-icons';

import axios from "axios";

function Parents() {
    const [parentForm, setParentForm] = useState({
        firstName: "",
        nickName: "",
        status: "1",
    });

    const [parentGet, setParentGet] = useState([])
    const [successMsg, setSuccessMsg] = useState("")
    const [isChecked, setIsChecked] = useState(true);
    const [hideStatus, setHideStatus] = useState(false)
    const [selectedParent, setSelectedParent] = useState(null)

    const [addFormDiv, setAddFormDiv] = useState(true)
    const [searchDiv, setSearchDiv] = useState(false)

    const [touchedFields, setTouchedFields] = useState({
        firstName: false,
        nickName: false,
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


    const toggleSearchForm = () => {
        setAddFormDiv(false)
        setSearchDiv(true)
        
    }
    const toggleParentForm = () => {
        setAddFormDiv(true)
        setSearchDiv(false)
        setSelectedParent(true)
        setHideStatus(false)
        setIsChecked(true)
        setParentForm({
            firstName: "",
            nickName: "",
            status: "1"
        })
    }

    const handleFirstNameChange = (e) => {
        const value = e.target.value;
        setParentForm(prevState => ({
            ...prevState,
            firstName: value,
            nickName: isChecked ? value : prevState.nickName
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

    const handleNickNameChange = (e) => {
        setParentForm(prevState => ({
            ...prevState,
            nickName: e.target.value
        }));
        setTouchedFields(prevState => ({
            ...prevState,
            nickName: true
        }));
    };

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
        if (isChecked) {
            setParentForm(prevState => ({
                ...prevState,
                nickName: ""
            }));
        } else {
            setParentForm(prevState => ({
                ...prevState,
                nickName: parentForm.firstName
            }));
        }
        setTouchedFields(prevState => ({
            ...prevState,
            nickName: true
        }));
    };

    const handleStatusChange = (e) => {
        setParentForm(prevState => ({
            ...prevState,
            status: e.target.value
        }));
        setTouchedFields(prevState => ({
            ...prevState,
            status: true
        }));
    };
    const getData = (e) => {
        axios
            .get("http://localhost:4000/parent/")
            .then((res) => {
                setParentGet(res.data.data);
                // setSearchResult(res.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    useEffect(() => {
        getData()
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        toggleParentForm()
        const firstNameError = validateFirstName(parentForm.firstName);
        setErrors(prevErrors => ({
            ...prevErrors,
            firstName: firstNameError
        }));

        if (firstNameError) {
            return;
        }
        axios
            .post("http://localhost:4000/parent/create-parent", parentForm)
            .then((res) => {
                console.log(res.data);
                setSuccessMsg(res.data.message)
                setParentForm({
                    firstName: "",
                    nickName: "",
                    status: ''
                });
                setErrors({});
                setTimeout(() => {
                    setSuccessMsg("")
                    getData()
                }, 1000)
            })
            .catch((error) => {
                console.error("Error:", error);
            });


        console.log('Form submitted:', parentForm);
     
    };

    const isFormValid = () => {
        if (isChecked) {
            return parentForm.firstName.trim() !== '' && parentForm.status !== '' &&
                touchedFields.firstName && touchedFields.status && !errors.firstName;
        } else {
            return parentForm.firstName.trim() !== '' && parentForm.nickName.trim() !== '' && parentForm.status !== '' &&
                touchedFields.firstName && touchedFields.nickName && touchedFields.status && !errors.firstName;
        }
    };
    const updateParent = (_id) => {
        // Add update logic here
        setHideStatus(true)
        setIsChecked(true)
     
        // setShowSearchForm(false);
        const selected = parentGet.find((parent) => parent._id === _id);
        setSelectedParent(selected);
        setParentForm({
            firstName: selected.firstName,
            nickName: selected.nickName,
            status: selected.status,
        })
    };
    const deleteParent = (_id) => {

    }


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
                        {searchDiv && (
                            <div>
                                <p>Search works here</p>
                            </div>
                        )}
                        { addFormDiv && (
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <label className='form-label'>First Name</label>
                                        <input className='form-control'
                                            type="text"
                                            value={parentForm.firstName}
                                            onChange={handleFirstNameChange}
                                            onBlur={() => setTouchedFields(prevState => ({ ...prevState, firstName: true }))}
                                        />
                                        {errors.firstName && <span className="text-danger">{errors.firstName}</span>}
                                    </div>
                                    <div className='col-sm-4'>
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <div>
                                                <label className='form-label'>Nick Name </label>
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
                                            value={parentForm.nickName}
                                            onChange={handleNickNameChange}
                                            onBlur={() => setTouchedFields(prevState => ({ ...prevState, nickName: true }))}
                                            disabled={isChecked}
                                        />
                                        {!isChecked && touchedFields.nickName && parentForm.nickName.trim() === '' &&
                                            <span className="text-danger">Nickname  is required</span>}
                                    </div>
                                    {hideStatus && (<div className="col-sm-4">
                                        <label className='form-label'>Status</label>
                                        <select
                                            className="form-control"
                                            value={parentForm.status}
                                            onChange={handleStatusChange}
                                            onBlur={() => setTouchedFields(prevState => ({ ...prevState, status: true }))}
                                        >
                                            <option value="" disabled>Select status</option>
                                            <option value="0" className="text-danger">Inactive</option>
                                            <option value="1" className="text-primary">Active</option>
                                        </select>
                                        {touchedFields.status && parentForm.status === '' &&
                                            <span className="text-danger">Status is required</span>}
                                    </div>
                                    )}
                                </div>
                                <br />
                                <div className='text-end'>
                                    <button className='btn btn-primary' type="submit" disabled={!isFormValid() }>{selectedParent ? 'Update' : 'Submit'}</button>
                                </div>
                            </form>
                                {successMsg && (<div>
                                    {successMsg}
                                </div>
                                )}
                        </div>
                      
                        )}
                       
                    </div>
                    <div className="card p-2 mt-2">
                        {/* {currentItems.length > 0 ? ( */}
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Nick Name</th>
                                        <th scope="col" className="text-center">Status</th>
                                        <th scope="col" className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="table-group-divider">
                                    {parentGet.map((parent, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{parent.firstName}</td>
                                                <td>{parent.nickName}</td>
                                                <td>
                                                    <div className='text-center'>
                                                        {parent.status === 1 ? <span className="badge rounded-pill text-bg-success">Active</span> : <span className="badge rounded-pill text-bg-danger">Inactive</span>}
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <button
                                                        className="btn btn-primary btn-sm me-2" onClick={() => updateParent(parent._id)}>
                                                        <FontAwesomeIcon icon={faPenToSquare} />
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => deleteParent(parent._id)}>
                                                        <FontAwesomeIcon icon={faTrashCan} />
                                                    </button>
                                                    {/* <span>
                                                        {parent.status == 1 && (<a><FontAwesomeIcon icon={faToggleOn} size="2xl" /></a>)}
                                                        {parent.status == 0 && (<a><FontAwesomeIcon icon={faToggleOff} size="2xl" /></a>)}
                                                    </span> */}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>

                            </table>
                        </div>
                    </div>

                </div>
            </Layout>
        </>
    );
}

export default Parents;
