import React, { useState, useEffect } from "react";
import Layout from "../components/Layouts/Layout";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPenToSquare, faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Pagination from "react-js-pagination";

function CreateStudent() {
    const [userForm, setUserForm] = useState({
        name: "",
        email: "",
        rollno: "",
        status: "1",
    });
    const [usergetForm, setUsergetForm] = useState([]);
    const [errors, setErrors] = useState({});
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const [addFormDiv, setAddFormDiv] = useState(true);
    const [searchFormDiv, setSearchFormDiv] = useState(false);
    const [statusDiv, setStatusDiv] = useState(false)


    const [searchName, setSearchName] = useState("");
    const [searchStatus, setSearchStatus] = useState('');
    const [searchResult, setSearchResult] = useState([]);

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

    const addDiv = () => {
        setAddFormDiv(true);
        setSearchFormDiv(false);
        setSelectedStudent(null);
        setStatusDiv(false)
        setUserForm({
            name: "",
            email: "",
            rollno: "",
            status: "1",
        });
    };

    const searchDiv = () => {
        setAddFormDiv(false);
        setSearchFormDiv(true);
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!userForm.name.trim()) {
            newErrors.name = "Name is required";
            isValid = false;
        }

        if (!userForm.email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(userForm.email)) {
            newErrors.email = "Please enter a valid email address";
            isValid = false;
        }

        if (typeof userForm.rollno === 'string' && !userForm.rollno.trim()) {
            newErrors.rollno = "Roll number is required";
            isValid = false;
        } else if (isNaN(userForm.rollno)) {
            newErrors.rollno = "Please enter a valid roll number";
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
            if (!selectedStudent) {
                axios
                    .post("http://localhost:4000/students/create-student", userForm)
                    .then((res) => {
                        console.log(res.data);
                        setSuccessMessage(res.data.message);
                        setUserForm({
                            name: "",
                            email: "",
                            rollno: "",
                            status: "1"
                        });
                        setErrors({});
                        setTimeout(() => {
                            getStudent();
                            setSuccessMessage("");
                        }, 1000);
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            } else {
                axios
                    .put(`http://localhost:4000/students/update-student/${selectedStudent._id}`, userForm)
                    .then((res) => {
                        console.log(res.data);
                        setSuccessMessage("Student successfully updated");
                        setUserForm({
                            name: "",
                            email: "",
                            rollno: "",
                            status: ""
                        });
                        setSelectedStudent(null);
                        setErrors({});
                        setTimeout(() => {
                            addDiv();
                            getStudent();
                            setSuccessMessage("");
                        }, 1000);
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            }
        }
    };

    const deleteStudent = (_id) => {
        axios
            .delete("http://localhost:4000/students/delete-student/" + _id)
            .then(() => {
                console.log("Data successfully deleted!");
                setSuccessMessage("Student successfully deleted");
                getStudent();
                setTimeout(() => {
                    setSuccessMessage("");
                }, 1000);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getStudent = () => {
        axios
            .get("http://localhost:4000/students/")
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
        getStudent();
    }, []);

    const updateStudent = (_id) => {
        setSearchFormDiv(false);
        setAddFormDiv(true);
        const selected = usergetForm.find((user) => user._id === _id);
        setSelectedStudent(selected);
        setStatusDiv(true)
        setUserForm({
            name: selected.name,
            email: selected.email,
            rollno: selected.rollno,
            status: String(selected.status),
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
                            <p className="h5 pb-2 my-0">Student Master</p>
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
                    <div>
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
                    </div>
                    <div>
                        {addFormDiv && (
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
                                        <label className="form-label">Roll No</label><span className="text-danger">*</span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Enter your roll no"
                                            name="rollno"
                                            value={userForm.rollno}
                                            onChange={inputsHandler}
                                        />
                                        {errors.rollno && <div className="text-danger">{errors.rollno}</div>}
                                    </div>
                                    {statusDiv && (<div className="col-sm-3">
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
                                        {selectedStudent ? "Update" : "Submit"}
                                    </button>
                                </div>
                                <div className="text-success text-center">{successMessage}</div>
                            </form>
                        )}
                    </div>
                    <div>

                        <div className="mt-3">

                            <table className="table table-bordered">
                                <thead className="table-dark">
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Roll No</th>
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
                                            <td>{item.rollno}</td>
                                            <td className="text-center">
                                                {item.status === 0 ? (
                                                    <span className="badge rounded-pill text-bg-danger">Inactive</span>
                                                ) : (
                                                    <span className="badge rounded-pill text-bg-success">Active</span>
                                                )}
                                            </td>

                                            <td className="text-center">
                                                <button className="btn btn-primary btn-sm me-1" onClick={() => updateStudent(item._id)}>
                                                    <FontAwesomeIcon icon={faPenToSquare} />
                                                </button>
                                                <button className="btn btn-danger btn-sm" onClick={() => deleteStudent(item._id)}>
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
                                    Total students - <b>{count}</b>
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default CreateStudent;
