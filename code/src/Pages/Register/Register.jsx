import { useState } from "react";
import "./Register.scss"
import {Link} from "react-router-dom"
import axios from "axios"

let Register = () =>
{
  const [input, setInputs] = useState({
    username:"",
    email:"",
    password:"",
    name:""
  });
  
  const [err, setErr] = useState(null);
  
  const handleChange = (e) =>
  {
    setInputs(prev=>({...prev, [e.target.name]:e.target.value}));
  }
  
  const handleClick = async (e) =>
  {
    e.preventDefault();

    try{
      await axios.post("http://localhost:8800/api/auth/register", input);
      window.alert("Registration Successfull! Navigate To Login Page!");
    }catch(error){
      setErr(error.response.data);
    }
  }
    return (
        <div className="register">
      <div className="card">
        <div className="left">
          <h1>DAYTA</h1>
          <p>
            Everything FAST related!  
          </p>
          <span>Do you have an account?</span>
          <Link to="/Login">
          <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input type="text" placeholder="Username" name = "username" onChange={handleChange}/>
            <input type="email" placeholder="Email" name = "email" onChange={handleChange}/>
            <input type="password" placeholder="Password" name = "password" onChange={handleChange}/>
            <input type="text" placeholder="Name" name = "name" onChange={handleChange}/>
            {err && err}
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
    );
}

export default Register;