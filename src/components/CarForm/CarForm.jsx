import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";

const CarForm = ( props ) => {
    const [selectedCartype, setSelectedCartype] = useState('company');
    const handleCartypeChange = (event) => {
        setSelectedCartype(event.target.value);
        if (event.target.value === 'private') {
            const newFormData = {
                ...formData,
                car_name: 'PRIVATE',
            };
            setFormData(newFormData);    
        } else {
            const newFormData = {
                ...formData,
                car_name: '',
            };
            setFormData(newFormData);
        }
    }

    const [carOptions, setCarOptions] = useState([]);
    
    const navigate = useNavigate();

    useEffect(() => {
        const getCompanyCars = async () => {
            try {
                const response = await axios.get(
                    `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/employee/get-car`,
                );
                const companyCarOptions = response?.data?.message.filter(item => item.car_name !== "PRIVATE" && item?.department_name?.includes(props.departmentCar));
                setCarOptions(companyCarOptions);
            } catch (error) {
                console.error('Cannot get company cars!');
            }
        }

        getCompanyCars();

    }, [props.departmentCar]);

    const [formData, setFormData] = useState({
        car_type: selectedCartype,
        car_name: '',
        check_in_km: '',
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validateFormData(formData)) {
            try {
                const response = await axios.post(
                    `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/employee/update-attendance?attendanceID=${ props.attendance_id }`,
                    formData,
                );
                alert("Successfully update!");
                navigate('/schedule');
            } catch (error) {
                alert(error.response?.data?.message);
            }
        } else {
            alert('Kilometer kann nicht 0 sein!');
        }
    };   

    return (
        <>
        {/* Manually open the Form */}
        {/* <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#autofahrerForm">
            Open auto form
        </button> */}

        <div 
            style={{ display: props.position === 'Autofahrer' ? 'block' : 'none' }}
            className={`modal fade ${props.position === 'Autofahrer' ? 'show' : ''}`} 
            id="autofahrerForm" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" 
            aria-labelledby="autofahrerFormLabel" aria-hidden="true"
        >
            <div className="modal-dialog">
                {/* Header */}
                <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="autofahrerFormLabel">Autofahrer</h1>
                </div>

                {/* Body */}
                <div className="modal-body">
                    <div  className={`mb-3 ${ props.check_out ? 'd-none' : '' }`}>
                        <label className="form-label">Car type</label>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="car_type" 
                                value="company" 
                                checked={selectedCartype === "company"} 
                                onChange={handleCartypeChange}
                                id="companyCar"
                            />
                            <label className="form-check-label" htmlFor="companyCar">
                                Company
                            </label>
                        </div>
                        <div className="form-check mb-3">
                            <input className="form-check-input" type="radio" name="car_type" 
                                value="private"
                                checked={selectedCartype === "private"} 
                                onChange={handleCartypeChange}
                                id="privateCar"
                            />
                            <label className="form-check-label" htmlFor="privateCar">
                                Private
                            </label>
                        </div>

                        <div className={selectedCartype !== "company" ? 'd-none' : ''}>
                            <label className="form-label">Name</label>
                            <select 
                                className="form-select mb-3" 
                                name="car_name"
                                onChange={ handleInputChange }
                            >
                                <option value="">Choose...</option>
                                {carOptions?.map(option => (
                                    <option key={ option._id } value={ option.car_name }>
                                        { option.car_name }
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div  className="">
                            <label className="form-label">Number of kilometers (check-in)</label>
                            <div className="input-group mb-3">
                                <input 
                                    type="number" className="form-control" 
                                    placeholder="Enter number of kilometers" 
                                    name="check_in_km" 
                                    value={ formData.check_in_km }
                                    onChange={ handleInputChange }
                                />
                                <span className="input-group-text" >kilometer(s)</span>
                            </div>
                        </div>
                    </div>

                    <div className={`mb-3 ${ props.check_out ? '' : 'd-none' }`}>
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
                    <a type="button" className="btn btn-secondary" href="/schedule">Close</a>
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

export default CarForm;
