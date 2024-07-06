import axios from "axios";
import { useEffect, useState } from "react";

import RequestLog from "./RequestLog";
import { de } from "date-fns/locale";

const RequestHistory = () => {
    const [requestLogs, setRequestLogs] = useState([]);
    const [timeStamp, setTimeStamp] = useState();

    useEffect(() => {
        const updateTimestamp = () => {
            const currentTimestamp = new Date().getTime();
            setTimeStamp(currentTimestamp);
        };
    
        updateTimestamp();
    
        const intervalId = setInterval(updateTimestamp, 10000);
    
        return () => clearInterval(intervalId);
    }, []);

    const thirtyDaysAgo = timeStamp - (30 * 24 * 60 * 60 * 1000);

    const baseUrl = process.env.REACT_APP_BASE_API_URL;

    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;

    const getRequestHistory = async () => {
        try {
            const response = await axios.get(
                `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/employee/get-all-request?employeeID=${userObject.id}&employeeName=${userObject.name}`
            );
            setRequestLogs(response?.data?.message);
        } catch (error) {
            alert(error.response?.data?.message);
        }
    }

    const getLocaleDate = (inputDate) => {
        const dateObj = new Date(inputDate);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        const localeDate = `${month}/${day}/${year}`;

        return localeDate;
    }

    const requestList = requestLogs.map((request) => {
        const lastUpdated = Date.parse(request?.updatedAt);
        const status = request?.answer_status;

        if (lastUpdated >= thirtyDaysAgo) {
            return (
                <RequestLog 
                    request={request} key={request._id} 
                    createdAt={getLocaleDate(request.createdAt)}
                    answer_status={request.answer_status}
                    request_dayOff_start={getLocaleDate(request.request_dayOff_start)}
                    request_dayOff_end={getLocaleDate(request.request_dayOff_end)}
                    request_content={request.request_content}
                />
            );
        } else if (lastUpdated < thirtyDaysAgo && status == 'pending') {
            return (
                <RequestLog 
                    request={request} key={request._id} 
                    createdAt={getLocaleDate(request.createdAt)}
                    answer_status={request.answer_status}
                    request_dayOff_start={getLocaleDate(request.request_dayOff_start)}
                    request_dayOff_end={getLocaleDate(request.request_dayOff_end)}
                    request_content={request.request_content}
                />
            );
        }
    });

    return (
        <>
        <button 
            type="button" className="btn btn-secondary ms-3" 
            data-bs-toggle="modal" data-bs-target="#requestHistory"
            onClick={ getRequestHistory }
        >
            Anfrageverlauf
        </button>

        <div 
            className="modal fade" id="requestHistory" 
            tabIndex="-1" aria-labelledby="historyLabel" 
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="historyLabel">Anfrageverlauf</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <ul className="list-group">
                        { requestList }
                    </ul>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>        
        </>
    );
}

export default RequestHistory;
