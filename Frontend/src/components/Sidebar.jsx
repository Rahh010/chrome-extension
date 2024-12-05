import React, { useState, useEffect } from 'react';

const Sidebar = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/api/auth/test') // Test API endpoint
            .then((res) => res.json())
            .then((data) => setMessage(data.message))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div style={{ width: '300px', padding: '10px', background: '#f1f1f1' }}>
            <h1>Chrome Sidebar</h1>
            <p>{message || 'Loading...'}</p>
        </div>
    );
};

export default Sidebar;
