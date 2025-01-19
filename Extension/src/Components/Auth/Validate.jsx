import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RegisterStyle from "./Register.module.css"

const About = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');  // State to store OTP
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to handle OTP validation
  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      // Make the POST request to the validate API
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/validate`,
        { otp },  // Send OTP as part of the request body
        { withCredentials: true }  // Ensure cookies are sent with the request
      );

      if(response.data.success) {
        navigate('/home')
        return
      }

      setErrorMessage(error.response?.data?.message || "Error validating OTP");
      
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || "Error validating OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className={RegisterStyle.header}>Collectify</h2>
      {loading ? (
        <div className={RegisterStyle.parentLoader}>
          <div className={RegisterStyle.loader}></div>
        </div>
      ) : (
        <div className={RegisterStyle.form}>
          <p>Enter the OTP send to your Email</p>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            maxLength={6}
            required
          />
          <button onClick={handleSubmit} disabled={loading}>Validate OTP</button>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
      ) }
    </div>
  );
};

export default About;
