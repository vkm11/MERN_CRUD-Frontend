import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../components/AdminLayouts/Layout"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPenToSquare, faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import Pagination from "react-js-pagination";
// import { format } from 'date-fns';
import { format, parseISO } from 'date-fns';
import Swal from 'sweetalert2';


function CreateSchool() {
    const [userForm, setUserForm] = useState({
        name: "",
        class: "",
        desc: "",
        startdate: "",
        status: "1"
    });
    const [usergetForm, setUsergetForm] = useState([]);
    const [errors, setErrors] = useState({});
    const [selectedSchool, setSelectedSchool] = useState(null); // New state to hold selected student data

    const [searchName, setSearchName] = useState("");
    const [searchClass, setSearchClass] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    // toggle form 
    const [showSearchForm, setShowSearchForm] = useState(false);
    const [showSchoolForm, setShowSchoolForm] = useState(true);
    const [successMsg, setSuccessMsg] = useState(false);
    const [statusDiv, setStatusDiv] = useState(false)

    const toggleSearchForm = () => {
        setShowSearchForm(!showSearchForm);
        setShowSchoolForm(false);
        setShowSearchForm(true);
        setUserForm({
            name: "",
            class: "",
            desc: "",
            startdate: "",
            status: "",
        });
    };

    const toggleSchoolForm = () => {
        setShowSchoolForm(!showSchoolForm);
        setStatusDiv(false)
        setShowSchoolForm(true);
        setShowSearchForm(false);
        setUserForm({
            name: "",
            class: "",
            desc: "",
            startdate: "",
            status: "1"
        });
    };

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // // Logic to calculate the index of the first and last item of the current page
    // const indexOfLastItem = currentPage * itemsPerPage;
    // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // const currentItems = usergetForm.slice(indexOfFirstItem, indexOfLastItem);

    // // Change page
    // const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    // Calculate the index of the first and last item of the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchResult.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);




    const inputsHandler = (e) => {
        setUserForm((prevNext) => ({
            ...prevNext,
            [e.target.name]: e.target.value,
        }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!userForm) {
            return false;
        }

        if (!userForm.name || !userForm.name.trim()) {
            newErrors.name = "Name is required";
            isValid = false;
        }

        if (!userForm.class || !userForm.class.trim()) {
            newErrors.class = "Class is required";
            isValid = false;
        }
        if (!userForm.startdate || !userForm.startdate.trim()) {
            newErrors.startdate = "Start date is required";
            isValid = false;
        }

        // if (!userForm.desc || !userForm.desc.trim()) {
        //     newErrors.desc = "Description is required";
        //     isValid = false;
        // }


        setErrors(newErrors);
        return isValid;
    };


    const addSchool = (e) => {
        e.preventDefault();

        if (validateForm()) {

            if (!selectedSchool) {
                axios
                    .post("http://localhost:4000/school/create-school", userForm)
                    .then((res) => {
                        console.log(res.data);
                        setSuccessMsg(res.data.message)
                        setUserForm({
                            name: "",
                            class: "",
                            desc: "",
                            startdate: "",
                            status: "1",
                        });
                        setErrors({});
                        setTimeout(() => {
                            setSuccessMsg('')
                            getSchoolData()
                        }, 1000)
                        // window.location.reload();
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            } else {
                Swal.fire({
                    title:"Are you sure",
                    text: "you want to update the school",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, update it!',
                    cancelButtonText: 'No, cancel!'
               
            }).then((result) => {
                if (result.isConfirmed) {
                axios
                    .put(`http://localhost:4000/school/update-school/${selectedSchool._id}`, userForm)
                    .then((res) => {
                        console.log(res.data);
                        setSuccessMsg(res.data.msg)
                        Swal.fire(
                            "Updated",
                            "the school was successfully updated",
                            'success'
                        )
                        setUserForm({
                            name: "",
                            class: "",
                            desc: "",
                            startdate: "",
                            status: ""
                        });
                        setSelectedSchool(null);
                        setErrors({});
                        // window.location.reload();
                        setTimeout(() => {
                            setStatusDiv(false)
                            setSuccessMsg('')
                            getSchoolData()
                        }, 1000)
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
                }
            });
            }
        }
    };

    // const deleteSchool = (_id) => {
    //     axios
    //         .delete("http://localhost:4000/school/delete-school/" + _id)
    //         .then((res) => {
    //             console.log("Data successfully deleted!");
    //             setSuccessMsg(res.data.msg)
    //             setTimeout(() => {
    //                 getSchoolData()
    //                 setSuccessMsg('')
    //             }, 1000)
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // };

    const deleteSchool = (_id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete("http://localhost:4000/school/delete-school/" + _id)
                    .then((res) => {
                        console.log("Data successfully deleted!");
                        setSuccessMsg(res.data.msg);
                        Swal.fire(
                            'Deleted!',
                            'The school has been deleted.',
                            'success'
                        );
                        setTimeout(() => {
                            getSchoolData();
                            setSuccessMsg('');
                        }, 1000);
                    })
                    .catch((error) => {
                        console.log(error);
                        Swal.fire(
                            'Error!',
                            'There was a problem deleting the school.',
                            'error'
                        );
                    });
            }
        });
    };
    const getSchoolData = () => {
        axios
            .get("http://localhost:4000/school/")
            .then((res) => {
                setUsergetForm(res.data.data);
                setSearchResult(res.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        getSchoolData()
    }, []);

    const handleSearch = () => {
        if (searchName === "" && searchClass === "") {

            setSearchResult([]);
            setTimeout(() => {
                setSearchResult(usergetForm);
            }, 1000)

        } else {
            const filteredItems = usergetForm.filter((user) => {
                return (
                    user.name.toLowerCase().includes(searchName.toLowerCase()) &&
                    user.class.toLowerCase().includes(searchClass.toLowerCase())
                );
            });
            setSearchResult(filteredItems);
        }
        setCurrentPage(1);
    };


    const updateSchool = (_id) => {
        const selected = usergetForm.find((user) => user._id === _id);
        setSelectedSchool(selected);
        setShowSchoolForm(true);
        setShowSearchForm(false);
        setStatusDiv(true)
        setUserForm({
            name: selected.name,
            class: selected.class,
            desc: selected.desc,
            status: String(selected.status),
            startdate: selected.startdate.substring(0, 10),
        });
    };

    const handleStatusChange = (e) => {
        setUserForm(prevState => ({
            ...prevState,
            status: e.target.value
        }));
    }; 
    const formatDateTime = (dateString) => {
        try {
            if (!dateString) {
                return "No date provided";
            }

            const date = parseISO(dateString);
            if (!date || isNaN(date.getTime())) {
                return "Invalid date";
            }

            return format(date, 'dd/MM/yyyy');
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Invalid date";
        }
    };

    return (
        <Layout>
            <div className="container-fluid p-2">
                <div className="form-wrapper card p-2">
                    <div className="d-flex justify-content-between" style={{ borderBottom: "1px solid red" }}>
                        <div>
                            <p className="h5">School Master</p>
                        </div>
                        <div>
                            <button className='searchBtn me-1 ms-1' onClick={toggleSearchForm}><FontAwesomeIcon icon={faMagnifyingGlass} /> Search</button>
                            <button className='addBtn' onClick={toggleSchoolForm}><FontAwesomeIcon icon={faPlus} /> Add </button>
                        </div>
                    </div>

                    {showSearchForm && (
                        <div className="searchdiv">
                            <div className="row">
                                <div className="col-sm-4 mb-3">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by name"
                                        value={searchName}
                                        onChange={(e) => setSearchName(e.target.value)}
                                    />
                                </div>
                                <div className="col-sm-4 mb-3">
                                    <label>Class</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by class"
                                        value={searchClass}
                                        onChange={(e) => setSearchClass(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="text-end py-2">
                                <button className="btn btn-primary" onClick={handleSearch}>Search</button>
                            </div>
                        </div>
                    )}
                    {showSchoolForm && (
                        <form>
                            <div className="row">
                                <div className="col-sm-3 mb-3">
                                    <label className="form-label my-0">Name</label><span className="text-danger">*</span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        id="name"
                                        value={userForm.name}
                                        onChange={inputsHandler}
                                    />
                                    {errors.name && (
                                        <div className="text-danger">{errors.name}</div>
                                    )}
                                </div>
                                <div className="col-sm-3 mb-3">
                                    <label className="form-label my-0">Class</label><span className="text-danger">*</span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="class"
                                        id="class"
                                        value={userForm.class}
                                        onChange={inputsHandler}
                                    />
                                    {errors.class && (
                                        <div className="text-danger">{errors.class}</div>
                                    )}
                                </div>
                                <div className="col-sm-3 mb-3">
                                    <label className="form-label my-0">Description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="desc"
                                        id="desc"
                                        value={userForm.desc}
                                        onChange={inputsHandler}
                                    />

                                </div>
                                <div className="col-sm-3 mb-3">
                                    <label className="form-label my-0">Start date</label><span className="text-danger">*</span>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="startdate"
                                        id="startdate"
                                        value={userForm.startdate}
                                        onChange={inputsHandler}
                                    />
                                    {errors.startdate && (
                                        <div className="text-danger">{errors.startdate}</div>
                                    )}
                                </div>
                                {statusDiv && (<div className="col-sm-3 mb-3">
                                    <label className="form-label">Status</label><span className="text-danger">*</span>
                                    <select
                                        className='form-control'
                                        name='status'
                                        value={userForm.status}
                                        onChange={handleStatusChange}
                                    >
                                        <option value='' disabled>Select status</option>
                                        <option value='0' className='text-danger'>Inactive</option>
                                        <option value='1' className='text-primary'>Active</option>
                                    </select>
                                    {errors.status && (
                                        <div className="text-danger">{errors.status}</div>
                                    )}
                                </div>
                                )}

                            </div>
                            <div className="py-2 text-end">
                                <button type="submit" onClick={addSchool} className="btn btn-primary">
                                    {selectedSchool ? "Update" : "Submit"}
                                </button>
                            </div>
                        </form>
                        
                    )}
                    <div>
                        {successMsg && <p className="text-center text-success">{successMsg}</p>}
                    </div>
                </div>

                <div className="card p-2 mt-2">
                    {currentItems.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-striped my-0 table-bordered table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Class</th>
                                        <th scope="col">Description</th>
                                        <th scope="col">Start date</th>
                                        <th scope="col">Status</th>
                                        <th scope="col" className="text-center">Action</th>
                                    </tr>
                                </thead>
                                {/* <tbody>
                                {usergetForm.map((user, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{user.name}</td>
                                            <td>{user.class}</td>
                                            <td>{user.desc}</td>
                                            <td className="text-center">
                                                <button
                                                    className="btn btn-primary btn-sm me-2" onClick={() => updateSchool(user._id)}>
                                                    <FontAwesomeIcon icon={faPenToSquare} /> Edit
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => deleteSchool(user._id)}>
                                                    <FontAwesomeIcon icon={faTrashCan} /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody> */}
                                <tbody>
                                    {currentItems.map((user, index) => (
                                        <tr key={index}>
                                            <td>{indexOfFirstItem + index + 1}</td>
                                            <td>{user.name}</td>
                                            <td>{user.class}</td>
                                            <td>{user.desc}</td>
                                            <td>
                                                <div className='text-center'>
                                                    {user.status === 1 ? <span className="badge rounded-pill text-bg-success">Active</span> : <span className="badge rounded-pill text-bg-danger">Inactive</span>}
                                                </div>
                                            </td>
                                            <td>{formatDateTime(user.startdate)}</td>
                                            <td className="text-center">
                                                <button
                                                    className="btn btn-primary btn-sm me-2"
                                                    onClick={() => updateSchool(user._id)}>
                                                    <FontAwesomeIcon icon={faPenToSquare} />
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => deleteSchool(user._id)}>
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

export default CreateSchool;
