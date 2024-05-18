import React, { useState } from 'react'
import Layout from '../components/Layouts/Layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlus, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

function Section() {
    const [sectionForm, setSectionForm] = useState({
        name: "",
        description: "",
        status: "1",
    });

    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [searchDiv, setSearchDiv] = useState(false);
    const [addDiv, setAddDiv] = useState(true);
    const [hideStatus, setHideStatus] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSectionForm((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        validateField(name);
    };

    const validateField = (fieldName) => {
        let isValid = true;
        const newErrors = { ...errors };

        switch (fieldName) {
            case 'name':
                if (!sectionForm.name || !sectionForm.name.trim()) {
                    newErrors.name = "Name is required";
                    isValid = false;
                } else if (!/^[A-Z]/.test(sectionForm.name.trim())) {
                    newErrors.name = "Name should start with a capital letter";
                    isValid = false;
                } else if (/^\s/.test(sectionForm.name)) {
                    newErrors.name = "Name should not start with a space";
                    isValid = false;
                } else {
                    delete newErrors.name;
                }
                break;
            case 'description':
                if (!sectionForm.description || !sectionForm.description.trim()) {
                    newErrors.description = "Description is required";
                    isValid = false;
                } else {
                    delete newErrors.description;
                }
                break;
            case 'status':
                if (!sectionForm.status) {
                    newErrors.status = "Status is required";
                    isValid = false;
                } else {
                    delete newErrors.status;
                }
                break;
          
            default:
                break;
        }

        setErrors(newErrors);
        checkFormValidity(newErrors);
        return isValid;
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        // Validate all fields
        if (!validateField('name')) isValid = false;
        if (!validateField('description')) isValid = false;
        if (!validateField('status')) isValid = false;

        setErrors(newErrors);
        checkFormValidity(newErrors);
        return isValid;
    };

    const checkFormValidity = (errors) => {
        const hasErrors = Object.keys(errors).length > 0;
        setTimeout(() => {
            setIsFormValid(!hasErrors);
        }, 1000)
    };

    const searchBtn = () => {
        setSearchDiv(true);
        setAddDiv(false);
    };

    const addBtn = () => {
        setSearchDiv(false);
        setAddDiv(true);
        setHideStatus(false);

    };

    const addSection = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log(sectionForm);
            setSectionForm({
                name: "",
                description: "",
                status: ''
            });
        }
     
     
    };

    const handleStatusChange = (e) => {
        const { value } = e.target;
        setSectionForm(prevState => ({
            ...prevState,
            status: value
        }));
    };

    const editBtn = () => {
        setHideStatus(true);
        setSearchDiv(false);
    };

    const heading = {
        borderBottom: '1px solid red'
    };

    return (
        <>
            <Layout>
                <div className='container-fluid p-2'>
                    <div className='card'>
                        <div className='d-flex justify-content-between py-1 px-2' style={heading}>
                            <div>
                                <p className='my-0 h5'>Section Master</p>
                            </div>
                            <div>
                                <button className='me-1 searchBtn' onClick={searchBtn}><FontAwesomeIcon icon={faMagnifyingGlass} /> Search</button>
                                <button className="addBtn" onClick={addBtn}><FontAwesomeIcon icon={faPlus} /> Add Section</button>
                            </div>
                        </div>
                        <div className="container-fluid p-2">
                            {searchDiv && (
                                <div className='searchForm'>
                                    <p className='my-0 p-2'>Search Section Master Group:</p>
                                </div>
                            )}
                            {addDiv && (
                                <div className='addForm'>
                                    <form>
                                        <div className='row'>
                                            <div className='col-sm-3'>
                                                <label className='form-label my-0'>Name</label><span className="text-danger">*</span>
                                                <input type="text" className='form-control' name='name' value={sectionForm.name} onChange={handleInputChange} onBlur={handleBlur} />
                                                {errors.name && (
                                                    <div className="text-danger">{errors.name}</div>
                                                )}
                                            </div>
                                            <div className='col-sm-3'>
                                                <label className='form-label my-0'>Description</label><span className="text-danger">*</span>
                                                <input type="text" className="form-control" name='description' value={sectionForm.description} onChange={handleInputChange} onBlur={handleBlur} />
                                                {errors.description && (
                                                    <div className="text-danger">{errors.description}</div>
                                                )}
                                            </div>
                                            {hideStatus && (
                                                <div className="col-sm-3">
                                                    <label className="form-label my-0">Status</label><span className="text-danger">*</span>
                                                    <select
                                                        className="form-control"
                                                        value={sectionForm.status}
                                                        onChange={handleStatusChange}
                                                        onBlur={handleBlur}
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
                                        <div className="text-end">
                                            <button className='btn btn-primary' onClick={addSection} disabled={!isFormValid}>Submit</button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='card p-2 mt-2'>
                        <div className='table-responsive'>
                            <table className='table table-bordered table-striped'>
                                <thead className='table-dark'>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th className="text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>01</td>
                                        <td>Snehal</td>
                                        <td>VS</td>
                                        <td className='text-center'>
                                            <span className='text-primary me-2' onClick={editBtn}><FontAwesomeIcon icon={faPenToSquare} /></span>
                                            <span className='text-danger'><FontAwesomeIcon icon={faTrashCan} /></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default Section;
