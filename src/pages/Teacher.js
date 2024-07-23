import React, { useState, useEffect } from "react";
import Layout from "../components/Layouts/Layout";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPenToSquare, faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Pagination from "react-js-pagination";
function Teacher() {
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const [addFormDiv, setAddFormDiv] = useState(true);
    const [searchFormDiv, setSearchFormDiv] = useState(false);
    const [statusDiv, setStatusDiv] = useState(false)

    const [searchName, setSearchName] = useState("");
    const [searchStatus, setSearchStatus] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [usergetForm, setUsergetForm] = useState([]);
    const [errors, setErrors] = useState({});
    const [count, setCount] = useState(0);
    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

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

    const [userForm, setUserForm] = useState({
        name: "",
        email: "",
        subject: "",
        teacherid: "",
        status: "1",
    });


    const addDiv = () => {
        setSearchFormDiv(false)
        setAddFormDiv(true)
        setStatusDiv(false)
        setSelectedTeacher(null);
        setUserForm({
            name: "",
            email: "",
            subject: "",
            teacherid: "",
            status: "1",
        });
    };

    const searchDiv = () => {
        setSearchFormDiv(true)
        setAddFormDiv(false)
        setStatusDiv(true)
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!userForm.name || !userForm.name.trim()) {
            newErrors.name = "Name is required";
            isValid = false;
        } else if (!/^[A-Z]/.test(userForm.name.trim())) {
            newErrors.name = "Name should start with a capital letter";
            isValid = false;
        }
        if (!userForm.subject.trim()) {
            newErrors.subject = "Subject is required";
            isValid = false;
        }

        if (!userForm.email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(userForm.email)) {
            newErrors.email = "Please enter a valid email address";
            isValid = false;
        }

        if (typeof userForm.teacherid === 'string' && !userForm.teacherid.trim()) {
            newErrors.teacherid = "Teacher-id is required";
            isValid = false;
        } else if (isNaN(userForm.teacherid)) {
            newErrors.teacherid = "Please enter a valid Teacher-id";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleStatusChange = (e) => {
        setUserForm(prevState => ({
            ...prevState,
            status: e.target.value
        }));
    };

    const addForm = (e) => {
        e.preventDefault();
        if (validateForm()) {
            if (!selectedTeacher) {
                axios
                    .post("http://localhost:4000/teacher/create-teacher", userForm)
                    .then((res) => {
                        console.log(res.data);
                        setSuccessMessage(res.data.message);
                        setUserForm({
                            name: "",
                            email: "",
                            subject: "",
                            teacherid: "",
                            status: "1"
                        });
                        setErrors({});
                        setTimeout(() => {
                            getTeacher();
                            setSuccessMessage("");
                        }, 1000);
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            } else {
                axios
                    .put(`http://localhost:4000/teacher/update-teacher/${selectedTeacher._id}`, userForm)
                    .then((res) => {
                        console.log(res.data);
                        setSuccessMessage("Teacher successfully updated");
                        setUserForm({
                            name: "",
                            email: "",
                            subject: "",
                            teacherid: "",
                            status: ""
                        });
                        setSelectedTeacher(null);
                        setErrors({});
                        setTimeout(() => {
                            addDiv();
                            getTeacher();
                            setSuccessMessage("");
                        }, 1000);
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            }
        }
    };
    const getTeacher = () => {
        axios
            .get("http://localhost:4000/teacher/")
            .then((res) => {
                setUsergetForm(res.data.data);
                setSearchResult(res.data.data);
                const data = res.data.data;
                setCount(data.length);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getTeacher();
    }, []);
    const updateTeacher = (_id) => {
        setSearchFormDiv(false)
        setAddFormDiv(true)
        setStatusDiv(true)
        const selected = usergetForm.find((user) => user._id === _id);
        setSelectedTeacher(selected);
       
        setUserForm({
            name: selected.name,
            email: selected.email,
            subject: selected.subject,
            teacherid: selected.teacherid,
            status: String(selected.status),
        });
    };

    const deleteTeacher = (_id) => {
        axios
            .delete("http://localhost:4000/teacher/delete-teacher/" + _id)
            .then(() => {
                console.log("Data successfully deleted!");
                setSuccessMessage("Teacher successfully deleted");
                getTeacher();
                setTimeout(() => {
                    setSuccessMessage("");
                }, 1000);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const handleSearch = () => {
        if (searchName === "" && searchStatus === "") {
            setSearchResult(usergetForm);
        } else {
            const filteredItems = usergetForm.filter((section) => {
                const nameMatch = section.name.toLowerCase().includes(searchName.toLowerCase());
                const statusMatch = searchStatus === "" || String(section.status) === searchStatus;
                return nameMatch && statusMatch;
            });
            setSearchResult(filteredItems);
        }
    };

    return (
        <Layout>
            <div className="container-fluid p-2">
                <div className="form-wrapper card p-2">
                    <div className="d-flex justify-content-between" style={{ borderBottom: "1px solid red" }}>
                        <div>
                            <p className="h5 pb-2 my-0">Teacher Master</p>
                        </div>
                        <div>
                            <button className="searchBtn me-1" onClick={searchDiv}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} /> Search
                            </button>
                            <button className="addBtn" onClick={addDiv}>
                                <FontAwesomeIcon icon={faPlus} /> Add
                            </button>
                        </div>
                    </div>
                    {searchFormDiv && (
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
                    {addFormDiv && (
                    <div className="addformdiv">
                          
                            <form>
                                <div className="row">
                                    <div className="col-sm-3">
                                        <label className="form-label">Name</label><span className="text-danger">*</span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter your name"
                                            name="name"
                                            value={userForm.name}
                                            onChange={inputsHandler}
                                        />
                                        {errors.name && <div className="text-danger">{errors.name}</div>}
                                    </div>

                                    <div className="col-sm-3">
                                        <label className="form-label">Email</label><span className="text-danger">*</span>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Enter your email"
                                            name="email"
                                            value={userForm.email}
                                            onChange={inputsHandler}
                                        />
                                        {errors.email && <div className="text-danger">{errors.email}</div>}
                                    </div>
                                <div className="col-sm-3">
                                    <label className="form-label">Subject</label><span className="text-danger">*</span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter your Subject"
                                        name="subject"
                                        value={userForm.subject}
                                        onChange={inputsHandler}
                                    />
                                    {errors.subject && <div className="text-danger">{errors.subject}</div>}
                                </div>
                                    <div className="col-sm-3">
                                        <label className="form-label">Teacher Id</label><span className="text-danger">*</span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Enter your Teacher id"
                                        name="teacherid"
                                        value={userForm.teacherid}
                                            onChange={inputsHandler}
                                        />
                                    {errors.teacherid && <div className="text-danger">{errors.teacherid}</div>}
                                    </div>
                                    {( statusDiv && <div className="col-sm-3">
                                        <label className="form-label">Status</label><span className="text-danger">*</span>
                                        <select
                                            className="form-control"
                                            name="status"
                                            value={userForm.status}
                                            onChange={handleStatusChange}
                                        >
                                            <option value="1" className="text-primary">Active</option>
                                            <option value="0" className="text-danger">Inactive</option>
                                        </select>
                                    </div>
                                    )}
                                </div>
                                <div className="d-flex justify-content-end pt-3">
                                    <button className="btn btn-primary" onClick={addForm}>
                                        {selectedTeacher ? "Update" : "Submit"}
                                    </button>
                                </div>
                                <div className="text-success text-center">{successMessage}</div>
                            </form>
                    </div>
                    )}
                    <div>

                        <div className="mt-3">

                            <table className="table table-bordered">
                                <thead className="table-dark">
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Subject</th>
                                        <th>Teacher-id</th>
                                        <th className="text-center">Status</th>
                                        <th className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((item, index) => (
                                        <tr key={index}>
                                            <td>{indexOfFirstItem + index + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.email}</td>
                                            <td>{item.subject}</td>
                                            <td>{item.teacherid}</td>
                                            <td className="text-center">
                                                {item.status === 0 ? (
                                                    <span className="badge rounded-pill text-bg-danger">Inactive</span>
                                                ) : (
                                                    <span className="badge rounded-pill text-bg-success">Active</span>
                                                )}
                                            </td>

                                            <td className="text-center">
                                                <button className="btn btn-primary btn-sm me-1" onClick={() => updateTeacher(item._id)}>
                                                    <FontAwesomeIcon icon={faPenToSquare} />
                                                </button>
                                                <button className="btn btn-danger btn-sm" onClick={() => deleteTeacher(item._id)}>
                                                    <FontAwesomeIcon icon={faTrashCan} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <Pagination
                                        activePage={currentPage}
                                        itemsCountPerPage={itemsPerPage}
                                        totalItemsCount={searchResult.length}
                                        pageRangeDisplayed={5}
                                        onChange={handlePageChange}
                                        itemClass="page-item"
                                        linkClass="page-link"
                                        firstPageText="First"
                                        lastPageText="Last"
                                    />
                                </div>
                                <p>
                                    Total Teacher - <b>{count}</b>
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    )
}
export default Teacher
