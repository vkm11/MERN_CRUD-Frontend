import React, { useState, useEffect } from 'react';
import Layout from '../components/Layouts/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlus, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Pagination from "react-js-pagination";

function Section() {
    const [sectionForm, setSectionForm] = useState({
        name: '',
        description: '',
        status: '1',
    });
    const [sectionData, setSectionData] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);
    const [errors, setErrors] = useState({});
    const [searchDiv, setSearchDiv] = useState(false);
    const [addDiv, setAddDiv] = useState(true);
    const [hideStatus, setHideStatus] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

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

    useEffect(() => {
        getSectionData();
    }, []);

    const getSectionData = () => {
        axios
            .get('http://localhost:4000/section/')
            .then((res) => {
                setSectionData(res.data.data);
                setSearchResult(res.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleSearch = () => {
        if (searchName === "" && searchStatus === "") {
            setSearchResult(sectionData);
        } else {
            const filteredItems = sectionData.filter((section) => {
                const nameMatch = section.name.toLowerCase().includes(searchName.toLowerCase());
                const statusMatch = searchStatus === "" || String(section.status) === searchStatus;
                return nameMatch && statusMatch;
            });
            setSearchResult(filteredItems);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSectionForm((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!sectionForm.name || !sectionForm.name.trim()) {
            newErrors.name = "Name is required";
            isValid = false;
        } else if (!/^[A-Z]/.test(sectionForm.name.trim())) {
            newErrors.name = "Name should start with a capital letter";
            isValid = false;
        } else if (/^\s/.test(sectionForm.name)) {
            newErrors.name = "Name should not start with a space";
            isValid = false;
        }

        if (!sectionForm.description || !sectionForm.description.trim()) {
            newErrors.description = "Description is required";
            isValid = false;
        }
        if (!sectionForm.status) {
            newErrors.status = "Status is required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };
    const clearSearchForm = () => {
        setSearchName("");
        setSearchStatus("");
        setSearchResult(sectionData);
    };

    const toggleSearchDiv = () => {
        setSearchDiv(true);
        setAddDiv(false);
    };

    const toggleAddDiv = () => {
        setSearchDiv(false);
        setAddDiv(true);
        setHideStatus(false);
        setSelectedSection(null);
        clearSearchForm()
        setSectionForm({
            name: '',
            description: '',
            status: '1',
        });
    };

    const handleStatusChange = (e) => {
        setSectionForm(prevState => ({
            ...prevState,
            status: e.target.value
        }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            if (!selectedSection) {
                axios
                    .post('http://localhost:4000/section/create-section', sectionForm)
                    .then((res) => {
                        setSuccessMsg(res.data.message);
                        resetForm();
                        setTimeout(() => {
                            setSuccessMsg('');
                            getSectionData();
                        }, 1000);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            } else {
                if (window.confirm('Are you sure you want to update this section?')) {
                    axios
                        .put(`http://localhost:4000/section/update-section/${selectedSection._id}`, sectionForm)
                        .then((res) => {
                            setSuccessMsg(res.data.msg);
                            resetForm();
                            setTimeout(() => {
                                setSuccessMsg('');
                                getSectionData();
                            }, 1000);
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                }
            }
        }
    };

    const resetForm = () => {
        setSectionForm({
            name: '',
            description: '',
            status: '1',
        });
        setSelectedSection(null);
        setHideStatus(false);
    };

    const editSection = (id) => {
        setHideStatus(true);
        setSearchDiv(false);
        setAddDiv(true);

        const selected = sectionData.find((section) => section._id === id);
        setSelectedSection(selected);
        setSectionForm({
            name: selected.name,
            description: selected.description,
            status: String(selected.status),
        });
    };

    const deleteSection = (_id) => {
        if (window.confirm("Are you sure you want to delete this Section?"))
            axios
                .delete(`http://localhost:4000/section/delete-section/${_id}`)
                .then((res) => {
                    console.log("Data successfully deleted!");
                    setSuccessMsg(res.data.msg);
                    getSectionData();
                    setTimeout(() => {
                        setSuccessMsg('');
                    }, 1000);
                })
                .catch((error) => {
                    console.log(error);
                });
    };

    const heading = {
        borderBottom: '1px solid red',
    };

    return (
        <Layout>
            <div className='container-fluid p-2'>
                <div className='card'>
                    <div className='d-flex justify-content-between py-1 px-2' style={heading}>
                        <div>
                            <p className='my-0 h5'>Section Master</p>
                        </div>
                        <div>
                            <button className='me-1 searchBtn' onClick={toggleSearchDiv}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} /> Search
                            </button>
                            <button className='addBtn' onClick={toggleAddDiv}>
                                <FontAwesomeIcon icon={faPlus} /> Add Section
                            </button>
                        </div>
                    </div>
                    <div className='container-fluid p-2'>
                        {searchDiv && (
                            <div className="searchDiv">
                                <div>
                                    <p className='h6 pb-2 headigs'>Search Section Master Group:</p>
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
                                <div className="text-end py-2">
                                    <button className="btn btn-primary" onClick={handleSearch}>Search</button>
                                </div>
                            </div>
                        )}
                        {addDiv && (
                            <div className='addForm'>
                                <form onSubmit={handleFormSubmit}>
                                    <div className='row'>
                                        <div className='col-sm-3'>
                                            <label className='form-label my-0'>Name</label><span className='text-danger'>*</span>
                                            <input
                                                type='text'
                                                className='form-control'
                                                name='name'
                                                value={sectionForm.name}
                                                onChange={handleInputChange}
                                            />
                                            {errors.name && (
                                                <div className="text-danger">{errors.name}</div>
                                            )}
                                        </div>
                                        <div className='col-sm-3'>
                                            <label className='form-label my-0'>Description</label><span className='text-danger'>*</span>
                                            <input
                                                type='text'
                                                className='form-control'
                                                name='description'
                                                value={sectionForm.description}
                                                onChange={handleInputChange}
                                            />
                                            {errors.description && (
                                                <div className="text-danger">{errors.description}</div>
                                            )}
                                        </div>
                                        {hideStatus && (
                                            <div className='col-sm-3'>
                                                <label className='form-label my-0'>Status</label><span className='text-danger'>*</span>
                                                <select
                                                    className='form-control'
                                                    name='status'
                                                    value={sectionForm.status}
                                                    onChange={handleStatusChange}
                                                >
                                                    <option value='' disabled>Select status</option>
                                                    <option value='0' className='text-danger'>Inactive</option>
                                                    <option value='1' className='text-primary'>Active</option>
                                                </select>
                                                {errors.status && (<div className='text-danger'>{errors.status}</div>)}
                                            </div>
                                        )}
                                    </div>
                                    <div className='text-end pt-1'>
                                        <button className='btn btn-primary' type='submit'>
                                            {selectedSection ? 'Update' : 'Submit'}
                                        </button>
                                    </div>
                                </form>
                                {successMsg && <div className='text-center text-success'>{successMsg}</div>}
                            </div>
                        )}
                    </div>
                </div>
                <div className='card p-2 mt-2'>
                    {currentItems.length > 0 ? (
                        <div className='table-responsive'>
                            <table className='table table-bordered table-striped table-hover'>
                                <thead className='table-dark'>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th className='text-center'>Status</th>
                                        <th className='text-center'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((section, index) => (
                                        <tr key={section._id}>
                                            <td>{indexOfFirstItem + index + 1}</td>
                                            <td>{section.name}</td>
                                            <td>{section.description}</td>
                                            <td className='text-center'>
                                                {section.status === 1 ? (
                                                    <span className='badge rounded-pill text-bg-success'>Active</span>
                                                ) : (
                                                    <span className='badge rounded-pill text-bg-danger'>Inactive</span>
                                                )}
                                            </td>
                                            <td className='text-center'>
                                                <button className='btn btn-primary btn-sm me-2' onClick={() => editSection(section._id)}>
                                                    <FontAwesomeIcon icon={faPenToSquare} />
                                                </button>
                                                <button className='btn btn-danger btn-sm' onClick={() => deleteSection(section._id)}>
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

export default Section;
