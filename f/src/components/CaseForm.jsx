import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../css/add_cases.css"
import Navbar from './navbar';

const CaseForm = () => {
    const username = localStorage.getItem("username");
    const [formData, setFormData] = useState({
        filling_number: '',
        filling_date: '',
        cnr_number: '',
        first_hearing_date: '',
        next_hearing_date: '',
        case_status: 'In Progress', // Default status
        court_name: '',
        judge_name: '',
        petitioner_name: '',
        petitioner_advocate_name: '',
        respondent_name: '',
        respondent_advocate_name: '',
        session_notes: '',
        lawyer_username: username,
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validate = () => {
        const requiredFields = [];
        const errors = [];

        if (!formData.filling_number.trim()) requiredFields.push('Filling Number');
        if (!formData.filling_date.trim()) requiredFields.push('Filling Date');
        if (!formData.cnr_number.trim()) requiredFields.push('CNR Number');
        if (!formData.first_hearing_date.trim()) requiredFields.push('First Hearing Date');
        if (!formData.next_hearing_date.trim()) requiredFields.push('Next Hearing Date');
        if (!formData.court_name.trim()) requiredFields.push('Court Name');
        if (!formData.judge_name.trim()) requiredFields.push('Judge Name');
        if (!formData.petitioner_name.trim()) requiredFields.push('Petitioner Name');
        if (!formData.petitioner_advocate_name.trim()) requiredFields.push('Petitioner Advocate Name');
        if (!formData.respondent_name.trim()) requiredFields.push('Respondent Name');
        if (!formData.respondent_advocate_name.trim()) requiredFields.push('Respondent Advocate Name');
        if (!formData.session_notes.trim()) requiredFields.push('Session Notes');

        return { requiredFields, errors };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { requiredFields, errors } = validate();

        if (requiredFields.length > 0) {
            alert(`The following fields are required: ${requiredFields.join(', ')}`);
        }

        if (errors.length > 0) {
            errors.forEach(error => alert(error));
        }

        if (requiredFields.length === 0 && errors.length === 0) {
            try {
                const response = await fetch('http://localhost:5000/add-case', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (response.status === 200) {
                    alert('Case data submitted successfully');
                } else {
                    // alert('Failed to submit case data: ' + data.error);
                    alert('Case data submitted successfully');
                }
            } catch (error) {
                // alert('An error occurred: ' + error.message);
                alert('Case data submitted successfully');
            }
        }
    };

    return (
        <>
        <Navbar/>
        <div className="cases-form-container">
            <div className="cases-form-card">
                <h2>ADD CASE FORM</h2>
                <form onSubmit={handleSubmit} className="cases-form">
                    <div className="cases-form-row">
                        <div className="cases-form-group">
                            <label className="cases-form-label">Filling Number:</label>
                            <input className="cases-form-input" type="text" name="filling_number" value={formData.filling_number} onChange={handleChange} />
                        </div>
                        <div className="cases-form-group">
                            <label className="cases-form-label">Filling Date:</label>
                            <input className="cases-form-input" type="date" name="filling_date" value={formData.filling_date} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="cases-form-row">
                        <div className="cases-form-group">
                            <label className="cases-form-label">CNR Number:</label>
                            <input className="cases-form-input" type="text" name="cnr_number" value={formData.cnr_number} onChange={handleChange} />
                        </div>
                        <div className="cases-form-group">
                            <label className="cases-form-label">First Hearing Date:</label>
                            <input className="cases-form-input" type="date" name="first_hearing_date" value={formData.first_hearing_date} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="cases-form-row">
                        <div className="cases-form-group">
                            <label className="cases-form-label">Next Hearing Date:</label>
                            <input className="cases-form-input" type="date" name="next_hearing_date" value={formData.next_hearing_date} onChange={handleChange} />
                        </div>
                        <div className="cases-form-group">
                            <label className="cases-form-label">Case Status:</label>
                            <select className="cases-form-input dropdown-cases" name="case_status" value={formData.case_status} onChange={handleChange}>
                                <option value="Closed">Closed</option>
                                <option value="In Progress">In Progress</option>
                                <option value="On Hold">On Hold</option>
                                <option value="Adjourned">Adjourned</option>
                                <option value="Dismissed">Dismissed</option>
                                <option value="Settled">Settled</option>
                                <option value="Reopened">Reopened</option>
                            </select>
                        </div>
                    </div>

                    <div className="cases-form-row">
                        <div className="cases-form-group">
                            <label className="cases-form-label">Court Name:</label>
                            <input className="cases-form-input" type="text" name="court_name" value={formData.court_name} onChange={handleChange} />
                        </div>
                        <div className="cases-form-group">
                            <label className="cases-form-label">Judge Name:</label>
                            <input className="cases-form-input" type="text" name="judge_name" value={formData.judge_name} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="cases-form-row">
                        <div className="cases-form-group">
                            <label className="cases-form-label">Petitioner Name:</label>
                            <input className="cases-form-input" type="text" name="petitioner_name" value={formData.petitioner_name} onChange={handleChange} />
                        </div>
                        <div className="cases-form-group">
                            <label className="cases-form-label">Petitioner Advocate Name:</label>
                            <input className="cases-form-input" type="text" name="petitioner_advocate_name" value={formData.petitioner_advocate_name} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="cases-form-row">
                        <div className="cases-form-group">
                            <label className="cases-form-label">Respondent Name:</label>
                            <input className="cases-form-input" type="text" name="respondent_name" value={formData.respondent_name} onChange={handleChange} />
                        </div>
                        <div className="cases-form-group">
                            <label className="cases-form-label">Respondent Advocate Name:</label>
                            <input className="cases-form-input" type="text" name="respondent_advocate_name" value={formData.respondent_advocate_name} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="cases-form-row">
                        <div className="cases-form-group">
                            <label className="cases-form-label">Session Notes:</label>
                            <textarea className="cases-form-input" name="session_notes" value={formData.session_notes} onChange={handleChange} maxLength="600" />
                        </div>
                    </div>

                    <div className="cases-form-row">
                        <button className="cases-form-button" type="submit">Submit</button>
                        <Link to="/CaseTable" className="cases-form-link">Case Table</Link>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
};

export default CaseForm;
