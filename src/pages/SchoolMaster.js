import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layouts/Layout"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

function CreateSchool() {
    const [userForm, setUserForm] = useState({
        name: "",
        class: "",
        desc: "",
    });
    const [usergetForm, setUsergetForm] = useState([]);
    const [errors, setErrors] = useState({});
    const [selectedSchool, setSelectedSchool] = useState(null); // New state to hold selected student data

    const inputsHandler = (e) => {
        setUserForm((prevNext) => ({
            ...prevNext,
            [e.target.name]: e.target.value,
        }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        // Check if userForm is defined
        if (!userForm) {
            return false; // Return false if userForm is undefined
        }

        // Required field validation
        if (!userForm.name || !userForm.name.trim()) {
            newErrors.name = "Name is required";
            isValid = false;
        }

        if (!userForm.class || !userForm.class.trim()) {
            newErrors.class = "Description is required";
            isValid = false;
        }

        if (!userForm.desc || !userForm.desc.trim()) {
            newErrors.desc = "Description is required";
            isValid = false;
        }


        setErrors(newErrors);
        return isValid;
    };


    const addSchool = (e) => {
        e.preventDefault();

        // Validate form before submitting
        if (validateForm()) {
            // Check if selectedStudent is null, if it is, create a new student, otherwise update the selected student
            if (!selectedSchool) {
                axios
                    .post("http://localhost:4000/school/create-school", userForm)
                    .then((res) => {
                        console.log(res.data);
                        setUserForm({
                            name: "",
                            class: "",
                            desc: "",
                        });
                        setErrors({});
                        window.location.reload();
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                        // Handle error from server if needed
                    });
            } else {
                axios
                    .put(`http://localhost:4000/school/update-school/${selectedSchool._id}`, userForm)
                    .then((res) => {
                        console.log(res.data);
                        setUserForm({
                            name: "",
                            class: "",
                            desc: "",
                        });
                        setSelectedSchool(null);
                        setErrors({});
                        window.location.reload();
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                        // Handle error from server if needed
                    });
            }
        }
    };

    const deleteSchool = (_id) => {
        axios
            .delete("http://localhost:4000/school/delete-school/" + _id)
            .then(() => {
                console.log("Data successfully deleted!");

                axios
                    .get("http://localhost:4000/school/")
                    .then((res) => {
                        setUsergetForm(res.data.data);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        axios
            .get("http://localhost:4000/school/")
            .then((res) => {
                setUsergetForm(res.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const updateSchool = (_id) => {
        const selected = usergetForm.find((user) => user._id === _id);
        setSelectedSchool(selected);
        setUserForm({
            name: selected.name,
            class: selected.class,
            desc: selected.desc,
        });
    };

    return (
        <Layout>
            <div class="container-fluid p-2">
                <div className="form-wrapper card p-2">
                    <div className="">
                        <p className="h5" style={{ borderBottom: "1px solid red" }}>School Master</p>
                    </div>
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
                                <label className="form-label">Class</label><span className="text-danger">*</span>
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
                            <div className="col-sm-3">
                                <label className="form-label">Description</label><span className="text-danger">*</span>
                            <input
                                type="text"
                                className="form-control"
                                name="desc"
                                id="desc"
                                value={userForm.desc}
                                onChange={inputsHandler}
                            />
                            {errors.desc && (
                                <div className="text-danger">{errors.desc}</div>
                            )}
                        </div>
                        </div>
                        <div className="py-2 text-end">
                            <button type="submit" onClick={addSchool} className="btn btn-primary">
                                {selectedSchool ? "Update" : "Submit"}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="card p-2 mt-2">
                    <div className="table-responsive">
                        <table className="table table-striped my-0 table-bordered table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Class</th>
                                    <th scope="col">Description</th>
                                    <th scope="col" className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usergetForm.map((user, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            {/* <th scope="row">{user._id}</th> */}
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
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default CreateSchool;
