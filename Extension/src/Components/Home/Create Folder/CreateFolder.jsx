import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import '../../../Utilities/back.css'
import RegisterStyle from '../../Auth/Register.module.css'

const CreateFolder = () => {
    const navigate = useNavigate();
    const [folderName, setFolderName] = useState('');
    const [passCode, setPasscode] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Function to generate a 6-digit passcode
    const handleGeneratePasscode = () => {
        const randomPasscode = Math.floor(100000 + Math.random() * 900000).toString();
        setPasscode(randomPasscode);
    };

    const handleBacktoHome = () => {
        navigate('/home');
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!folderName.trim() || !passCode.trim()) {
            setError('Folder name and passcode are required.');
            setSuccess(null);
            return;
        }

        const folderData = {
            folderName,
            passCode,
        };

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/folder/create`,
                folderData
            );

            if (response.status === 200) {
                setSuccess('Folder created successfully!');
                setError(null);
                toast.success('Folder created successfully!', {
                  onClose: () => navigate('/home'), // Redirect after toast completion
                });
            } else {
                setError('Failed to create folder.');
                setSuccess(null);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.message || 'Failed to create folder.');
            } else {
                setError('Error: Unable to connect to the server.');
            }
            setSuccess(null);
            // console.error('Error:', error);
        }
    };

    return (
        <div>
            <button className='back' onClick={handleBacktoHome}>Back to Home</button>
            <p>Create a Folder, with passcode not more than 6 characters</p>
            <form className={ RegisterStyle.form } onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={folderName}
                        placeholder='Folder Name'
                        onChange={(e) => setFolderName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder='Enter a Passcode or Generate it'
                        value={passCode}
                        onChange={(e) => setPasscode(e.target.value)}
                        maxLength={6}
                        minLength={6}
                        required
                    />
                <button type="button" onClick={handleGeneratePasscode}>
                    Generate Passcode
                </button>
                <button type="submit">
                    Create Folder
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            {/* Add ToastContainer here */}
            <ToastContainer
                position='top-center'
                autoClose={2500} 
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark" // Choose between "light", "dark", or "colored"
                closeButton={false} // Removes the close button globally
            />
        </div>
    );
};

export default CreateFolder;
