import React, { useState } from 'react';
import axios from 'axios';
import ul from './UploadLinks.module.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../../../Utilities/back.css'
import RegisterStyle from '../../../../Auth/Register.module.css'

const UploadLinks = () => {
  const { folderId } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ tag: '', link: '' });
  const [message, setMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  console.log(folderId)

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/folder/upload/link/${folderId}`,
        formData
      );
      setMessage('Link added successfully!');
      setFormData({ tag: '', link: '' }); // Reset the form
      toast.success('Link added successfully!');
    } catch (error) {
      console.error('Error adding link:', error);
      setMessage('Failed to add link. Please try again.');
    }
  };

  return (
    <div>
      <button className='back' onClick={() => navigate(`/folder/${folderId}`)}>Back to Home</button>
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Upload Link</h2>
      <form className={RegisterStyle.form} onSubmit={handleSubmit}>
          <input
            placeholder='Enter a Tag for Link'
            type="text"
            name="tag"
            value={formData.tag}
            onChange={handleChange}
            required
            />
          <input
            placeholder='Enter Link'
            type="url"
            name="link"
            value={formData.link}
            onChange={handleChange}
            required
          />
        <button type="submit" >
          Add Link
        </button>
      </form>
      {message && (
        <p
          style={{
            marginTop: '15px',
            textAlign: 'center',
            color: message.includes('successfully') ? 'green' : 'red',
          }}
        >
          {message}
        </p>
      )}
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

export default UploadLinks;
