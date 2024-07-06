import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Login.css';
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    
    const [credentials, setCredentials] = useState({
        name: undefined,
        password: undefined,
    });
    
    const { loading, error, dispatch } = useContext(AuthContext);
    
    const navigate = useNavigate();
    
    const handleChange = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };
    
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        dispatch({ type: "LOGIN_START" });
        try {
            const res = await axios.post(
                "https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/auth/manage-employee/login-employee",
                credentials,
                { withCredentials: true }
            );
            setIsLoading(false);
            if (res?.data?.details?.name) {
                dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
                navigate("/schedule");
            }
        } catch (err) {
            const errMsg = err.response?.data?.message + ' Invalid Username or Password!';
            alert(errMsg);
            setIsLoading(false);
            dispatch({ type: "LOGIN_FAILURE", payload: "errr" });
        }
    };

    return (
        <>
        <div className="Auth-form-container">
            <form className="Auth-form">
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Sign In</h3>
                    <div className="form-group mt-3">
                        <label>Username</label>
                        <input
                            onChange={handleChange}
                            type="text"
                            className="form-control mt-1"
                            placeholder="Enter username"
                            id="name"
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Password</label>
                        <input
                            onChange={handleChange}
                            type="password"
                            className="form-control mt-1"
                            placeholder="Enter password"
                            id="password"
                        />
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button 
                            disabled={isLoading}
                            onClick={ handleLogin } 
                            type="submit" className="btn btn-primary"
                        >
                            <span name="loading" aria-hidden="true" 
                                className={
                                    `spinner-border spinner-border-sm me-2
                                    ${isLoading ? '' : 'd-none'}`
                                }
                            ></span>
                            <span name="loading" className={`${isLoading ? '' : 'd-none'}`} role="status">Loggin in...</span>
                            <span name="submitBtn" className={`${isLoading ? 'd-none' : ''}`}>Login</span>
                        </button>
                    </div>
                    {error && <span>{error.message}</span>}
                    {/* <p className="forgot-password text-right mt-2">
                        Forgot <a href="#">password?</a>
                    </p> */}
                </div>
            </form>
        </div>
        </>
    );
}

export default Login;
