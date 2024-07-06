import { useState, useContext } from "react";
import axios from "axios";
import { format } from "date-fns";

import { AuthContext } from "../../context/AuthContext";
import Navigation from "../../components/Navigation/Navigation";
import RequestHistory from "../../components/RequestHistory/RequestHistory";
import BootstrapDatepicker from "../../components/BootstrapDatepicker/BootstrapDatepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./VacationRequest.css"

const VacationRequest = () => {

    const [isLoading, setIsLoading] = useState(false);

    const [type, setType] = useState('Holiday');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [requestImg, setRequestImg] = useState()

    const getLocaleDate = (inputDate) => {
        const year = inputDate.getFullYear();
        const month = inputDate.getMonth() + 1;
        const day = inputDate.getDate();
        const localeDate = `${month}/${day}/${year}`;

        return localeDate;
    }

    const {
        user: { id: userID }
    } = useContext(AuthContext);

    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;

    const baseUrl = process.env.REACT_APP_BASE_API_URL;

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('request_dayOff_start', getLocaleDate(startDate));
        formData.append('request_dayOff_end', getLocaleDate(endDate));
        formData.append('request_content', type);
        if (requestImg !== undefined) {
            formData.append('image', requestImg);
        } else {
            if (type === 'Sick day') {
                alert("Image cannot be empty!");
                return
            }
        }

        setIsLoading(true);
        try {
            const response = await axios.post(
                `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/employee/create-request?employeeID=${userID}&employeeName=${userObject.name}`,
                formData,
            );
            alert("Successfully sent the request!");
            setIsLoading(false);
        } catch (err) {
            alert(err?.response?.data?.message);
            setIsLoading(false);
        }
    }

    return (
        <>
            <Navigation />
            <div className="container p-4 mt-5">
                <h4 className="mb-3">Urlaubsbeantragung</h4>

                <label className="form-label">Anfangsdatum</label>
                <div className="mb-3">
                    <BootstrapDatepicker
                        wrapperClassName="datepicker"
                        className="form-control requestInput"
                        dateFormat="dd/MM/yyyy"
                        name="request_dayOff_start"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                    />
                </div>

                <label className="form-label">Enddatum</label>
                <div className="mb-3 w-100">
                    <BootstrapDatepicker
                        wrapperClassName="datepicker"
                        className="form-control requestInput w-100"
                        dateFormat="dd/MM/yyyy"
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                    />
                </div>

                {type === "Sick day" && (<div className="mb-3">
                    <label htmlFor="formFile" className="form-label">Image</label>
                    <input className="form-control requestInput" type="file" id="formFile" onChange={(img) => setRequestImg(img.target.files[0])} />
                </div>)}

                <label className="form-label">Type</label>
                <div className="mb-3">
                    <input
                        type="radio" className="btn-check"
                        name="request_content" id="holidayOption"
                        autoComplete="off"
                        value="Normal"
                        onChange={() => setType("Normal")}
                    />
                    <label className="btn btn-outline-primary" htmlFor="holidayOption">Urlaub</label>

                    <div className="vr m-1"></div>

                    <input
                        type="radio" className="btn-check"
                        name="request_content" id="sickdayOption"
                        autoComplete="off"
                        value="Sick day"
                        onChange={() => setType("Sick day")}
                    />
                    <label className="btn btn-outline-primary" htmlFor="sickdayOption">Krankheitstage mit AU-Bescheinigung</label>
                </div>

                <div className="">
                    <button
                        className="btn btn-primary"
                        onClick={handleFormSubmit}
                        disabled={isLoading}
                    >
                        <span name="loading" aria-hidden="true"
                            className={
                                `spinner-border spinner-border-sm me-2
                            ${isLoading ? '' : 'd-none'}`
                            }
                        ></span>
                        <span name="loading" className={`${isLoading ? '' : 'd-none'}`} role="status">Sending...</span>
                        <span name="submitBtn" className={`${isLoading ? 'd-none' : ''}`}>Anfrage senden</span>
                    </button>

                    <RequestHistory />
                </div>
            </div>
        </>
    );
}

export default VacationRequest;
