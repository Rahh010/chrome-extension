import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MFStyle from './MyFolders.module.css'
import '../../../../Utilities/loading.css'

const MyFolders = () => {
  const navigate = useNavigate()
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDeleteFolder = async (folderId) => {
    try {
      setLoading(true); // Start loading
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/folder/${folderId}`);
      toast.success("Folder deleted successfully!");
      // Fetch the updated list of folders from the database
      await fetchFolders(); 
    } catch (error) {
      toast.error("Error in deleting folder");
    } finally {
      setLoading(false); // Ensure loading is stopped in all cases
    }
  };
  
  const fetchFolders = async () => {
    try {
      setLoading(true); // Start loading before API call
      setFolders([]); // Clear folders before fetching
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/folder`);
      if (response.data.gettedFolders.length === 0) {
        setError("No folder available");
      } else {
        // Extract folder data from the response
        setFolders(response.data.gettedFolders);
      }
    } catch (error) {
      setError("No Folder available"); // Capture error message
    } finally {
      setLoading(false); // Stop loading after API call
    }
  };
  
  useEffect(() => {
    fetchFolders(); // Call fetchFolders on initial render and when `trigger` changes
  }, []);
  

  if (loading) {
    return <div className='loader'></div>;
  }

  return (
    <div>
      <h1 className={ MFStyle.error }>{ error }</h1>
      <div className={ MFStyle.card }>
        {!error && <p>Click any folder to view the details</p>}
        {folders.reverse().map((folder, index) => (
          <div
            key={index}
            // Navigate to the folder route
          >{console.log(folder)}
          <div onClick={() => navigate(`/folder/${folder._id}`)} >
            <p><strong>Folder Name:</strong> {folder.folderName}</p>
            <p><strong>Passcode:</strong> {folder.passCode}</p>            
          </div>
            <button className={ MFStyle.delete } onClick={() => handleDeleteFolder(folder._id)}>Delete</button>
          </div>
        ))}
      </div>
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

export default MyFolders;
