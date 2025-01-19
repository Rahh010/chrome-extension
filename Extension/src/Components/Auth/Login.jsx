import React, { useState } from 'react';
import RegisterStyle from './Register.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';



const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Renamed to setLoading for clarity

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
  
    const formData = {
      email: e.target.email.value,
    };
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, 
        formData,
        { withCredentials: true }
      );
      setErrorMessage('Logged in')
      navigate('/validate');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <h2 className={RegisterStyle.header}>Collectify</h2>
      {loading ? (
        <div className={RegisterStyle.parentLoader}>
          <div className={RegisterStyle.loader}></div>
        </div>
      ) : (
        <form className={RegisterStyle.form} onSubmit={handleSubmit}>
          <h4>Login to Collectify</h4>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            required
          />
          <button type="submit">Submit</button>
          {errorMessage && <p className={RegisterStyle.error}>{errorMessage}</p>}
          <p>
            New user? <Link className={RegisterStyle.link} to="/register">Register</Link>
          </p>
        </form>
      )}
    </>
  );
};

export default Login;
