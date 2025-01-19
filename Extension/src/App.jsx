// React Import
import React from "react";

// React Router Import
import { Routes, Route, Navigate } from "react-router-dom";

// React Routing component Import
import Register from "./Components/Auth/Register";
import Validate from "./Components/Auth/Validate";
import Home from "./Components/Home/Home";
import Login from "./Components/Auth/Login";
import CreateFolder from "./Components/Home/Create Folder/CreateFolder";
import SingleFolder from "./Components/Home/Get Folders/Get Single Folder/SingleFolder";
import UploadImages from "./Components/Home/Get Folders/SingleFolderData/Upload/UploadImages";
import UploadLinks from "./Components/Home/Get Folders/SingleFolderData/Upload/UploadLinks";
import AddSharedFolder from "./Components/Home/Get Folders/Shared Folder/AddSharedFolder";

// Custom Hook for check the authentication
import useAuth from "./CustomHooks/useAuth";

// for loading the loading animation
import './Utilities/loading.css'

const App = () => {

	// This is custom hook which is used to Check the user is already logged in or not
	const { loading, decodedToken } = useAuth(); 

	if (loading) {
		return <div className="loader"></div>; // Show loading state while cookie is being fetched/decoded
	}

	return (
	<Routes>

		<Route path="/" element={<Register />} />
		<Route path="/validate" element={<Validate />} />
		<Route path="/login" element={<Login />} />

		<Route path="/home/" element={<Home user={decodedToken} />} />

		<Route path="/cf" element={<CreateFolder />} />

		<Route path="/folder/:folderId" element={ <SingleFolder /> } />

		<Route path="/upload/image/:folderId" element={ <UploadImages /> } />

		<Route path="/upload/links/:folderId" element={ <UploadLinks /> } />

		<Route path="/sharedFolder" element={ <AddSharedFolder /> } />

		<Route path="*" element={<Navigate to="/" />} />
	</Routes>
	);
};

export default App;

