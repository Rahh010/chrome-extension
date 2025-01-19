import React, { useEffect, useState } from 'react';
import GetLinks from './GetUSerLinks.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Assuming toast is used for notifications.
import '../../../../Utilities/loading.css'


const GetUserLinks = () => {
  const navigate = useNavigate();
  const { folderId } = useParams();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFolderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/folder/${folderId}`
      );
      console.log(response.data.findedFolder);
      setLinks(response.data.findedFolder?.categories?.links || []); // Handle undefined gracefully
    } catch (error) {
      console.error('Error fetching folder details:', error);
      toast.error('Failed to fetch folder details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLink = async (folderId, tag, link) => {
    try {
      setLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/folder/delete/link/${folderId}`,
        {
          params: { link, tag },
        }
      );
      
      toast.success('Link deleted successfully!');
      await fetchFolderDetails(); // Refresh the links after deletion
    } catch (error) {
      console.log(error)
      toast.error('Failed to delete link.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolderDetails();
  }, [folderId]);

  return (
    <div className={GetLinks.main}>
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
      {/* Add Link Button */}
      <div 
        className={GetLinks.addALink}
        onClick={() => navigate(`/upload/links/${folderId}`)}
      >
        Upload Links +
      </div>

      {/* Loading Indicator */}
      {loading ? (
          <div className='loader'></div>
      ) : (
        <div className={GetLinks.LinksList}>
          {/* Links List */}
          {links && links.length > 0 ? (
            links.map((linkObj, index) => (
              <div key={index} className={GetLinks.card}>
                <p>
                  <strong>Tag:</strong> {linkObj.tag}
                </p>
                <p>
                  <strong>Link:</strong>{' '}
                  <a
                    href={linkObj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#8135df', textDecoration: 'none' }}
                  >
                    {linkObj.link}
                  </a>
                </p>
                <button
                  onClick={() => handleDeleteLink(folderId, linkObj.tag, linkObj.link)}
                  style={{backgroundColor: 'red', border: 'none', color: '#E9F8F9'}}
                >
                  Delete
                </button>

            </div>
            ))
          ) : (
            <p className={GetUserLinks.notAvail}>No links available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GetUserLinks;
