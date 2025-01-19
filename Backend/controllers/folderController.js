const Folders = require('../models/Folders')
const jwt = require('jsonwebtoken')
const cloudinary = require('../config/cloudinary')

// creating a folder 
// end point - api/folder/create (method - POST)
exports.createFolder = async (req, res) => {
    try {

        // here i getting the foldername, passcode from the user
        // the email was given by the CheckLoggedIn middleware
        const { folderName, passCode } = req.body
        const email = req.email

        console.log(passCode)

        // checking for the folder is already exist or not 
        const checkAlreadyExist = await Folders.findOne({ userMail: email, folderName })

        // if the folder exist it gives the message as folder already exist
        if(checkAlreadyExist) {
            return res.status(400).json({message: "The Folder name is already exist, Try out different name"})
        }

        // creating a new folder
        const folder = new Folders({ userMail: email, folderName, passCode })
        await folder.save()

        // sending response as a created folder
        res.status(200).json({ folder })

    } catch(e) {
        // response with the error
        res.status(400).json({message: "Something went wrong", error: e })

    }
};

// Deleting a folder
// Endpoint - api/folder/:id (method - DELETE)
exports.deleteFolder = async (req, res) => {
    try {
        // Extracting the ID from the URL parameter
        const { id } = req.params;
        
        // Checking if an ID exists
        if (!id) {
            return res.status(400).json({ message: "Folder does not exist" });
        }

        // Find the folder in the database
        const folder = await Folders.findById(id);

        // Check if the folder exists in the database
        if (!folder) {
            return res.status(404).json({ success: false, message: "Folder not found in the database" });
        }

        // Extract folder details for Cloudinary deletion
        const folderPath = `uploads/${folder.userMail}/${folder.folderName}`;

        // Check if the folder exists on Cloudinary
        try {
            const resources = await cloudinary.api.resources({
                type: "upload",
                prefix: folderPath,
                max_results: 1
            });

            // If resources are found, delete them and the folder
            if (resources.resources.length > 0) {
                // Delete all resources in the folder from Cloudinary
                await cloudinary.api.delete_resources_by_prefix(folderPath);

                // Delete the folder itself from Cloudinary
                await cloudinary.api.delete_folder(folderPath);

                console.log(`Folder '${folderPath}' and its contents deleted from Cloudinary.`);
            } else {
                console.log(`No folder found on Cloudinary for path '${folderPath}'. Skipping deletion.`);
            }
        } catch (cloudinaryError) {
            console.log(`Error checking Cloudinary for folder '${folderPath}':`, cloudinaryError.message);
        }

        // Delete the folder from the database
        await Folders.findByIdAndDelete(id);

        // Return the response indicating which folder was deleted
        return res.status(200).json({ success: true, message: `Folder '${folderPath}' deleted successfully.` });

    } catch (error) {
        console.error("Error deleting folder:", error);
        res.status(400).json({ message: "Something went wrong", error });
    }
};


// get all folder by single user
// end point - api/folder
exports.getAllUsersFolders = async (req, res) => {
    try {
        // checkLoggedIn middle ware passes the user email to the req.email
        const email = req.email

        // Getting all the folders related to the user based on the email
        const gettedFolders = await Folders.find({ userMail: email })

        // if there is no folder returns No folder exists
        if(gettedFolders.length == 0) {
            return res.status(400).json({message: "No folder exists"})
        }

        // Returns the response as all the user folders
        return res.status(200).json({ count: gettedFolders.length, gettedFolders })
    } catch (e) {
        res.status(400).json({message: "Something went wrong", error: e})
    }
};

// get a single folder
// end point - api/folder/:id (method - GET)
exports.getSingleFolder = async (req, res) => {
    try {
        const { id } = req.params
        if(!id) {
            return res.staus(400).json({ message: "Id is not valid"})
        }

        const findedFolder = await Folders.findById(id)
        if(!findedFolder) {
            return res.status(400).json({message: "Folder is not exist"})
        }

        res.status(200).json({findedFolder})
    } catch (e) {
        res.status(400).json({ message: "Something went wrong", error: e})
    }
};

