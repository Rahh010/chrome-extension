import React, { useState } from 'react'
import GetFolderStyle from './GetFolder.module.css'
import MyFolders from './My folder/MyFolders';
import SharedFolders from './Shared Folder/SharedFolders';

const GetFolder = () => {
    const [activeTab, setActiveTab] = useState('myFolder');
  return (
    <div className={ GetFolderStyle.main }>
        <div className={ GetFolderStyle.tab }>
            <div
                className={`${GetFolderStyle.tabItem} ${
                    activeTab === 'myFolder' ? GetFolderStyle.active : ''
                }`}
                onClick={() => setActiveTab('myFolder')}
            >
                My Folder
            </div>
            <div
                className={`${GetFolderStyle.tabItem} ${
                    activeTab === 'sharedFolders' ? GetFolderStyle.active : ''
                }`}
                onClick={() => setActiveTab('sharedFolders')}
            >
                Shared Folders
            </div>
        </div>
        {activeTab === 'myFolder' ? <MyFolders /> : <SharedFolders />}
    </div>
  )
}

export default GetFolder