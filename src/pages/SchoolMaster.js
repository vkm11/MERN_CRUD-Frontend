import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layouts/Layout"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPenToSquare, faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import Pagination from "react-js-pagination";
function CreateSchool() {
    const [userForm, setUserForm] = useState({
        name: "",
        class: "",
        desc: "",
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

    const toggleSearchForm = () => {
        setShowSearchForm(!showSearchForm);
        setShowSchoolForm(false); // Close school form when opening profile form
        setShowSearchForm(true);
        setUserForm({ // Reset form fields
            name: "",
            class: "",
            desc: "",
        });
    };

    const toggleSchoolForm = () => {
        setShowSchoolForm(!showSchoolForm);
        
        setShowSchoolForm(true);
        setShowSearchForm(false); // Close profile form when opening school form
        setUserForm({ // Reset form fields
            name: "",
            class: "",
            desc: "",
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
            newErrors.class = "Class is required";
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

                // After deletion, fetch updated data
                axios
                    .get("http://localhost:4000/school/")
                    .then((res) => {
                        setUsergetForm(res.data.data);
                        setSearchResult(res.data.data);
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
                setSearchResult(res.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    // // Filter items based on search criteria
    // const handleSearch = () => {
    //     const filteredItems = usergetForm.filter((user) => {
    //         return (
    //             user.name.toLowerCase().includes(searchName.toLowerCase()) &&
    //             user.class.toLowerCase().includes(searchClass.toLowerCase())
    //         );
    //     });
    //     setSearchResult(filteredItems);
    //     setCurrentPage(1); // Reset to the first page after search
    // };

    // Filter items based on search criteria
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
        setCurrentPage(1); // Reset to the first page after search
    };


    const updateSchool = (_id) => {
        const selected = usergetForm.find((user) => user._id === _id);
        setSelectedSchool(selected);
        setShowSchoolForm(true);
        setShowSearchForm(false); 
        setUserForm({
            name: selected.name,
            class: selected.class,
            desc: selected.desc,
        });
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
                            <button onClick={toggleSearchForm}><FontAwesomeIcon icon={faMagnifyingGlass} /> Search</button>
                            <button onClick={toggleSchoolForm}><FontAwesomeIcon icon={faPlus} /> Add School</button>
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
                        </div>
                        <div className="py-2 text-end">
                            <button type="submit" onClick={addSchool} className="btn btn-primary">
                                {selectedSchool ? "Update" : "Submit"}
                            </button>
                        </div>
                    </form>
                    )}
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
                                            <td className="text-center">
                                                <button
                                                    className="btn btn-primary btn-sm me-2"
                                                    onClick={() => updateSchool(user._id)}>
                                                    <FontAwesomeIcon icon={faPenToSquare} /> Edit
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => deleteSchool(user._id)}>
                                                    <FontAwesomeIcon icon={faTrashCan} /> Delete
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
