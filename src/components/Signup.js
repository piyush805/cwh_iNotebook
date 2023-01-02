import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function Signup(props) {

    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" })
    let navigate = useNavigate();
    const host = "http://localhost:5000"

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate("/")
        }
        //eslint-disable-next-line
    }, [])
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (credentials.password !== credentials.cpassword) {
            props.showAlert("Passwords must match!", "danger");
        } else {
            const response = await fetch(`${host}/api/auth/createuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: credentials.name,
                    email: credentials.email,
                    password: credentials.password
                })
            });
            const json = await response.json();
            console.log(json);
            if (json.success) {
                //save the auth token and redirect
                navigate("/login");
                props.showAlert("Account created successfully!", "success");
            } else {
                props.showAlert("Invalid Credentials!", "danger");
            }
        }

    }
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input onChange={onChange} type="name" name="name" className="form-control" id="name" value={credentials.name} />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input onChange={onChange} type="email" className="form-control" id="email" name="email" value={credentials.email} aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input onChange={onChange} type="password" name="password" className="form-control" id="password" value={credentials.password} minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input onChange={onChange} type="password" name="cpassword" className="form-control" id="cpassword" value={credentials.cpassword} minLength={5} required />
                </div>

                <button type="submit" className="btn btn-primary" >Signup</button>
            </form>
        </div>
    )
}

export default Signup
