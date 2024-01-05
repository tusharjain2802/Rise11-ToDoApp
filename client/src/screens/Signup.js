import React, {useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Footer from '../components/Footer'
export default function Signup() {    
    const [signupData, setSignupData] = useState({ username: '', email: '', password: '' });
    let navigate = useNavigate()
    const handleSignupChange = (e) => {
      const { name, value } = e.target;
      setSignupData({ ...signupData, [name]: value });
    };
  
    const handleSignupSubmit = async(e) => {
      e.preventDefault();
      const response = await fetch("http://localhost:5000/signup", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name:signupData.username , email: signupData.email, password: signupData.password })
  
      });
      const json = await response.json()
      console.log(json);
      if (json.success) {
        navigate("/login")
      }
      else {
        alert("User Already Exists! Please Login.")
      }
      console.log('Signing up with:', signupData);
    };
  
    return (
      <div>
      <header className="header">
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/login" className="nav-link">Login</Link>
          </li>
        </ul>
      </nav>
    </header>
      <div className="container">
        <form id="signup-form" className="form" onSubmit={handleSignupSubmit}>
          <h2>Sign Up</h2>
          <input
            type="text"
            name="username"
            placeholder="Name"
            value={signupData.username}
            onChange={handleSignupChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={signupData.email}
            onChange={handleSignupChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={signupData.password}
            onChange={handleSignupChange}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        <Footer />
      </div>
      </div>
    );
}
