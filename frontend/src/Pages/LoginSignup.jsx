import React, { useState } from 'react'
import './CSS/LoginSignup.css'
import { loginUser, signupUser } from '../services/userService'

const LoginSignup = () => {

  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  })
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError(""); // Clear error when user types
  }

  const login = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log("Login Function Executed", formData);
      
      const responseData = await loginUser({
        email: formData.email,
        password: formData.password
      });

      if (responseData.token) {
        window.location.replace("/");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  }

  const signup = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log("Signup Function Executed", formData);
      
      const responseData = await signupUser({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (responseData.token) {
        window.location.replace("/");
      }
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
        <div className="loginsignup-fields">
          {state === "Sign Up" ? <input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Your Name' /> : <></>}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address' />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password' />
        </div>
        <button 
          className='loginsignup-btn' 
          onClick={() => { state === "Login" ? login() : signup() }}
          disabled={loading}
        >
          {loading ? "Please wait..." : "Continue"}
        </button>
        {state === "Sign Up"
          ? <p className="loginsignup-login">Already have an account? <span onClick={() => { setState("Login") }}>Login here</span></p>
          : <p className="loginsignup-login">Create an account? <span onClick={() => { setState("Sign Up") }}>Click here</span></p>}
        <div className="loginsignup-agree">
          <input type="checkbox" name='' id='' />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup