import React, { useState, useEffect } from 'react';
import Layout from "../../components/AdminLayouts/Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlus, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import Pagination from "react-js-pagination";
function Parents() {
    const [parentForm, setParentForm] = useState({
        firstName: "",
        nickName: "",
        status: "1",
    });

    const [parentGet, setParentGet] = useState([]);
    const [successMsg, setSuccessMsg] = useState("");
    const [isChecked, setIsChecked] = useState(true);
    const [hideStatus, setHideStatus] = useState(false);
    const [selectedParent, setSelectedParent] = useState(null);
    const [editHeading, setEditHeading] = useState(false)
    const [addHeading, setAddHeading] = useState(true)
    const [searchHeading, setSearchHeading] = useState(false)

    const [addFormDiv, setAddFormDiv] = useState(true);
    const [searchDiv, setSearchDiv] = useState(false);

    const [searchName, setSearchName] = useState("");
    const [searchStatus, setSearchStatus] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // Calculate the index of the first and last item of the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchResult.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const [touchedFields, setTouchedFields] = useState({
        firstName: false,
        nickName: false,
        status: true,
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
        setAddFormDiv(false);
        setSearchDiv(true);
        setAddHeading(false);
        setSearchHeading(true);
        setEditHeading(false)
    };

    const toggleParentForm = () => {
        setSearchHeading(false);
        setEditHeading(false)
        setAddHeading(true);
        setAddFormDiv(true);
        setSearchDiv(false);
        setSelectedParent(null);
        setHideStatus(false);
        setIsChecked(true);
        setParentForm({
            firstName: "",
            nickName: "",
            status: "1",
        });
    };

    const handleFirstNameChange = (e) => {
        const value = e.target.value;
        setParentForm(prevState => ({
            ...prevState,
            firstName: value,
            nickName: isChecked ? value : prevState.nickName,
        }));
        setTouchedFields(prevState => ({
            ...prevState,
            firstName: true,
        }));
        setErrors(prevErrors => ({
            ...prevErrors,
            firstName: validateFirstName(value),
        }));
    };

    const handleNickNameChange = (e) => {
        setParentForm(prevState => ({
            ...prevState,
            nickName: e.target.value,
        }));
        setTouchedFields(prevState => ({
            ...prevState,
            nickName: true,
        }));
    };

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
        if (isChecked) {
            setParentForm(prevState => ({
                ...prevState,
                nickName: "",
            }));
        } else {
            setParentForm(prevState => ({
                ...prevState,
                nickName: parentForm.firstName,
            }));
        }
        setTouchedFields(prevState => ({
            ...prevState,
            nickName: true,
        }));
    };

    const handleStatusChange = (e) => {
        setParentForm(prevState => ({
            ...prevState,
            status: e.target.value,
        }));
        setTouchedFields(prevState => ({
            ...prevState,
            status: true,
        }));
    };

    const getData = () => {
        axios
            .get(`${process.env.REACT_APP_API}/parent/`)
            .then((res) => {
                setParentGet(res.data.data);
                setSearchResult(res.data.data);
                setSearchName("");
                setSearchStatus("");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        toggleParentForm();
        const firstNameError = validateFirstName(parentForm.firstName);
        setErrors(prevErrors => ({
            ...prevErrors,
            firstName: firstNameError,
        }));

        if (firstNameError) {
            return;
        }

        if (!selectedParent) {
            axios
                .post(`${process.env.REACT_APP_API}/parent/create-parent`, parentForm)
                .then((res) => {
                    console.log(res.data);
                    setSuccessMsg(res.data.message);

                    setParentForm({
                        firstName: "",
                        nickName: "",
                        status: "1",
                    });
                    setErrors({});
                    setTimeout(() => {
                        setSuccessMsg("");
                        getData();
                    }, 1000);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });

        } else {
            if (window.confirm("Are you sure you want to update this Parent?")) {
                axios
                    .put(`${ process.env.REACT_APP_API }/parent/update-parent/${selectedParent._id}`, parentForm)
                    .then((res) => {
                        console.log(res.data);
                        setSuccessMsg(res.data.msg);
                        setParentForm({
                            firstName: "",
                            nickName: "",
                            status: "1",
                        });
                        setErrors({});
                        setTimeout(() => {
                            setSuccessMsg("");
                            getData();
                        }, 1000);
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            }
        }
    };

    const isFormValid = () => {
        if (isChecked) {
            return parentForm.firstName.trim() !== '' && parentForm.status !== '' && !errors.firstName;
        } else {
            return parentForm.firstName.trim() !== '' && parentForm.nickName.trim() !== '' && parentForm.status !== '' && !errors.firstName;
        }
    };



    const editParent = (_id) => {
        setAddHeading(false);
        setSearchHeading(false);
        setEditHeading(true)
        setHideStatus(true);
        setSearchDiv(false);
        setAddFormDiv(true)
        const selected = parentGet.find((parent) => parent._id === _id);
        setSelectedParent(selected);
        setParentForm({
            firstName: selected.firstName,
            nickName: selected.nickName,
            status: selected.status,
        });
        setIsChecked(selected.firstName === selected.nickName);
    };
    const handleSearch = () => {
        if (searchName === "" && searchStatus === "") {
            setSearchResult(parentGet);
        } else {
            const filteredItems = parentGet.filter((section) => {
                const nameMatch = section.firstName.toLowerCase().includes(searchName.toLowerCase());
                const statusMatch = searchStatus === "" || String(section.status) === searchStatus;
                return nameMatch && statusMatch;
            });
            setSearchResult(filteredItems);
        }
    };

    const deleteParent = (_id) => {
        if (window.confirm("Are you sure you want to delete this Parent?"))
            axios
                .delete(`${process.env.REACT_APP_API}/parent/delete-parent/${_id}`)
                .then((res) => {
                    console.log("Data successfully deleted!");
                    setSuccessMsg(res.data.msg);
                    setTimeout(() => {
                        setSuccessMsg('');
                        getData();
                    }, 1000);
                })
                .catch((error) => {
                    console.log(error);
                });
    };

    return (
        <Layout>
            <div className='container-fluid p-2'>
                <div className='card p-2'>
                    <div className="d-flex justify-content-between" style={{ borderBottom: "1px solid red" }}>
                        <div>
                            {/* <p className='h6 pb-2 headigs'>Search Parent Master Group:</p> */}
                            {addHeading && (<p className='h6 pb-2 headigs'>Add Parent Master Group:</p>)}
                            {searchHeading && (<p className='h6 pb-2 headigs'>Search Parent Master Group:</p>)}
                            {editHeading && (<p className='h6 pb-2 headigs'>Update Parent Master Group:</p>)}
                        </div>
                        <div className="text-end">
                           
                            <button className='searchBtn me-1 ms-1' onClick={toggleSearchForm}><FontAwesomeIcon icon={faMagnifyingGlass} /> Search</button>
                            <button className='addBtn' onClick={toggleParentForm}><FontAwesomeIcon icon={faPlus} /> Add</button>
                        </div>
                    </div>
                    {searchDiv && (
                        <div className="searchDiv">
                            <div>
                                {/* <p className='h6 pb-2 headigs'>Search Parent Master Group:</p> */}
                            </div>
                            <div className="row">
                                <div className="col-sm-4">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by name"
                                        value={searchName}
                                        onChange={(e) => setSearchName(e.target.value)}
                                    />
                                </div>
                                <div className="col-sm-4">
                                    <label className="form-label my-0">Status</label>
                                    <select
                                        className="form-control"
                                        value={searchStatus}
                                        onChange={(e) => setSearchStatus(e.target.value)}
                                    >
                                        <option value="">Select status</option>
                                        <option value="0" className="text-danger">Inactive</option>
                                        <option value="1" className="text-primary">Active</option>
                                    </select>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div className="py-2">
                                    {searchDiv && (<button className='btn btn-warning' onClick={getData}>Back</button>)}
                            </div>
                            <div className="py-2">

                                <button className="btn btn-primary" onClick={handleSearch}>Search</button>
                            </div>
                            </div>
                        </div>
                    )}
                    {addFormDiv && (
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <label className='form-label'>First Name</label><span className="text-danger">*</span>
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
                                                <label className='form-label'>Nick Name </label><span className="text-danger">*</span>
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
                                            <span className="text-danger">Nickname is required</span>}
                                    </div>
                                    {hideStatus && (
                                        <div className="col-sm-4">
                                            <label className='form-label'>Status</label><span className="text-danger">*</span>
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
                                    <button className='btn btn-primary' type="submit" disabled={!isFormValid()}>{selectedParent ? 'Update' : 'Submit'}</button>
                                </div>
                            </form>
                            {successMsg && (
                                <div className="text-center text-success">
                                    {successMsg}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="card p-2 mt-2">
                    {currentItems.length > 0 ? (
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
                            
                            {/* <tbody className="table-group-divider">
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
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody> */}
                                <tbody className="table-group-divider">
                                    {currentItems.map((parent, index) => (
                                        <tr key={parent._id}>
                                            <td>{indexOfFirstItem + index + 1}</td>
                                                <td>{parent.firstName}</td>
                                                <td>{parent.nickName}</td>
                                                <td>
                                                    <div className='text-center'>
                                                        {parent.status === 1 ? <span className="badge rounded-pill text-bg-success">Active</span> : <span className="badge rounded-pill text-bg-danger">Inactive</span>}
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <button
                                                        className="btn btn-primary btn-sm me-2" onClick={() => editParent(parent._id)}>
                                                        <FontAwesomeIcon icon={faPenToSquare} />
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => deleteParent(parent._id)}>
                                                        <FontAwesomeIcon icon={faTrashCan} />
                                                    </button>
                                                </td>
                                            </tr>
                                    ))}
                                </tbody>
                        </table>
                        <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={itemsPerPage}
                            totalItemsCount={searchResult.length}
                            pageRangeDisplayed={3}
                            onChange={handlePageChange}
                            itemClass="page-item"
                            linkClass="page-link"
                        />
                    </div>
                    ) : (
                        <div>
                            <p className="text-center my-0 text-danger">No results found</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default Parents;
