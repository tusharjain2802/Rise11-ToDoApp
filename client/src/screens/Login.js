import React, {useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Footer from '../components/Footer'
import toast, { Toaster } from "react-hot-toast";

export default function Login() {

    const [loginData, setLoginData] = useState({ email: '', password: '' });

    let navigate = useNavigate();

    const handleLoginChange = (e) => {
      const { name, value } = e.target;
      setLoginData({ ...loginData, [name]: value });
    };

    function encryptData(data) {
      const encryptedData = btoa(data);
      return encryptedData;
    }
    

    const handleLoginSubmit = async(e) => {
      e.preventDefault();
      const response = await fetch("http://localhost:5000/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: loginData.email, password: loginData.password })
  
      });
      const json = await response.json()
      console.log(json);
      if (json.success) {
        localStorage.setItem('userEmail', encryptData(loginData.email));
        toast.success("Login Successful");
        navigate("/");
      }
      else {
        toast.error(json.error);
      }
    };
  
    return (
      <div>
      <header className="header">
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/signup" className="nav-link">Register</Link>
          </li>
        </ul>
      </nav>
    </header>
      <div className="container">
      
        <form id="login-form" className="form" onSubmit={handleLoginSubmit}>
          <h2>Login</h2>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={loginData.email}
            onChange={handleLoginChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleLoginChange}
            required
          />
          <button type="submit">Login</button>
          <p>Don't have an account? <Link to="/signup">SignUp here</Link> </p>
        </form>
        <Footer />
      </div>
      <Toaster />
      </div>
    );
}
