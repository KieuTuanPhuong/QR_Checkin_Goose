import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

import Navigation from "../../components/Navigation/Navigation";
import CoworkerCard from "../../components/CoworkerCard/CoworkerCard";

const TodayShifts = () => {
    const date = new Date();
    const [shiftObj, setShiftObj] = useState([]);

    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;

    const today = format(date, 'MM/dd/yyy');
    useEffect(() => {
        const baseUrl = process.env.REACT_APP_BASE_API_URL;

        const getCoWorker = async () => {
            try {
                const response = await axios.get(
                    baseUrl + `/api/employee/get-co-worker/get-by-date?date=${today}&employeeID=${userObject?.id}&employeeName=${userObject?.name}`
                );
                setShiftObj(response?.data?.data);
            } catch (error) {
                console.error('No shifts found today!');
            }
        }
        getCoWorker();
    }, []);

    return (
        <>
        <Navigation />
        {shiftObj?.length === 0 ? (<div>No employees</div>) : (<div className="container mt-5">
            {shiftObj?.map((item, index) => {
                return <CoworkerCard
                    key={index}
                    department={item.department}
                    shifts={item.shifts}
                    user={userObject}
                />
            })}

        </div>)}
        </>
    );
}

export default TodayShifts;
