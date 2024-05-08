import React, { useState } from 'react';
import Layout from "../components/Layouts/Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';

function Subject() {
    const [userForm, setUserForm] = useState({
        name: "",
        mob: "",
        email: "",
        caddress: "",
        paddres: "",
        info: ""
    });

    const inputsHandler = (e) => {
        setUserForm((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const addUser = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        // Add logic to submit user data
        console.log("User data:", userForm);
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
                            <button><FontAwesomeIcon icon={faMagnifyingGlass} /> Search</button>
                            <button><FontAwesomeIcon icon={faPlus} /> Add User</button>
                        </div>
                    </div>
                    <form>
                        <div className="row">
                            <div className="col-sm-3 mb-3">
                                <label className="form-label my-0">Name</label><span className="text-danger">*</span>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={userForm.name}
                                    onChange={inputsHandler}
                                />
                            </div>
                            <div className="col-sm-3 mb-3">
                                <label className="form-label my-0">Mobile number</label><span className="text-danger">*</span>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="mob"
                                    value={userForm.mob}
                                    onChange={inputsHandler}
                                />
                            </div>
                            <div className="col-sm-3 mb-3">
                                <label className="form-label my-0">Email-id</label><span className="text-danger">*</span>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="email"
                                    value={userForm.email}
                                    onChange={inputsHandler}
                                />
                            </div>
                            <div className="col-sm-3 mb-3">
                                <label className="form-label my-0">Current address</label><span className="text-danger">*</span>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="caddress"
                                    value={userForm.caddress}
                                    onChange={inputsHandler}
                                />
                            </div>
                            <div className="col-sm-3 mb-3">
                                <label className="form-label my-0">Permanent address</label><span className="text-danger">*</span>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="paddres"
                                    value={userForm.paddres}
                                    onChange={inputsHandler}
                                />
                            </div>
                            <div className="col-sm-3 mb-3">
                                <label className="form-label my-0">Information</label><span className="text-danger">*</span>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="info"
                                    value={userForm.info}
                                    onChange={inputsHandler}
                                />
                            </div>
                        </div>
                        <div className="py-2 text-end">
                            <button type="submit" onClick={addUser} className="btn btn-primary">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default Subject;
