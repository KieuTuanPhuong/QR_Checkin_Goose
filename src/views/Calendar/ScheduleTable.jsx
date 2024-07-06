import { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import "./calendar.css";
import axios from 'axios';
import { format, toDate, formatISO } from 'date-fns';
import { useNavigate } from "react-router-dom";

import Navigation from '../../components/Navigation/Navigation';
import { AuthContext } from '../../context/AuthContext';

const ScheduleTable = (props) => {
    const { id, name, departmentDefined, role } = props
    const [selectedYear, setSelectedYear] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [FormState, setFormState] = useState(false);
    const [inforShiftFormState, setInforShiftFormState] = useState(true);
    const [selectedDate, setSelectedDate] = useState("");
    const [dateFormDb, setDateFormDb] = useState("")
    const [selectedShift, setSelectedShift] = useState(null);
    const [scheduleDataByDate, setScheduleDataByDate] = useState()
    const [scheduleEmployee, setScheduleEmployee] = useState()
    const [shiftDataByDate, setShiftDataByDate] = useState()
    const [selectedDepartmentEmployee, setSelectedDepartmentEmployee] = useState('');
    const [shiftList, setShiftList] = useState()

    const [checkInhaber, setCheckInhaber] = useState(false)
    const [checkManager, setCheckManager] = useState(false)

    const navigate = useNavigate()
    const handleShiftClick = (shift) => {
        setSelectedShift(shift);
    };

    useEffect(() => {
        navigate("/schedule")
    }, [])
    
    const {
        user: { id: userID }
    } = useContext(AuthContext)

    const baseUrl = process.env.REACT_APP_BASE_API_URL;

    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;

    const fetchScheduleEmployyee = async () => {

        try {
            const response = await axios.get(
                baseUrl + `/api/employee/get-schedules?employeeID=${userObject?.id}&employeeName=${userObject?.name}`,
                { withCredentials: true }
            );
            setScheduleEmployee(response.data);
        } catch (error) {
            console.error("Error fetching employee data:", error);
        }
    };

    useEffect(() => {
        if (userObject?.role === 'Inhaber') {
            setSelectedDepartmentEmployee(userObject?.department_name)
            setCheckInhaber(true)
            setCheckManager(false)
        }
    }, [userObject?.role, userObject?.department_name]);

    useEffect(() => {
        const getAllShifts = async () => {
            if (userObject?.role === "Inhaber") {
                try {
                    const response = await axios.get(
                        baseUrl + '/api/inhaber/manage-shift/get-all',
                        { withCredentials: true }
                    );
                    setShiftList(response.data.message);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };
        getAllShifts()

        fetchScheduleEmployyee();

        const fetchScheduleDataByDate = async () => {
            try {
                const year = selectedDate.substring(0, 4);
                const month = selectedDate.substring(5, 7);
                const day = selectedDate.substring(8, 10)
                const date = `${month}/${day}/${year}`
                const response = await axios.get(
                    baseUrl + `/api/employee/get-schedules?employeeID=${userObject?.id}&employeeName=${userObject?.name}&date=${date}`,
                    { withCredentials: true }
                );

                setScheduleDataByDate(response.data.message);
            } catch (error) {
                if (error.response && error.response.status) {
                    if (error.response.status === 404) {
                        setScheduleDataByDate([])
                    }
                } else {
                    console.error("Error fetching schedule data:", error.message);
                }
            }
        };
        if (selectedDate !== "") {
            fetchScheduleDataByDate();
        }
    }, [id, selectedDate, dateFormDb, role, userObject?.role, userObject?.name, userObject?.role]); 

    const renderTileContent = ({ date }) => {
        if (!scheduleEmployee || !scheduleEmployee.message) return null;
        const dataForDate = scheduleEmployee?.message
            ?.filter((schedule) => {
                const scheduleDate = new Date(schedule.date);
                return scheduleDate.toDateString() === date.toDateString();
            })
            .map((schedule) => ({
                departmentName: schedule.department_name,
                shiftCode: schedule.shift_code,
                position: schedule.position,
                start_time: schedule.time_slot.start_time,
                end_time: schedule.time_slot.end_time,
            }));

            return (
                <div className={`font-Changa calendar-tile ${dataForDate?.length > 0 ? "scheduled" : ""}`}>
                    {/* You can customize the content of the tile here */}
                    {dataForDate?.length > 0 ? (
                        dataForDate.map(({ status, departmentName, shiftCode, start_time, end_time, check_out_status, check_in_status, results }, index) => (
                            <div key={index} className="d-flex flex-column gap-2 border-secondary py-2 mt-2 bg-light align-items-center justify-content-center fw-bold">
                                {status === "missing" ? (<div className='text-danger'>missing</div>) :(<div>
                                    <div className='d-flex flex-column gap-1'>
                                        <div className="text-dark">{departmentName}</div>
                                        <div className="text-dark">{shiftCode}</div>
                                    </div>
                                    <div className="text-dark">{start_time} ~ {end_time}</div>
                                </div>)}
                            </div>
                        ))
                    ) : (
                        <div></div>
                    )}
                </div>
            );
    };

    const handleMonthChange = (date) => {
        setSelectedMonth(date);
    };

    const handleClickDay = (value, event) => {

        setFormState(true);

        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const localDate = format(value, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", { timeZone });
        const inputDate = new Date(localDate);
        const outputDateFormDb = inputDate.toISOString();
        setSelectedDate(localDate);
        setDateFormDb(outputDateFormDb);

        setSelectedShift(null)
    };

    return (
        <>
            <Navigation />
            <div className="flex flex-col justify-center items-center w-full gap-4 font-Changa text-textColor mt-3">
                <h2 className="text-2xl font-bold">Zeitplan Kalender</h2>
                {selectedYear && (
                    <Calendar
                        onChange={handleMonthChange}
                        onClickDay={handleClickDay}
                        value={selectedMonth}
                        view="month"
                        showNeighboringMonth={false}
                        tileContent={renderTileContent}
                    />
                )}

                {FormState && (
                    <div className="font-Changa mt-4">
                        <div
                            onClick={() => setFormState(false)}
                            className="bg-overlay cursor-pointer"></div>
                        <div className="w-100 bg-white">
                            <div className="card border-dark mb-3 px-3 py-1">
                                <div className="d-flex flex-column mt-8">
                                    <div className="d-flex justify-content-between px-8 align-items-center">
                                        <div></div>
                                        <div
                                            onClick={() => setFormState(false)}
                                            className="fs-5 py-1 px-3 cursor-pointe right-0">x</div>
                                    </div>
                                    {inforShiftFormState && (
                                        <div className="d-flex flex-column px-8 w-100 mt-7 gap-2 font-Changa text-textColor">
                                            <div className="font-weight-bold fs-3">Shift Information</div>
                                            <div className="d-flex flex-column gap-3">
                                                {scheduleDataByDate?.length === 0 ? (
                                                    <div className="font-weight-bold text-danger fs-5">No shift for this day</div>
                                                ) : (
                                                    scheduleDataByDate?.map((item) => (
                                                        <div key={item._id} className="d-flex flex-column gap-2">
                                                            <span className={`cursor-pointer ${selectedShift === item.shift_code ? 'text-primary text-decoration-underline' : ''}`}>
                                                                {item?.shift_code}
                                                            </span>


                                                            <div className="w-100 d-flex flex-column justify-content-center align-items-center gap-3 mt-2 fs-base">
                                                                <div className="d-flex flex-wrap w-100 align-items-center">
                                                                    <span className="text-secondary w-1/3 text-end pe-3">Department</span>
                                                                    <span className="w-2/3">{item?.department_name}</span>
                                                                </div>
                                                                <div className="d-flex flex-wrap w-100 align-items-center">
                                                                    <span className="text-secondary w-1/3 text-end pe-3">Position</span>
                                                                    <span className="w-2/3">{item?.position}</span>
                                                                </div>
                                                                <div className="d-flex flex-wrap w-100 align-items-center">
                                                                    <span className="text-secondary w-1/3 text-end pe-3">Date</span>
                                                                    <span className="w-2/3">{selectedDate.substring(0, 10)}</span>
                                                                </div>
                                                                <div className="d-flex flex-wrap w-100 align-items-center">
                                                                    <span className="text-secondary w-1/3 text-end pe-3">Shift's Code</span>
                                                                    <span className="w-2/3">{selectedShift}</span>
                                                                </div>
                                                                <div className="d-flex flex-wrap w-100 align-items-center">
                                                                    <span className="text-secondary w-1/3 text-end pe-3">Time</span>
                                                                    <span className="w-2/3">{item?.time_slot?.start_time} ~ {item?.time_slot?.end_time}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default ScheduleTable;