import { useState, useEffect, useContext } from 'react';

import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import "../Calendar/calendar.css";
import axios from 'axios';
// import { format } from "date-fns-tz";
import { format, toDate, formatISO } from 'date-fns';
import { shiftType } from '../../assets/data/data';
import "./Attendance.css";
import Navigation from '../../components/Navigation/Navigation';
import { AuthContext } from '../../context/AuthContext';

const Attendance = (props) => {
    const { id, name, departmentDefined, role } = props
    const [selectedYear, setSelectedYear] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [employeeData, setEmployeeData] = useState(null);
    const [FormState, setFormState] = useState(false);
    const [addShiftFormState, setAddShiftFormState] = useState(true);
    const [inforShiftFormState, setInforShiftFormState] = useState(true);
    const [selectedDate, setSelectedDate] = useState("");
    const [dateFormDb, setDateFormDb] = useState("")
    const [loading, setLoading] = useState(false);
    const [selectedShift, setSelectedShift] = useState(null);
    const [attendanceDataByDate, setAttendanceDataByDate] = useState()
    const [scheduleEmployee, setScheduleEmployee] = useState()
    const [shiftDataByDate, setShiftDataByDate] = useState()
    const [attendInformation, setAttendInformation] = useState(false)
    const {
        user: { id: userID }
    } = useContext(AuthContext)


    const baseUrl = process.env.REACT_APP_BASE_API_URL;

    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;

    const fetchScheduleEmployyee = async () => {

        try {
            const response = await axios.get(
                baseUrl + `/api/employee/get-attendance/current-week?employeeID=${userObject?.id}&employeeName=${userObject?.name}`,
                { withCredentials: true }
            );
            setScheduleEmployee(response.data);
        } catch (error) {
            console.error("Error fetching employee data:", error);
        }
    };

    useEffect(() => {
        fetchScheduleEmployyee();

        const fetchAttendanceDataByDate = async () => {
            try {
                const year = selectedDate.substring(0, 4);
                const month = selectedDate.substring(5, 7);
                const day = selectedDate.substring(8, 10)
                const date = `${month}/${day}/${year}`
                const response = await axios.get(
                    baseUrl + `/api/employee/get-attendance/current-week?employeeID=${userObject?.id}&employeeName=${userObject?.name}&date=${date}`,
                    { withCredentials: true }
                );

                setAttendanceDataByDate(response.data.message);
            } catch (error) {
                if (error.response && error.response.status) {
                    if (error.response.status === 404) {
                        setAttendanceDataByDate([])
                    }
                } else {
                    console.error("Error fetching schedule data:", error.message);
                }
            }
        };

        if (selectedDate !== "") {
            fetchAttendanceDataByDate();
        }

    }, [id, selectedDate, dateFormDb, role, userObject?.role]);

    const renderTileContent = ({ date }) => {
        if (!scheduleEmployee || !scheduleEmployee.message) return null;
        const dataForDate = scheduleEmployee?.message
            ?.filter((schedule) => {
                const scheduleDate = new Date(schedule.date);
                return scheduleDate.toDateString() === date.toDateString();
            })
            .map((schedule) => ({
                departmentName: schedule.department_name,
                shiftCode: schedule.shift_info.shift_code,
                check_in_time: schedule.shift_info.time_slot?.check_in_time,
                check_out_time: schedule.shift_info.time_slot?.check_out_time,
                check_in_status: schedule.shift_info.time_slot?.check_in_status,
                check_out_status: schedule.shift_info.time_slot?.check_out_status,
                status: schedule.status,
                results: schedule.results,
                check_in_km: schedule.check_in_km,
                check_out_km: schedule.check_out_km,
            }));

        return (
            <div className={`font-Changa calendar-tile ${dataForDate?.length > 0 ? "scheduled" : ""}`}>
                {/* You can customize the content of the tile here */}
                {dataForDate?.length > 0 ? (
                    dataForDate.map(({ status, departmentName, shiftCode, check_in_time, check_out_time, check_out_status, check_in_status, results }, index) => (
                        <div key={index} className="d-flex flex-column gap-2 py-2 rounded-3 mt-2  align-items-center justify-content-center fw-bold">
                            {/* <div className='d-flex flex-row gap-2'>
                                <div className="border border-danger bg-danger ms-2 rounded-circle" style={{ width: "0.6rem", height: "0.6rem" }}></div>
                                <div className="text-dark">{departmentName}: {shiftCode}</div>
                            </div> */}
                            {status === "missing" ? (<div className='text-danger'>{status}</div>) : (<div className='flex flex-col'>
                                <div className='text-black'>Done</div>
                            </div>)}
                        </div>
                    ))
                ) : (
                    <div className='text-black'>x</div>
                )}
            </div>
        );
    };

    const handleMonthChange = (date) => {
        setSelectedMonth(date);
    };

    const handleClickDay = (value, event) => {

        setAttendInformation(true);

        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const localDate = format(value, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", { timeZone });
        const inputDate = new Date(localDate);
        const outputDateFormDb = inputDate.toISOString();
        setSelectedDate(localDate);
        setDateFormDb(outputDateFormDb);

        setSelectedShift(null)
    };

    const handleShiftClick = (shift) => {
        setSelectedShift(shift);
    };

    return (
        <>
            <Navigation />
            <div className="flex flex-col justify-center items-center w-full gap-4 font-Changa text-textColor mt-3">
                <h2 className="text-2xl font-bold">Attendance History</h2>
                {selectedYear && (
                    <Calendar
                        onChange={handleMonthChange}
                        value={selectedMonth}
                        onClickDay={handleClickDay}
                        view="month"
                        showNeighboringMonth={false}
                        tileContent={renderTileContent}
                    />
                )}
                {attendInformation && (
                    <div className="font-Changa mt-4">
                        <div
                            onClick={() => setAttendInformation(false)}
                            className="bg-overlay cursor-pointer"></div>
                        <div className="w-100 bg-white">
                            <div className="card border-dark mb-3 px-3 py-1">
                                <div className="d-flex flex-column mt-8">
                                    <div className="d-flex justify-content-between px-8 align-items-center">
                                        <div></div>
                                        <div
                                            onClick={() => setAttendInformation(false)}
                                            className="fs-5 py-1 px-3 cursor-pointe right-0">x</div>
                                    </div>
                                    {inforShiftFormState && (
                                        <div className="d-flex flex-column px-8 w-100 mt-7 gap-2 font-Changa text-textColor">
                                            <div className="font-weight-bold fs-3">Attendance Information</div>
                                            <div className="d-flex flex-row gap-3">
                                                {attendanceDataByDate?.length === 0 ? (
                                                    <div className="font-weight-bold text-danger fs-5">No shift for this day</div>
                                                ) : (
                                                    attendanceDataByDate?.map((item) => (
                                                        <div key={item._id} className="d-flex flex-row gap-4">
                                                            <span className={`cursor-pointer ${selectedShift === item?.shift_info?.shift_code ? 'text-primary text-decoration-underline' : ''}`} onClick={() => handleShiftClick(item?.shift_info?.shift_code)}>
                                                                {item?.shift_info?.shift_code}
                                                            </span>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                            {selectedShift && (
                                                <div>
                                                    {attendanceDataByDate
                                                        ?.filter((item) => item?.shift_info?.shift_code === selectedShift)
                                                        .map((filteredItem) => (
                                                            filteredItem?.status === "missing" ? (
                                                                <div className='text-danger'>{filteredItem?.status}</div>
                                                            ) : (
                                                                <div className="w-100 d-flex flex-column justify-content-center align-items-center gap-3 mt-3 fs-base" key={filteredItem._id}>
                                                                    <div className="d-flex flex-wrap w-100 align-items-center">
                                                                        <span className="text-secondary w-1/3 text-end pe-3">Filiale</span>
                                                                        <span className="w-2/3">{filteredItem?.department_name}</span>
                                                                    </div>
                                                                    <div className="d-flex flex-wrap w-100 align-items-center">
                                                                        <span className="text-secondary w-1/3 text-end pe-3">Position</span>
                                                                        <span className="w-2/3">{filteredItem?.position}</span>
                                                                    </div>
                                                                    <div className="d-flex flex-wrap w-100 align-items-center">
                                                                        <span className="text-secondary w-1/3 text-end pe-3">Date</span>
                                                                        <span className="w-2/3">{selectedDate.substring(0, 10)}</span>
                                                                    </div>
                                                                    <div className="d-flex flex-wrap w-100 align-items-center">
                                                                        <span className="text-secondary w-1/3 text-end pe-3">Schicht's Code</span>
                                                                        <span className="w-2/3">{selectedShift}</span>
                                                                    </div>
                                                                    <div className="d-flex flex-wrap w-100 align-items-center">
                                                                        <span className="text-secondary w-1/3 text-end pe-3">Check in Time</span>
                                                                        <span className="w-2/3">{filteredItem?.shift_info?.time_slot?.check_in_time} ~ {filteredItem?.shift_info?.time_slot?.check_in_status}</span>
                                                                    </div>
                                                                    <div className="d-flex flex-wrap w-100 align-items-center">
                                                                        <span className="text-secondary w-1/3 text-end pe-3">Check out Time</span>
                                                                        <span className="w-2/3">{filteredItem?.shift_info?.time_slot?.check_out_time} ~ {filteredItem?.shift_info?.time_slot?.check_out_status}</span>
                                                                    </div>
                                                                    {filteredItem?.position === "Autofahrer" ?
                                                                        (
                                                                            <div className="d-flex flex-wrap w-100 align-items-center">
                                                                                <span className="text-secondary w-1/3 text-end pe-3">Check in km: </span>
                                                                                <span className="w-2/3">{filteredItem?.check_in_km} km</span>
                                                                            </div>
                                                                        )
                                                                        :
                                                                        (<div></div>)
                                                                    }

                                                                    {filteredItem?.position === "Autofahrer" ?
                                                                        (
                                                                            <div className="d-flex flex-wrap w-100 align-items-center">
                                                                                <span className="text-secondary w-1/3 text-end pe-3">Check out km: </span>
                                                                                <span className="w-2/3">{filteredItem?.check_out_km} km</span>
                                                                            </div>
                                                                        )
                                                                        :
                                                                        (<div></div>)
                                                                    }
                                                                    {filteredItem?.position === "Service" || filteredItem?.position === "Lito" ?
                                                                        (<div className="d-flex flex-wrap w-100 align-items-center">
                                                                            <span className="text-secondary w-1/3 text-end pe-3">Result</span>
                                                                            <span className="w-2/3">{filteredItem?.results} €</span>
                                                                        </div>)
                                                                        :
                                                                        (<div></div>)
                                                                    }
                                                                </div>
                                                            )
                                                        ))}
                                                </div>
                                            )}

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

export default Attendance;
