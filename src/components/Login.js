import React, { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
function Login(props) {
    const [credentials, setCredentials] = useState({email:"",password:""})
    let navigate = useNavigate();
    const host = "http://localhost:5000"

    useEffect(() => {
        //if user logged in, redirect to home page
        if(localStorage.getItem('token')){
            navigate("/");
        }  
        //eslint-disable-next-line
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${host}/api/auth/login`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                { 
                    email:credentials.email, 
                    password:credentials.password 
                }
                )
        });
        const json = await response.json();
        if(json.success){
            //save the autToken and redirect to home page
            localStorage.setItem("token",json.authToken);
            props.showAlert("Logged in successfully","success");
            navigate("/")
        }else{
            props.showAlert("Invalid Details","danger");
        }
    }
    const onChange =(e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value})
    }
    
    return (
        
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input onChange={onChange} type="email" className="form-control" id="email" name="email"value={credentials.email} aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input onChange={onChange} type="password" name="password"className="form-control" id="password" value={credentials.password} />
                </div>
                <button type="submit" className="btn btn-primary" >Login</button>
            </form>
        </div>
    )
}

export default Login
