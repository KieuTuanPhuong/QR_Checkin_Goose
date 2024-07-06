import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ServiceFormForgot = ( props ) => {
    const [formData, setFormData] = useState({
        bar: '',
        gesamt: '',
        trinked_ec: '',
        trink_geld: '',
        auf_rechnung: '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const newFormData = {
            ...formData,
            [name]: value,
        };
    
        setFormData(newFormData);
    };

    const navigate = useNavigate();

    const validateFormData = (data) => {
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            if (Number(data[key]) < 0) {
              return false;
            }
          }
        }
        return true;
    };

    const convertValuesToNumber = (obj) => {
        let convertedObj = {};
      
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            let value = obj[key].replace(',', '.');
            convertedObj[key] = parseFloat(value);
          }
        }
      
        return convertedObj;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = convertValuesToNumber(formData);

        if (validateFormData(data)) {
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
        } else {
            alert('Der Wert kann nicht kleiner als 0 sein!');
        }
    };    
    
    return (
        <>
        {/* Manually open the Form */}
        {/* <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#serviceForm">
            Open service form
        </button> */}

        <div 
            style={{ display: props.positionForgot === 'Service' ? 'block' : 'none' }}
            className={`modal fade ${props.positionForgot === 'Service' ? 'show' : ''}`} 
            id="serviceForm" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" 
            aria-labelledby="serviceFormLabel" aria-hidden="true"
        >
            <div className="modal-dialog">
                {/* Header */}
                <div className="modal-content">
                <div className="modal-header d-flex flex-column align-items-start">
                    <h1 className="modal-title" id="litoFormLabel">Filiale { props.department }</h1>
                    <h3 className="modal-title fs-5">Service</h3>
                    {/* <h3><span className="badge text-bg-success">{ props.time }</span></h3> */}
                </div>

                {/* Body */}
                <div className="modal-body">
                    <div className="mb-3">
                        <label>BAR</label>
                        <input 
                            type="" placeholder="1234,00"
                            className="form-control" 
                            name='bar'
                            value={ formData.bar }
                            onChange={ handleInputChange }
                            min="0"
                            pattern="[0-9]+([\.,][0-9]+)?" step="0.01"
                        />
                        <div className="invalid-feedback">
                            This field is required.
                        </div>
                    </div>

                    <div className="mb-3">
                        <label >Gesamt</label>
                        <input   
                            type="" placeholder="1234,00"
                            className="form-control" 
                            name='gesamt'
                            value={ formData.gesamt }
                            onChange={ handleInputChange }
                            min="0"
                            pattern="[0-9]+([\.,][0-9]+)?" step="0.01"
                        />
                        <div className="invalid-feedback">
                            This field is required.
                        </div>
                    </div>

                    <div className="mb-3">
                        <label>Trinkgeld EC</label>
                        <input   
                            type="" placeholder="1234,00" 
                            className="form-control" 
                            name='trinked_ec'
                            value={ formData.trinked_ec }
                            onChange={ handleInputChange }
                            min="0"
                            pattern="[0-9]+([\.,][0-9]+)?" step="0.01"
                        />
                        <div className="invalid-feedback">
                            This field is required.
                        </div>
                    </div>

                    <div className="mb-3">
                        <label>Trinkgeld Gutschein</label>
                        <input   
                            type="" placeholder="1234,00" 
                            className="form-control" 
                            name='trink_geld'
                            value={ formData.trink_geld }
                            onChange={ handleInputChange }
                            min="0"
                            pattern="[0-9]+([\.,][0-9]+)?" step="0.01"
                        />
                        <div className="invalid-feedback">
                            This field is required.
                        </div>
                    </div>

                    <div className="mb-3">
                        <label>Auf Rechnung</label>
                        <input   
                            type="" placeholder="1234,00" 
                            className="form-control" 
                            name='auf_rechnung'
                            value={ formData.auf_rechnung }
                            onChange={ handleInputChange }
                            min="0"
                            pattern="[0-9]+([\.,][0-9]+)?" step="0.01"
                        />
                        <div className="invalid-feedback">
                            This field is required.
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

export default ServiceFormForgot;