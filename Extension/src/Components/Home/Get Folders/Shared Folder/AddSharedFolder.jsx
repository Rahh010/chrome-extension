import React, { useState } from 'react';
import add from './AddSharedFolder.module.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import RegisterStyle from '../../../Auth/Register.module.css'
import '../../../../Utilities/back.css'

const AddSharedFolder = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userMail: '',
        folderName: '',
        passCode: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/sharedUsers`, formData);

            if (response.status === 200) {
                toast.success("We found your friend's folder!", {
                    onClose: () => navigate('/home')
                });
            } else {
                toast.error(response.data.message || 'Something went wrong!');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred. Please try again later.');
        }
    };

    return (
        <div>
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
                theme="dark" 
                closeButton={false} 
            />
            <button className='back' onClick={() => navigate('/home')}>Back to Home</button>
            <div>
                <h2>Add Your Friend's Folder</h2>
                <form className={RegisterStyle.form} onSubmit={handleSubmit}>
                    <input
                        placeholder="Enter your friend's email"
                        type="email"
                        name="userMail"
                        value={formData.userMail}
                        onChange={handleChange}
                        required
                        />
                    <input
                        placeholder="Folder Name"
                        type="text"
                        name="folderName"
                        value={formData.folderName}
                        onChange={handleChange}
                        required
                        />
                    <input
                        placeholder="Pass Code"
                        type="password"
                        name="passCode"
                        value={formData.passCode}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default AddSharedFolder;
