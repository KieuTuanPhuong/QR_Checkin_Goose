import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";

const CarFormForget = ( props ) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        check_out_km: '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const newFormData = {
            ...formData,
            [name]: value,
        };
    
        setFormData(newFormData);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/employee/update-attendance?attendanceID=${ props.attendance_id_forgot }`,
                formData,
            );
            alert("Successfully update!");
            navigate('/schedule');
        } catch (error) {
            alert(error.response?.data?.message);
        }
    };   

    return (
        <>
        {/* Manually open the Form */}
        {/* <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#autofahrerForm">
            Open auto form
        </button> */}

        <div 
            style={{ display: props.positionForgot === 'Autofahrer' ? 'block' : 'none' }}
            className={`modal fade ${props.positionForgot === 'Autofahrer' ? 'show' : ''}`} 
            id="autofahrerForm" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" 
            aria-labelledby="autofahrerFormLabel" aria-hidden="true"
        >
            <div className="modal-dialog">
                {/* Header */}
                <div className="modal-content">
                <div className="modal-header d-flex flex-column align-items-start">
                    <h1 className="modal-title" id="litoFormLabel">Filiale { props.department }</h1>
                    <h3 className="modal-title fs-5">Autofahrer</h3>
                    {/* <h3><span className="badge text-bg-success">{ props.time }</span></h3> */}
                </div>

                {/* Body */}
                <div className="modal-body">
                    <div className="mb-3">
                        <label className="form-label">Number of kilometers (check-out)</label>
                        <div className="input-group">
                            <input 
                                type="number" className="form-control" 
                                placeholder="Enter number of kilometers"
                                name="check_out_km" 
                                value={ formData.check_out_km }
                                onChange={ handleInputChange }
                            />
                            <span className="input-group-text" >kilometer(s)</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button 
                        type="button" className="btn btn-secondary" 
                        data-bs-dismiss="modal"
                        onClick={ handleSubmit }
                    >
                        Submit
                    </button>                
                </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default CarFormForget;