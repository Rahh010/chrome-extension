import React, { useState } from 'react';
import RegisterStyle from './Register.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../Utilities/loading.css'



const Register = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Renamed to setLoading for clarity

  const handleSubmit = async (e) => {
    console.log("helloo")
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
  
    const formData = {
      name: e.target.username.value,
      email: e.target.email.value,
    };
  
    try {
      console.log("Register")
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, 
        formData,
        { withCredentials: true }
      );

      console.log(response.data.success)
      if (response.data.success) {
        navigate('/validate');
      }
  
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
          <div className='loading'></div>
        </div>
      ) : (
        <form className={RegisterStyle.form} onSubmit={handleSubmit}>
          <h4>Register to Collectify</h4>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            required
          />
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
            Existing user? <Link className={RegisterStyle.link} to="/login">Login</Link>
          </p>
        </form>
      )}
    </>
  );
};

export default Register;
