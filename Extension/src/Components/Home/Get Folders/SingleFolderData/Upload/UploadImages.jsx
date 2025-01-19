import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ui from './UploadImages.module.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../../../Utilities/back.css'
import '../../../../../Utilities/loading.css'

const UploadImages = ( ) => {
  const navigate = useNavigate()
  const { folderId } = useParams()
  const [image, setImage] = useState(null); // State for storing selected image
  const [imagePreview, setImagePreview] = useState(null); // State for storing image preview URL
  const [loading, setLoading] = useState(false); 

  // Handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      setImage(file); // Store the selected image
      setImagePreview(URL.createObjectURL(file)); // Create a preview URL for the selected image
    }
  };

  // Handle form submission to upload the image
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true)
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/folder/upload/image/${folderId}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      toast.success('Link added successfully!');
      setImage(null)
      setImagePreview(null)
      setLoading(false)
    } catch (error) {
      return <> {error}</>
    }
  };

  return (
    <div>
      {loading ? (<div className='loader'></div>) :
      (<><button className='back' onClick={() => navigate(`/folder/${folderId}`)}>Back to Home</button>
      <h3>Upload Image</h3>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && (
          <div>
            <img
              src={imagePreview}
              alt="Image Preview"
              style={{ maxWidth: '300px', maxHeight: '300px', objectFit: 'cover' }}
            />
          </div>
        )}
        <button type="submit">Upload Image</button>
      </form>
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
    </>)
    }</div>
  );
};

export default UploadImages;
