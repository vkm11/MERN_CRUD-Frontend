import React, { useState, useEffect } from "react";
import Layout from "../components/Layouts/Layout"
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
    const [selectedStudent, setSelectedStudent] = useState(null); // New state to hold selected student data
    const [successMessage, setSuccessMessage] = useState("");

    const [status, setStatus] = useState(false);
    const [addFormDiv, setAddFormDiv] = useState(true);
    const [searchFormDiv, setSearchFormDiv] = useState(false);
    // const [students, setStudents] = useState([]);
    const [count, setCount] = useState(0);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = usergetForm.slice(indexOfFirstItem, indexOfLastItem);


    // Change page
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const inputsHandler = (e) => {
        setUserForm((prevNext) => ({
            ...prevNext,
            [e.target.name]: e.target.value,
        }));
    };

    const addDiv = () => {
        setAddFormDiv(true)
        setSearchFormDiv(false)
        setStatus(false)
        setUserForm({
            name: "",
            email: "",
            rollno: "",
            status: "1",
        })
    }
    const searchDiv = () => {
        setAddFormDiv(false)
        setSearchFormDiv(true)
        setStatus(true)
    }

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
                            getStudent()
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
                            addDiv()
                            getStudent()
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
                axios
                    .get("http://localhost:4000/students/")
                    .then((res) => {
                        setUsergetForm(res.data.data);
                        getStudent()
                    })
                    .catch((error) => {
                        console.log(error);
                    });

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
                const data = res.data.data;
                setCount(data.length);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    useEffect(() => {
        getStudent()
    }, []);

    const updateStudent = (_id) => {
        setStatus(true)
        const selected = usergetForm.find((user) => user._id === _id);
        setSelectedStudent(selected);
        setUserForm({
            name: selected.name,
            email: selected.email,
            rollno: selected.rollno,
            status: String(selected.status),
        });
    };


    return (
        <Layout>
            <div className="conatiner-fluid p-2">
                <div className="form-wrapper card p-2">

                    <div className="d-flex justify-content-between" style={{ borderBottom: "1px solid red" }}>
                        <div className="">
                            <p className="h5 pb-2 my-0">Student Master</p>
                        </div>
                        <div>
                            <button className="searchBtn me-1" onClick={searchDiv}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} />Search</button>
                            <button className="addBtn" onClick={addDiv}>
                                <FontAwesomeIcon icon={faPlus} />Add</button>
                        </div>
                    </div>
                    <div>
                        {searchFormDiv && (
                            <div>
                                <p>Search works here</p>
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
                                            name="name"
                                            id="name"
                                            value={userForm.name}
                                            onChange={inputsHandler}
                                        />
                                        {errors.name && (
                                            <div className="text-danger">{errors.name}</div>
                                        )}
                                    </div>
                                    <div className="col-sm-3">
                                        <label className="form-label">Email</label><span className="text-danger">*</span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="email"
                                            id="email"
                                            value={userForm.email}
                                            onChange={inputsHandler}
                                        />
                                        {errors.email && (
                                            <div className="text-danger">{errors.email}</div>
                                        )}
                                    </div>
                                    <div className="col-sm-3">
                                        <label className="form-label">Roll no.</label><span className="text-danger">*</span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="rollno"
                                            id="rollno"
                                            value={userForm.rollno}
                                            onChange={inputsHandler}
                                        />
                                        {errors.rollno && (
                                            <div className="text-danger">{errors.rollno}</div>
                                        )}
                                    </div>
                                    {status && (<div className="col-sm-3">
                                        <label className='form-label'>Status</label><span className="text-danger">*</span>
                                        <select
                                            className="form-control"
                                            value={userForm.status}
                                            onChange={handleStatusChange}
                                        >
                                            <option value="" disabled>Select status</option>
                                            <option value="0" className="text-danger">Inactive</option>
                                            <option value="1" className="text-primary">Active</option>
                                        </select>

                                    </div>
                                    )}

                                </div>
                                <div className="py-2">
                                    {successMessage && (
                                        <div className="alert alert-success py-0 my-0" role="alert">
                                            <p className="text-center py-2 my-0">{successMessage}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="text-end py-0">
                                    <button type="submit" onClick={addForm} className="btn btn-primary">
                                        {selectedStudent ? "Update" : "Submit"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                </div>
                <div className="card p-2 mt-2">
                    <div className="table-responsive">
                        <table className="table table-striped my-0 table-bordered table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Roll no</th>
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
                                            <td>{user.email}</td>
                                            <td>{user.rollno}</td>
                                            <td className="text-center">
                                                <button
                                                    className="btn btn-primary btn-sm me-2" onClick={() => updateStudent(user._id)}>
                                                    <FontAwesomeIcon icon={faPenToSquare} /> Edit
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => deleteStudent(user._id)}>
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
                                        <td>{user.email}</td>
                                        <td>{user.rollno}</td>
                                        <td>
                                            <div className='text-center'>
                                                {user.status === 1 ? <span className="badge rounded-pill text-bg-success">Active</span> : <span className="badge rounded-pill text-bg-danger">Inactive</span>}
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <button
                                                className="btn btn-primary btn-sm me-2" onClick={() => updateStudent(user._id)}>
                                                <FontAwesomeIcon icon={faPenToSquare} /> Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => deleteStudent(user._id)}>
                                                <FontAwesomeIcon icon={faTrashCan} /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-between">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={itemsPerPage}
                                totalItemsCount={usergetForm.length}
                                pageRangeDisplayed={3}
                                onChange={handlePageChange}
                                itemClass="page-item"
                                linkClass="page-link"
                            />
                            <span className="">Total Students: {count}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default CreateStudent;
