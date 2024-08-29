npm install -g json-server
npm install json-server --save-dev
{
  "clients": []
}
json-server --watch db.json --port 5000
npm install axios


import React, { useState } from 'react';
import axios from 'axios';

const MyFormComponent = () => {
    const [clientForm, setClientForm] = useState({
        name: "",
        phone: "",
        email: "",
        project: "",
        status: "1"
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Post data to JSON Server
            const response = await axios.post('http://localhost:5000/clients', clientForm);
            console.log('Form data saved:', response.data);
            // Optionally, clear the form or handle further logic
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const inputsHandler = (e) => {
        const { name, value } = e.target;
        setClientForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <p className='h6 pb-2 headigs'>Add New Clients Master Group:</p>
            </div>
            <div className="row mx-0">
                <div className="col-sm-3">
                    <label className="form-label my-0">Name</label><span className="text-danger">*</span>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={clientForm.name || ''}
                        onChange={inputsHandler}
                    />
                </div>
                <div className="col-sm-3">
                    <label className="form-label my-0">Phone number</label><span className="text-danger">*</span>
                    <input
                        type="text"
                        className="form-control"
                        name="phone"
                        value={clientForm.phone || ''}
                        onChange={inputsHandler}
                    />
                </div>
                <div className="col-sm-3">
                    <label className="form-label my-0">Projects</label><span className="text-danger">*</span>
                    <input
                        type="text"
                        className="form-control"
                        name="project"
                        value={clientForm.project || ''}
                        onChange={inputsHandler}
                    />
                </div>
                <div className="col-sm-3">
                    <label className="form-label my-0">Email-id</label><span className="text-danger">*</span>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={clientForm.email || ''}
                        onChange={inputsHandler}
                    />
                </div>
                <div className="col-sm-4">
                    <label className='form-label my-0'>Status</label><span className='text-danger'>*</span>
                    <select
                        className="form-control"
                        name="status"
                        value={clientForm.status}
                        onChange={inputsHandler}
                    >
                        <option value="" disabled>Select status</option>
                        <option value="0" className="text-danger">Upcoming</option>
                        <option value="1" className="text-warning">Inprogress</option>
                        <option value="2" className="text-success">completed</option>
                    </select>
                </div>
            </div>
            <div className="text-end p-2">
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </div>
        </form>
    );
};

export default MyFormComponent;
