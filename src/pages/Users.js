import React, { useState, useEffect } from 'react';
import Layout from "../components/Layouts/Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlus, faPenToSquare, faTrashCan, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import Pagination from "react-js-pagination";
function Users() {
    const [userForm, setUserForm] = useState({
        name: "",
        mob: "",
        email: "",
        caddress: "",
        paddress: "",
        info: "",
        uname: "",
        password: '',
        status: "1"
    });
    const [usergetForm, setUsergetForm] = useState([]);
    const [isChecked, setIsChecked] = useState(true);
    const [errors, setErrors] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);

    const [searchName, setSearchName] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    // toggle form 
    const [showSearchForm, setShowSearchForm] = useState(false);
    const [showUserForm, setShowUserForm] = useState(true);
    const [isVisibleStatus, setIsVisibleStatus] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // Calculate the index of the first and last item of the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchResult.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleCaddressChange = (e) => {
        const value = e.target.value;
        setUserForm(prevState => ({
            ...prevState,
            caddress: value,
            paddress: isChecked ? value : prevState.paddress
        }));
    };
    const handlePaddressChange = (e) => {
        setUserForm(prevState => ({
            ...prevState,
            paddress: e.target.value
        }));
    };

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
        setUserForm(prevState => ({
            ...prevState,
            paddress: isChecked ? '' : prevState.caddress
        }));
    };

    const toggleSearchForm = () => {
        setShowUserForm(!showSearchForm);
        setShowUserForm(false); // Close school form when opening profile form
        setShowSearchForm(true);
        setUserForm({ // Reset form fields
            name: "",
            email: "",
            mob: "",
            caddress: "",
            paddress: "",
            info: "",
            uname: "",
            password: "",
            status: ""
        });
    };

    const toggleUserForm = () => {
        setShowUserForm(!showUserForm);
        setIsVisibleStatus(false);
        setShowUserForm(true);
        setShowSearchForm(false); // Close profile form when opening school form
        setUserForm({ // Reset form fields
            name: "",
            email: "",
            mob: "",
            caddress: "",
            paddress: "",
            info: "",
            uname: "",
            password: "",
            status: ""
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleStatusChange = (e) => {
        setUserForm(prevState => ({
            ...prevState,
            status: e.target.value
        }));
    };

    // const inputsHandler = (e) => {
    //     setUserForm((prevState) => ({
    //         ...prevState,
    //         [e.target.name]: e.target.value
    //     }));
    // };
    const inputsHandler = (e) => {
        const { name, value } = e.target;

        // If the changed field is 'email', update 'uname' to match it
        if (name === "email") {
            setUserForm(prevState => ({
                ...prevState,
                [name]: value,
                uname: value // Set 'uname' to be the same as 'email'
            }));
        } else {
            setUserForm(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };
 


    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        // // Required field validation
        if (!userForm.name || !userForm.name.trim()) {
            newErrors.name = "Name is required";
            isValid = false;
        } else if (!/^[A-Z]/.test(userForm.name.trim())) {
            newErrors.name = "Name should start with a capital letter";
            isValid = false;
        }

        if (!userForm.email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(userForm.email)) {
            newErrors.email = "Please enter a valid email address";
            isValid = false;
        }

        if (typeof userForm.mob === 'string' && !userForm.mob.trim()) {
            newErrors.mob = "Mobile number is required";
            isValid = false;
        } else if (isNaN(userForm.mob)) {
            newErrors.mob = "Please enter a valid mobile number";
            isValid = false;
        }

        if (!userForm.caddress.trim()) {
            newErrors.caddress = "Current address is required";
            isValid = false;
        }
        if (!userForm.paddress.trim()) {
            newErrors.paddress = "Permanent address is required";
            isValid = false;
        }

        if (!userForm.info.trim()) {
            newErrors.info = "Information is required";
            isValid = false;
        }
        if (!userForm.password.trim()) {
            newErrors.password = "Password is required";
            isValid = false;
        }
        // Required field validation




        setErrors(newErrors);
        return isValid;
    };

    const addUser = (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        if (validateForm()) {
            if (!selectedUser) {
                axios
                    .post("http://localhost:4000/user/create-user", userForm)
                    .then((res) => {
                        console.log(res.data);
                        setUserForm({
                            name: "",
                            mob: "",
                            email: "",
                            caddress: "",
                            paddress: "",
                            info: "",
                            uname: "",
                            password: "",
                            status: ''
                        });
                        setErrors({});
                        window.location.reload();
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                        // Handle error and display appropriate message to the user
                    });

            } else {
                axios
                    .put(`http://localhost:4000/user/update-user/${selectedUser._id}`, userForm)
                    .then((res) => {
                        console.log(res.data);
                        setUserForm({
                            name: "",
                            email: "",
                            mob: "",
                            caddress: "",
                            paddress: "",
                            info: "",
                            uname: "",
                            password: "",
                            status: ''
                        });
                        setSelectedUser(null);
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
    useEffect(() => {
        axios
            .get("http://localhost:4000/user/")
            .then((res) => {
                setUsergetForm(res.data.data);
                setSearchResult(res.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const updateUser = (_id) => {
        const selected = usergetForm.find((user) => user._id === _id);
        setSelectedUser(selected);
        setShowUserForm(true);
        setShowSearchForm(false);
        setIsVisibleStatus(true);
        const isChecked = selected.caddress === selected.paddress;
        setUserForm({
            name: selected.name,
            email: selected.email,
            mob: selected.mob,
            caddress: selected.caddress,
            paddress: selected.paddress,
            info: selected.info,
            uname: selected.uname,
            password: selected.password,
            status: selected.status
        });
        setIsChecked(isChecked);
    };
    const deleteUser = (_id) => {
        axios
            .delete("http://localhost:4000/user/delete-user/" + _id)
            .then(() => {
                console.log("Data successfully deleted!");

                // After deletion, fetch updated data
                axios
                    .get("http://localhost:4000/user/")
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
    // Filter items based on search criteria
    // const handleSearch = () => {
    //     if (searchName === "" && searchEmail === "") {

    //         setSearchResult([]);
    //         setTimeout(() => {
    //             setSearchResult(usergetForm);
    //         }, 1000)

    //     } else {
    //         const filteredItems = usergetForm.filter((user) => {
    //             return (
    //                 user.name.toLowerCase().includes(searchName.toLowerCase()) &&
    //                 user.email.toLowerCase().includes(searchEmail.toLowerCase())
    //             );
    //         });
    //         setSearchResult(filteredItems);
    //     }
    //     setCurrentPage(1); // Reset to the first page after search
    // };
    const handleSearch = () => {
        if (searchName === "" && searchEmail === "") {
            setSearchResult([]);
            setTimeout(() => {
                setSearchResult(usergetForm);
            }, 1000);
        } else {
            const filteredItems = usergetForm.filter((user) => {
                return (
                    user.name.toLowerCase().includes(searchName.toLowerCase()) &&
                    user.email.toLowerCase().includes(searchEmail.toLowerCase())
                );
            });
            setSearchResult(filteredItems);
        }
        setCurrentPage(1); // Reset to the first page after search
    };


    return (
        <Layout>
            <div className="container-fluid p-2">
                <div className="form-wrapper card p-2">
                    <div className="d-flex justify-content-between" style={{ borderBottom: "1px solid red" }}>
                        <div>
                            <p className="h5">Users</p>
                        </div>
                        <div>
                            <button className='searchBtn' onClick={toggleSearchForm} ><FontAwesomeIcon icon={faMagnifyingGlass} /> Search</button>
                            <button className='addBtn' onClick={toggleUserForm} ><FontAwesomeIcon icon={faPlus} /> Add User</button>
                        </div>
                    </div>
                    
                    {showSearchForm && (
                        <div className="searchDiv">
                            <div>
                                <p className='h6 pb-2 headigs'>Search User Master Group:</p></div>
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
                                    <label>Email</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by email"
                                        value={searchEmail}
                                        onChange={(e) => setSearchEmail(e.target.value)}
                                    />
                                </div>

                            </div>
                            <div className="text-end py-2">
                                <button className="btn btn-primary" onClick={handleSearch}>Search</button>
                            </div>
                        </div>
                    )}
                    {showUserForm && (
                        <form>
                            <div><p className='h6 pb-2 headigs'>Add New User Master Group:</p></div>
                            <div className="row">
                                <div className="col-sm-3">
                                    <label className="form-label my-0">Name</label><span className="text-danger">*</span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={userForm.name}
                                        onChange={inputsHandler}
                                    />
                                    {errors.name && (
                                        <div className="text-danger">{errors.name}</div>
                                    )}
                                </div>
                                <div className="col-sm-3">
                                    <label className="form-label my-0">Mobile number</label><span className="text-danger">*</span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="mob"
                                        value={userForm.mob}
                                        onChange={inputsHandler}
                                    />
                                    {errors.mob && (
                                        <div className="text-danger">{errors.mob}</div>
                                    )}
                                </div>
                                
                                <div className='col-sm-3'>
                                    <label className='form-label my-0'>Current address</label><span className="text-danger">*</span>
                                    <textarea className='form-control'
                                        type="text"
                                        value={userForm.caddress}
                                        onChange={handleCaddressChange}
                                    />
                                    {errors.caddress && (
                                        <div className="text-danger">{errors.caddress}</div>
                                    )}
                                </div>
                                <div className='col-sm-3'>
                                    <div className='d-flex justify-content-between'>
                                        <div>
                                            <label className='form-label my-0'> Permanent address </label><span className="text-danger">*</span>
                                        </div>
                                        <div>
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={handleCheckboxChange}
                                            />
                                            <small className='ps-0 my-0'> Same as current address</small>
                                        </div>
                                    </div>
                                    <textarea className='form-control'
                                        type="text"
                                        value={userForm.paddress}
                                        onChange={handlePaddressChange}
                                        disabled={isChecked}
                                    />
                                    {errors.paddress && (
                                        <div className="text-danger">{errors.paddress}</div>
                                    )}
                                </div>
                                <div className="col-sm-3">
                                    <label className="form-label my-0">Email-id</label><span className="text-danger">*</span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="email"
                                        value={userForm.email}
                                        onChange={inputsHandler}
                                    />
                                    {errors.email && (
                                        <div className="text-danger">{errors.email}</div>
                                    )}
                                </div>
                                <div className="col-sm-3 ">
                                    <label className="form-label my-0">Information</label><span className="text-danger">*</span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="info"
                                        value={userForm.info}
                                        onChange={inputsHandler}
                                    />
                                    {errors.info && (
                                        <div className="text-danger">{errors.info}</div>
                                    )}
                                </div>
                                {isVisibleStatus && (<div className="col-sm-4">
                                    <label className='form-label my-0'>Status</label><span className='text-danger'>*</span>
                                    <select
                                        className="form-control"
                                        value={userForm.status}
                                        onChange={handleStatusChange} >
                                        <option value="" disabled>Select status</option>
                                        <option value="0" className="text-danger">Inactive</option>
                                        <option value="1" className="text-primary">Active</option>
                                    </select>
                                </div>)}
                            </div>
                            <hr />
                            <div>
                                <p className='h6 pb-2 headigs'>User Login Details:</p>
                                <div className='row'>
                                    <div className='col-sm-3 mb-2'>
                                        <label className='form-label my-0'>User Name</label>
                                        <input type="text" className="form-control" name="uname" value={userForm.uname} onChange={inputsHandler} disabled />
                                    </div>
                                    <div className='col-sm-3'>
                                        
                                        <label className='form-label my-0'>Password</label><span className='text-danger'>*</span>
                                        {/* <input type="text" className="form-control" name="password" value={userForm.password} onChange={inputsHandler} /> 
                                        */}
                                        <div className="input-group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="form-control"
                                            name="password"
                                            value={userForm.password}
                                            onChange={inputsHandler}
                                        />
                                        <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                        >
                                                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                                        </button>
                                        </div>
                                        {errors.password && (
                                            <div className="text-danger">{errors.password}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="py-2 text-end">
                                <button type="submit" onClick={addUser} className="btn btn-primary">
                                    {selectedUser ? "Update" : "Submit"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
                <div className='card p-2 mt-2'>
                    {currentItems.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-striped my-0 table-bordered table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Mobile</th>
                                        <th scope="col" className='text-center'>Status</th>
                                        <th scope="col" className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* {usergetForm.map((user, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.mob}</td>
                                            <td>{user.caddress}</td>
                                            <td>{user.paddress}</td>
                                            <td>{user.info}</td>
                                            <td className="text-center">
                                                <button
                                                    className="btn btn-primary btn-sm me-2" onClick={() => updateUser(user._id)}>
                                                    <FontAwesomeIcon icon={faPenToSquare} /> Edit
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => deleteUser(user._id)}>
                                                    <FontAwesomeIcon icon={faTrashCan} /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })} */}

                                    {currentItems.map((user, index) => (

                                        <tr key={index}>
                                            <td>{indexOfFirstItem + index + 1}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.mob}</td>
                                            <td>
                                                <div className='text-center'>
                                                    {user.status === 1 ? <span class="badge rounded-pill text-bg-success">Active</span> : <span class="badge rounded-pill text-bg-danger">Inactive</span>}
                                                </div>
                                            </td>

                                            <td className="text-center">
                                              <div className="d-flex justify-content-center"> 
                                                <p className="me-2 my-0 text-primary pointer" onClick={() => updateUser(user._id)}>
                                                    <FontAwesomeIcon icon={faPenToSquare} />
                                                </p>
                                                    <p className="my-0 text-danger pointer"
                                                    onClick={() => deleteUser(user._id)}>
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
    )
}

export default Users;
