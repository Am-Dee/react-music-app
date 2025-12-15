import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Reset background on login page load
  useEffect(() => {
    document.body.className = '';
    document.body.style.transition = 'all 0.4s ease-in-out';
    document.body.style.background = 'linear-gradient(to right, #282c34, #61dafb)';
    document.body.style.minHeight = '100vh';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.fontFamily = 'Arial, sans-serif';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.name);
        alert("Login successful");
        navigate("/");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
    }

    setEmail('');
    setPassword('');
  };

  return (
    <>
      <h1 className='login-heading'>Welcome to DGroove Music</h1>
      <div className="form-container">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input name='email' type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <input name='password' type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <a href="/signup">Sign Up</a></p>
        <p>Forgot your password? <a href="/reset-password">Reset Password</a></p>
      </div>
    </>
  );
};

export default Login;
