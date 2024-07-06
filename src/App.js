import { Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import './App.css';
import Login from "./views/Login/Login";
import HomeView from "./views/HomeView/HomeView";
import ScheduleTable from "./views/Calendar/ScheduleTable";
import Attendance from "./views/Attendance/Attendance";
import EmployeeForm from "./views/EmployeeForm/EmployeeForm";
import VacationRequest from "./views/VacationRequest/VacationRequest";
import TodayShifts from "./views/TodayShifts/TodayShift";
import { AuthContextProvider } from "./context/AuthContext";

function App() {

  return (
    <AuthContextProvider>
      <Routes>
        <Route path="/" element={ <Login /> }/>
        <Route path="login" element={ <Login /> }/>
        <Route path="check-in" element={ <HomeView /> }/>
        <Route path="schedule" element={ <ScheduleTable /> }/>
        <Route path="attendance-history" element={ <Attendance /> }/>
        <Route path="employee-form" element={ <EmployeeForm /> }/>
        <Route path="vacation-request" element={ <VacationRequest /> }/>
        <Route path="today-shifts" element={ <TodayShifts /> }/>
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