// uploading a image
// end point - api/folder/upload/:id
exports.uploadImage = async (req, res) => {
    
    try {
        const { id } = req.params

        if(!id) {
            return res.status(404).json({
                success: false,
                message: 'id not found'
            });
        }

        // Ensure the file is present in the request
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }


        const userFolder = await Folders.findById(id);
        if(!userFolder){
            return res.status(404).json({
                success: false,
                message: 'folder not found!'
            });
        }

        // Upload the file to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: `uploads/${ userFolder.userMail }/${ userFolder.folderName }`, 
            public_id: `image-${ Date.now() }`, 
        });

        userFolder.categories.images.push(result.url); 
        await userFolder.save(); 

        
        // Return the result of the upload (URL and other details)
        return res.status(200).json({
            success: true,
            message: "Uploaded!",
            data: userFolder  // Cloudinary result contains the URL, public_id, etc.
        });

    } catch (err) {
        console.error(err);  // Log the error for debugging
        res.status(500).json({
            success: false,
            message: "Error during Cloudinary upload",
            error: err.message  // Send back the error message from Cloudinary for debugging
        });
    }
};

// end point - api/folder/deleteImage/:folderId/:imageId
exports.deleteImage = async (req, res) => {
    try {
        const { folderId } = req.params; // Extract folder ID and image ID from the route parameters
        const { imageId } = req.query

        if (!folderId || !imageId) {
            return res.status(400).json({
                success: false,
                message: "Folder ID or Image ID is missing",
            });
        }

        // Find the folder by ID
        const userFolder = await Folders.findById(folderId);
        if (!userFolder) {
            return res.status(404).json({
                success: false,
                message: "Folder not found",
            });
        }

        // Find the image URL in the folder's image array
        const imageUrlIndex = userFolder.categories.images.findIndex((url) => 
            url.includes(imageId)
        );

        if (imageUrlIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Image not found in folder",
            });
        }


        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(`uploads/${userFolder.userMail}/${userFolder.folderName}/${imageId.replace(/\.[^/.]+$/, "")}`, (error, result) => {
            if (error) {
                throw new Error(error.message);
            }
        });

        // Remove the image URL from the folder's image array
        userFolder.categories.images.splice(imageUrlIndex, 1);
        await userFolder.save();

        // Return success response
        return res.status(200).json({
                    success: true,
                    message: "Image deleted successfully",
                    data: userFolder,
                });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: "Error during image deletion",
            error: err.message, // Send back the error message for debugging
        });
    }
};

//end point - api/folder/upload/link/:folderName
exports.uploadLink = async (req, res) => {
    try {
        const { folderId } = req.params; // Get folder name from URL
        console.log(folderId)
        const { tag, link } = req.body; // Get link from request body

        // Validate the input
        if (!link || !tag) {
            return res.status(400).json({
                success: false,
                message: "Link or Tag is required",
            });
        }

        // Find the folder by name
        const folder = await Folders.findById(folderId)
        if (!folder) {
            return res.status(404).json({
                success: false,
                message: "Folder not found",
            });
        }

        // Push the link into the links array
        folder.categories.links.push({ link, tag});
        await folder.save();

        res.status(200).json({
            success: true,
            message: "Link added successfully",
            folder,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while adding the link",
            error: error.message,
        });
    }
}

// End point - api/folder/delete/:folderId
exports.deleteLink = async (req, res) => {
    try {
        const { folderId } = req.params; // Get folder name from URL
        const { link, tag } = req.query; // Get the link to delete from request body

        // Validate input
        if (!link || !tag) {
            return res.status(400).json({
                success: false,
                message: "Link or Tag is required for deletion",
            });
        }

        // Find the folder by name
        const folder = await Folders.findById(folderId);
        if (!folder) {
            return res.status(404).json({
                success: false,
                message: "Folder not found",
            });
        }

        // Check if the link exists in the links array
        const linkIndex = folder.categories.links.findIndex(
            (item) => item.link === link && item.tag === tag
        );

        if (linkIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Link not found in the folder",
            });
        }

        // Remove the link from the links array
        folder.categories.links.splice(linkIndex, 1);
        await folder.save();

        res.status(200).json({
            success: true,
            message: "Link deleted successfully",
            folder,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the link",
            error: error.message,
        });
    }
}