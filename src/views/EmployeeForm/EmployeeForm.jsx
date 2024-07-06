import CarForm from "../../components/CarForm/CarForm";
import LitoForm from "../../components/LitoForm/LitoForm";
import ServiceForm from "../../components/ServiceForm/ServiceForm";

const EmployeeForm = () => {
    return (
        <>
        <div className="container">
            <CarForm />
            <LitoForm />
            <ServiceForm />
        </div>
        </>
    );
}

export default EmployeeForm;