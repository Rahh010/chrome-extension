import React from 'react'
import axios from 'axios';
import NavStyle from './Navbar.module.css'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
            navigate('/');
        } catch (error) {
            console.log('Error during logout:', error);
        }
    };

    return (
        <nav className={NavStyle.nav}>
            <h2>Collectify</h2>
            <button onClick={ handleLogout }>Logout</button> 
        </nav>
    )
}

export default Navbar