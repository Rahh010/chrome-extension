const Folders = require('../models/Folders')
const jwt = require('jsonwebtoken')

// shares a folder with another user
exports.shareFolder = async (req, res) => {
    try {
        const email = req.email
        const { userMail, folderName, passCode } = req.body;

        if(email == userMail) {
            return res.status(400).json({ success:false, message: "You can't share yourself"})
        }

        if (!folderName || !passCode || !userMail) {
            return res.status(400).json({ success:false, message: "Foldername, passcode, or mail is missing" });
        }

        const folder = await Folders.findOne({ userMail, folderName });
        if (!folder) {
            return res.status(400).json({ success: false, message: "Folder not found" });
        }

        if (passCode !== folder.passCode) {
            return res.status(400).json({ success: false, message: "Invalid Passcode" });
        }
        
        // Avoid duplicate entries in the `users` array
        if (folder.users.includes(email)) {
            return res.status(400).json({ success: false, message: "You've already had this folder" });
        }
        
        folder.users.push(email);
        await folder.save();

        return res.status(200).json({ success: true, message: "Folder shared successfully", folder });
    } catch (error) {
        console.error("Error sharing folder:", error); // Log the error for debugging
        return res.status(500).json({ success: true, message: "Server error", error });
    }
};

// Get the Folder for desired User
exports.getUser = async (req, res) => {
    const email = req.email; // Expecting email to be passed as a query parameter
  
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email query parameter is required.' });
    }
  
    try {
      // Find folders where the specified email is in the "users" array
      const folders = await Folders.find({ users: email });
  
      if (folders.length === 0) {
        return res.status(404).json({ message: 'No folders found for the specified email.' });
      }
  
      res.status(200).json({ success: true, folders});
    } catch (error) {
      console.error('Error retrieving folders:', error);
      res.status(500).json({ success: false, message: 'Internal server error.', error: error.message });
    }
}

// Delete the shared user
exports.deleteSharedUser = async (req, res) => {
    try {
        const email = req.email
        
        const { folderName, sharedUserMail } = req.body;
        if (!folderName || !sharedUserMail) {
            return res.status(400).json({ message: "Foldername, sharedUserMail is missing" });
        }

        const folder = await Folders.findOne({ userMail: email, folderName });
        if (!folder) {
            return res.status(400).json({ message: "Folder not found" });
        }
        
        // Avoid duplicate entries in the `users` array
        if (!folder.users.includes(sharedUserMail)) {
            return res.status(400).json({ message: "User not found" });  
        }

        // Check if the link exists in the links array
        const sharedUserMailIndex = folder.users.indexOf(sharedUserMail);
        if (sharedUserMailIndex === -1) {
            return res.status(400).json({ message: "User not found" });  
        }

        // Remove the link from the links array
        folder.users.splice(sharedUserMailIndex, 1);
        await folder.save();
        

        return res.status(200).json({ message: "User removed successfully", folder });
    } catch (error) {
        console.error("Error Deleting user :", error); // Log the error for debugging
        return res.status(500).json({ message: "Server error", error });
    }
};