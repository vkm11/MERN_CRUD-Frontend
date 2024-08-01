import React, { useState, useEffect } from "react";
import Layout from "../../components/AdminLayouts/Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlus, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import Pagination from "react-js-pagination";
function Roles() {
    const [roleForm, setRoleForm] = useState({
        name: "",
        description: "",
        status: "1",
    });
    const [showSearchForm, setShowSearchForm] = useState(false);
    const [showRolesForm, setShowRolesForm] = useState(true);
    const [hideStatus, setHideStatus] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedRole, setSelectedRole] = useState(null);
    const [rolegetForm, setRolegetForm] = useState([]);

    const [searchName, setSearchName] = useState("");
    const [searchStatus, setSearchStatus] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [successMsg, setSuccessMsg] = useState("");


    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // Calculate the index of the first and last item of the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchResult.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const toggleSearchForm = () => {
        setShowRolesForm(false);
        setShowSearchForm(true);
        setHideStatus(false);
        setRoleForm({
            name: "",
            description: "",
            status: ""
        });
        clearSearchForm()
    };

    const toggleRolesForm = () => {
        setShowRolesForm(true);
        setShowSearchForm(false);
        setHideStatus(false);
        setSelectedRole(false);
        setRoleForm({
            name: "",
            description: "",
            status: "1"
        });
    };
    const clearSearchForm = () => {
        setSearchName("");
        setSearchStatus("");
        setSearchResult(rolegetForm); 
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRoleForm((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    // const handleStatusChange = (e) => {
    //     const { value } = e.target;
    //     setRoleForm(prevState => ({
    //         ...prevState,
    //         status: value
    //     }));
    // };
    const handleStatusChange = (e) => {
        setRoleForm(prevState => ({
            ...prevState,
            status: e.target.value
        }));
    };
    const addRoles = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log(roleForm)
            if (!selectedRole) {
                axios
                    .post("http://localhost:4000/role/create-role", roleForm)
                    .then((res) => {
                        console.log(res.data);
                        setSuccessMsg(res.data.message)
                       
                        setRoleForm({
                            name: "",
                            description: "",
                            status: ''
                        });
                        setErrors({});
                        setTimeout(()=>{
                            setSuccessMsg("")
                            getData()
                        },1000)
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                        // Handle error and display appropriate message to the user
                    });
                

            } else {
                if (window.confirm("Are you sure you want to update this role?")) {
                axios
                    .put(`http://localhost:4000/role/update-role/${selectedRole._id}`, roleForm)
                    .then((res) => {
                        console.log(res.data);
                        setSuccessMsg(res.data.msg)
                        setRoleForm({
                            name: "",
                            description: "",
                            status: ''
                        });
                        setSelectedRole(null);
                        setErrors({});
                        
                        setTimeout(()=>{
                            setSuccessMsg("")
                            toggleRolesForm()
                            getData()
                        },1000)
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                        // Handle error from server if needed
                    });
                }
            }
        }
    };
    const getData = (e) => {
        axios
            .get("http://localhost:4000/role/")
            .then((res) => {
                setRolegetForm(res.data.data);
                setSearchResult(res.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    useEffect(() => {
        getData()
    }, []);
    const handleSearch = () => {
        if (searchName === "" && searchStatus === "") {
            setSearchResult(rolegetForm);
        } else {
            const filteredItems = rolegetForm.filter((role) => {
                const nameMatch = role.name.toLowerCase().includes(searchName.toLowerCase());
                const statusMatch = searchStatus === "" || String(role.status) === searchStatus;

                return nameMatch && statusMatch;
            });
            setSearchResult(filteredItems);
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        // // Required field validation
        if (!roleForm.name || !roleForm.name.trim()) {
            newErrors.name = "Name is required";
            isValid = false;
        } else if (!/^[A-Z]/.test(roleForm.name.trim())) {
            newErrors.name = "Name should start with a capital letter";
            isValid = false;

        } else if (/^\s/.test(roleForm.name)) {
            newErrors.name = "Name should not start with a space";
            isValid = false;
        }

        if (!roleForm.description || !roleForm.description.trim()) {
            newErrors.description = "Description is required";
            isValid = false;
        }
        if (!roleForm.status) {
            newErrors.status = "Status is required";
            isValid = true;
        }

        setErrors(newErrors);
        return isValid;
    };

    const updateRoles = (_id) => {
        setHideStatus(true)
        setShowRolesForm(true)
        setShowSearchForm(false);
        const selected = rolegetForm.find((role) => role._id === _id);
        setSelectedRole(selected);
        setRoleForm({
            name: selected.name,
            description: selected.description,
            status: selected.status,
        })
    };

    const deleteRole = (_id) => {
        if (window.confirm("Are you sure you want to delete this role"))
        axios
            .delete("http://localhost:4000/role/delete-role/" + _id)
            .then((res) => {
                console.log("Data successfully deleted!");
                setSuccessMsg(res.data.msg);

                // After deletion, fetch updated data
                axios
                    .get("http://localhost:4000/role/")
                    .then((res) => {
                        setRolegetForm(res.data.data);
                        setSearchResult(res.data.data);

                        setTimeout(()=>{
                            setSuccessMsg("");
                        },1000)
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            <Layout>
                <div className="container-fluid p-2">
                    <div className="form-wrapper card p-2">
                        <div className="d-flex justify-content-between" style={{ borderBottom: "1px solid red" }}>
                            <div>
                                <p className="h5">Roles</p>
                            </div>
                            <div>
                                <button className='searchBtn me-1' onClick={toggleSearchForm}><FontAwesomeIcon icon={faMagnifyingGlass} /> Search</button>
                                <button className='addBtn' onClick={toggleRolesForm}><FontAwesomeIcon icon={faPlus} /> Add Role</button>
                            </div>
                        </div>
                        <div>
                            {showSearchForm && (
                                <div className="searchDiv">
                                    <div>
                                        <p className='h6 pb-2 headigs'>Search Role Master Group:</p></div>
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
                                                <option value="" disabled>Select status</option>
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
                            {showRolesForm && (
                                <div>
                                    <form>
                                        <div className="row">
                                            <div className="col-sm-3">
                                                <label className="form-label my-0">Name</label><span className="text-danger">*</span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="name"
                                                    value={roleForm.name}
                                                    onChange={handleInputChange}
                                                />
                                                {errors.name && (
                                                    <div className="text-danger">{errors.name}</div>
                                                )}
                                            </div>
                                            <div className="col-sm-3">
                                                <label className="form-label my-0">Description</label><span className="text-danger">*</span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="description"
                                                    value={roleForm.description}
                                                    onChange={handleInputChange}
                                                />
                                                {errors.description && (
                                                    <div className="text-danger">{errors.description}</div>
                                                )}
                                            </div>
                                            {hideStatus && (
                                                <div className="col-sm-3">
                                                    <label className="form-label my-0">Status</label><span className="text-danger">*</span>
                                                    <select
                                                        className="form-control"
                                                        value={roleForm.status}
                                                        onChange={handleStatusChange}
                                                    >
                                                        <option value="" disabled>Select status</option>
                                                        <option value="0" className="text-danger">Inactive</option>
                                                        <option value="1" className="text-primary">Active</option>
                                                    </select>
                                                    {errors.status && (
                                                        <div className="text-danger">{errors.status}</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="text-end pt-1">
                                            <button className="btn btn-primary" type="submit" onClick={addRoles}>
                                                {selectedRole ? "Update" : "Submit"}
                                            </button>
                                        </div>
                                    </form>
                                   
                                </div>
                            )}

                            {successMsg && (
                                <div className="text-success text-center">
                                    {successMsg}
                                </div>
                            )}

                        </div>
                    </div>
                    <div className="card p-2 mt-2">
                        {currentItems.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-hover">
                                    <thead className="table-dark">
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Description</th>
                                            <th scope="col" className="text-center">Status</th>
                                            <th scope="col" className="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-group-divider">
                                        {/* {rolegetForm.map((role, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{role.name}</td>
                                                <td>{role.description}</td>
                                                <td>
                                                    <div className='text-center'>
                                                        {role.status === 1 ? <span className="badge rounded-pill text-bg-success">Active</span> : <span className="badge rounded-pill text-bg-danger">Inactive</span>}
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <button
                                                        className="btn btn-primary btn-sm me-2" onClick={() => updateRoles(role._id)}>
                                                        <FontAwesomeIcon icon={faPenToSquare} /> Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => deleteRole(role._id)}>
                                                        <FontAwesomeIcon icon={faTrashCan} /> Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}  */}
                                        {currentItems.map((role, index) => (

                                            <tr key={index}>
                                                <td>{indexOfFirstItem + index + 1}</td>
                                                <td>{role.name}</td>
                                                <td>{role.description}</td>
                                                <td>
                                                    <div className='text-center'>
                                                        {role.status === 1 ? <span className="badge rounded-pill text-bg-success">Active</span> : <span className="badge rounded-pill text-bg-danger">Inactive</span>}
                                                    </div>
                                                </td>

                                                <td className="text-center">
                                                    <div className="d-flex justify-content-center">
                                                        <p className="me-2 my-0 text-primary pointer" onClick={() => updateRoles(role._id)}>
                                                            <FontAwesomeIcon icon={faPenToSquare} />
                                                        </p>
                                                        <p className="my-0 text-danger pointer"
                                                            onClick={() => deleteRole(role._id)}>
                                                            <FontAwesomeIcon icon={faTrashCan} />
                                                        </p>
                                                    </div>
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
        </>
    );
}

export default Roles;
