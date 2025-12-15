import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    address: '',
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  } 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.message) {
        alert(data.message);
        navigate('/login');
      } else {
        alert("Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
    setFormData({
      name: '',
      age: '',
      address: '',
      email: '',
      password: '',
    });
};

  return (
    <>
    <h1 className='login-heading'>Welcome to DGroove Music</h1>
    <div className="form-container">
      <h2>Sign-Up</h2>
      <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" required onChange={handleChange} />
          <input type="number" name="age" placeholder="Age" required onChange={handleChange} />
          <input type="text" name="address" placeholder="Address" required onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
          <button type="submit">Submit</button>
        </form>
      <p>Already have an account? <a href="/login">Login</a></p>
      <p>Forgot your password? <a href="/reset-password">Reset Password</a></p>
    </div>
    </>
  );
};

export default Signup;