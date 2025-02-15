import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LitoFormForgot = ( props ) => {
   const [formData, setFormData] = useState({
        bar: '',
        kredit_karte: '',
        kassen_schniff: '',
        gesamt_ligerbude: '',
        gesamt_liegerando: '',
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
    const baseUrl = process.env.REACT_APP_BASE_API_URL;

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = convertValuesToNumber(formData);

        if (validateFormData(data)) {
            try {
                const response = await axios.post(
                    `${baseUrl}/api/employee/update-attendance?attendanceID=${ props.attendance_id_forgot }`,
                    data,
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
        {/* <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#litoForm">
            Open lito form
        </button> */}

        <div 
            style={{ display: props.positionForgot === 'Lito' ? 'block' : 'none' }}
            className={`modal fade ${props.positionForgot === 'Lito' ? 'show' : ''}`} 
            id="litoForm" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" 
            aria-labelledby="litoFormLabel" aria-hidden="true"
        >
            <div className="modal-dialog">
                {/* Header */}
                <div className="modal-content">
                <div className="modal-header d-flex flex-column align-items-start">
                    <h1 className="modal-title" id="litoFormLabel">Filiale { props.department }</h1>
                    <h3 className="modal-title fs-5">Lito</h3>
                    {/* <h3><span className="badge text-bg-success">{ props.time }</span></h3> */}
                </div>

                {/* Body */}
                <div className="modal-body">
                    <div className=" mb-3">
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
                        <label>Kreditkarte</label>
                        <input
                            type="" placeholder="1234,00" 
                            className="form-control" 
                            name='kredit_karte'
                            value={ formData.kredit_karte }
                            onChange={ handleInputChange }
                            min="0"
                            pattern="[0-9]+([\.,][0-9]+)?" step="0.01"
                        />
                        <div className="invalid-feedback">
                            This field is required.
                        </div>
                    </div>

                    <div className="mb-3">                        
                        <label>Kassenschnitt</label>
                        <input   
                            type="" placeholder="1234,00" 
                            className="form-control" 
                            name='kassen_schniff'
                            value={ formData.kassen_schniff }
                            onChange={ handleInputChange }
                            min="0"
                            pattern="[0-9]+([\.,][0-9]+)?" step="0.01"
                        />
                        <div className="invalid-feedback">
                            This field is required.
                        </div>
                    </div>

                    <div className="mb-3">
                        <label>Gesamt Liferbude</label>
                        <input   
                            type="" placeholder="1234,00" 
                            className="form-control" 
                            name='gesamt_ligerbude'
                            value={ formData.gesamt_ligerbude }
                            onChange={ handleInputChange }
                            min="0"
                            pattern="[0-9]+([\.,][0-9]+)?" step="0.01"
                        />
                        <div className="invalid-feedback">
                            This field is required.
                        </div>
                    </div>

                    <div className="mb-3">                        
                        <label>Gesamt Liferando</label>
                        <input   
                            type="" placeholder="1234,00" 
                            className="form-control" 
                            name='gesamt_liegerando'
                            value={ formData.gesamt_liegerando }
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

export default LitoFormForgot;
