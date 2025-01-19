import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SharedFolderStyle from './SharedFolders.module.css'
import axios from 'axios';

const SharedFolders = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Replace with your backend URL environment variable

  // Fetch shared folders
  useEffect(() => {
    const fetchSharedFolders = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/sharedUsers`);
        console.log(response.data)
        setFolders(response.data.folders); // Assuming the API returns an array of folders
      } catch (error) {
        console.error('Error fetching shared folders:', error);
      }
    };

    fetchSharedFolders();
  }, [backendUrl]);

  return (
    <div>
      <div className={ SharedFolderStyle.add } onClick={() => navigate('/sharedFolder')}>
        Add Your Friend's Folder +
      </div>
      <div className={SharedFolderStyle.cardContainer}>
        {folders.length > 0 ? (
          folders.map((folder) => (
            <div
                className={SharedFolderStyle.card}
                onClick={ () => navigate(`/folder/${folder._id}`) }
                key={folder._id}
            >
              <h3>{folder.folderName}</h3>
              <p><strong>Created by:</strong> {folder.userMail}</p>
              <p><strong>PassCode:</strong> {folder.passCode}</p>
            </div>
          ))
        ) : (
          <p className={SharedFolderStyle.notAvail}>No shared folders available.</p>
        )}
      </div>
    </div>
  );
};

export default SharedFolders;
