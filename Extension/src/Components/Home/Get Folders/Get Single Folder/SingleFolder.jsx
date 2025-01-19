import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import SingleFolderStyle from './SingleFolder.module.css'
import GetUserLinks from '../SingleFolderData/GetUserLinks';
import GetUserImages from '../SingleFolderData/GetUserImages';
import '../../../../Utilities/back.css'

const SingleFolder = () => {
  const navigate = useNavigate()
  const { folderId } = useParams(); // Get the folder ID from the route
  const [folderData, setFolderData] = useState(null); // State to store folder details
  const [activeTab, setActiveTab] = useState('links'); // State to manage active tab

  console.log(SingleFolderStyle);


  // Fetch folder details
  useEffect(() => {
    const fetchFolderDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/folder/${folderId}`
        );
        console.log(response.data.findedFolder)
        setFolderData(response.data.findedFolder); // Store fetched folder details
      } catch (error) {
        console.error('Error fetching folder details:', error);
      }
    };

    fetchFolderDetails();
  }, [folderId]);

  // Render loading state if folderData is null
  if (!folderData) {
    return <p>Loading folder details...</p>;
  }

  return (
    <div className={ SingleFolderStyle.main }>
      <button className='back' onClick={() => navigate('/home')}>Back to Home</button>
      <p>
        <strong>Folder Name:</strong> {folderData.folderName}
      </p>
      <p>
        <strong>Folder passcode:</strong> {folderData.passCode}
      </p>
      <p>
        <strong>Created by:</strong> {folderData.userMail}
      </p>

      {/* Tabs for Links and Images */}
      <div className={SingleFolderStyle.tabContainer} >
        <button
          onClick={() => setActiveTab('links')}
          className={activeTab === 'links' ? SingleFolderStyle.active : SingleFolderStyle.nonActive}
          >
          Links
        </button>
        <button
          onClick={() => setActiveTab('images')}
          className={activeTab === 'images' ? SingleFolderStyle.active : SingleFolderStyle.nonActive}
        >
          Images
        </button>
      </div>
      {console.log(folderData)}

      <div>
        { activeTab === 'links' ?
            <GetUserLinks /> : <GetUserImages />}
      </div>
    </div>
  );
};

export default SingleFolder;
