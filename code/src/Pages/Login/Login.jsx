import { useContext, useState } from "react";
import "./Login.scss"
import {Link, useNavigate} from "react-router-dom"
import { AuthContext } from "../../Context/authContext";

let Login = () =>
{
    const [input, setInputs] = useState({
        username:"",
        password:"",
      });
      
    const [err, setErr] = useState(null);

    const navigate = useNavigate();
    
    const handleChange = (e) =>
    {
    setInputs(prev=>({...prev, [e.target.name]:e.target.value}));
    }
    
    const {login} = useContext(AuthContext);
    const handleLogin = async (e) =>
    {
        e.preventDefault(); 
        try{
            await login(input);
            
            navigate("/");
        }
        catch(err)
        {
            setErr(err.response.data);
        }
    }
    return (
        <div className="login">
            <div className="card">
                <div className="left">
                    <h1>Login</h1>
                    <form>
                        <input type="text" placeholder="Username" name="username" onChange={handleChange}/>
                        <input type="password" placeholder="Password" name="password" onChange={handleChange}/>
                        {err && err}
                        <button onClick={handleLogin}>Login</button>
                    </form>
                </div>
                <div className="right">
                    <h1>DAYTA</h1>
                    <p>Everything FAST related!</p>
                    <span>Don't have an acoount?</span>
                    <Link to="/Register">
                        <button>Register</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;