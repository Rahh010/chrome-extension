import React, { useEffect, useState } from 'react';
import GetImages from './GetUserImages.module.css';
import GetLinks from './GetUserLinks.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import '../../../../Utilities/loading.css';

const GetUserImages = () => {
  const navigate = useNavigate();
  const { folderId } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/folder/${folderId}`
      );
      console.log(response.data.findedFolder);
      setImages(response.data.findedFolder?.categories?.images || []); // Handle undefined gracefully
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to fetch images.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (folderId, imageId) => {
    try {
      setLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/folder/delete/image/${folderId}/`,
        {
          params: {imageId}, // Empty params object as per your requirement
        }
      );
  
      toast.success('Image deleted successfully!');
      await fetchImages(); // Refresh the images after deletion
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchImages();
  }, [folderId]);

  return (
    <div className={GetImages.main}>
      <ToastContainer
        position="top-center"
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

      {/* Add Image Button */}
      <div
        className={GetLinks.addALink}
        onClick={() => navigate(`/upload/image/${folderId}`)}
      >
        Upload Images +
      </div>

      {/* Loading Indicator */}
      {loading ? (
        <div className="loader"></div>
      ) : (
        <div className={GetImages.imageContainer}>
          {/* Image List */}
          {images && images.length > 0 ? (
            images.map((imageURL, index) => (
              <div key={index} className={GetImages.imageCard}>
                <div
                  className={GetImages.image}
                  style={{ backgroundImage: `url(${imageURL})` }}
                ></div>
                <a 
                  href={imageURL.replace('/upload/', '/upload/fl_attachment/')} 
                  download 
                  className={GetImages.download}
                >
                  Download
                </a>
                <button
                  onClick={() => handleDeleteImage(folderId, imageURL)}
                  style={{ backgroundColor: 'red', border: 'none', color: '#E9F8F9' }}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className={GetLinks.notAvail}>No images available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GetUserImages;
