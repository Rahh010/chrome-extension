import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 

const useAuth = () => {
  const navigate = useNavigate();
  const [cookieValue, setCookieValue] = useState(null);
  const [decodedToken, setDecodedToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to get the cookie initially
  const fetchCookie = () => {
    chrome.runtime.sendMessage(
      { type: "GET_COOKIE" },
      (response) => {
        if (response && response.value) {
          setCookieValue(response.value);
        } else {
          setCookieValue(null);
        }
        setLoading(false); // Ensure loading state is updated
      }
    );
  };

  // Listen for changes to the cookie
  useEffect(() => {
    const handleCookieChange = ({ removed, cookie }) => {
      if (cookie.name === "authToken") {
        if (removed) {
          setCookieValue(null); // Clear cookie if it is removed
        } else {
          setCookieValue(cookie.value); // Update cookie if changed
        }
      }
    };

    // Attach the listener
    chrome.cookies.onChanged.addListener(handleCookieChange);

    // Fetch the cookie initially
    fetchCookie();

    // Cleanup the listener on unmount
    return () => {
      chrome.cookies.onChanged.removeListener(handleCookieChange);
    };
  }, []);

  // Decode JWT whenever the cookie value changes
  useEffect(() => {
    if (cookieValue) {
      try {
        const decoded = jwtDecode(cookieValue);
        setDecodedToken(decoded);
      } catch (err) {
        console.log("Invalid or expired token:", err);
        setDecodedToken(null);
      }
    } else {
      setDecodedToken(null);
    }
  }, [cookieValue]);

  // Redirect based on authentication status
  useEffect(() => {
    if (!loading) {
      if (decodedToken && decodedToken.loggedIn) {
        // Prevent redirect if already logged in and already at /home
        if (window.location.pathname !== "/home") {
          navigate("/home"); // Navigate to /home if logged in
        }
      } else {
        // Prevent redirect to login page if already on login
        if (window.location.pathname !== "/login") {
          navigate("/login"); // Navigate to login if not logged in
        }
      }
    }
  }, [decodedToken, loading]);

  return { loading, decodedToken }; // Return loading state and decoded token
};

export default useAuth;
