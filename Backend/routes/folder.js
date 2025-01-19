const express = require('express')
const router = express.Router() 
const upload = require('../utils/multer')
const checkLoggedIn = require('../middlewares/checkLoggedIn')
const { 
    createFolder, 
    deleteFolder, 
    getAllUsersFolders, 
    getSingleFolder, 
    uploadImage, 
    deleteImage, 
    uploadLink,
    deleteLink
} = require('../controllers/folderController')

// Create a folder - api/folder/create
router.post('/create', checkLoggedIn, createFolder)

// Delete a folder and if the folder has the images in cloudinary also deletes the images in cloudinary
// api/folder/:id (folder id)
router.delete('/:id', checkLoggedIn, deleteFolder)

// This gives the users all created folder by JWT TOKEN
// api/folder/
router.get('/', checkLoggedIn, getAllUsersFolders)

// Get a single folder - api/folder/:id (folder id)
router.get('/:id', checkLoggedIn, getSingleFolder)

// Upload images - api/folder/upload/image/:id (folder id)
router.post('/upload/image/:id', checkLoggedIn, upload.single('image'), uploadImage)

// Delete singel Image - api/folder/delete/image/:folderId/:imageId 
router.delete('/delete/image/:folderId/', checkLoggedIn, deleteImage)

// Upload links - api/folders/uploads/link/:folderName
router.post('/upload/link/:folderId', checkLoggedIn, uploadLink)

// Delete the links - api/delete/link/:folderName
router.delete('/delete/link/:folderId', checkLoggedIn, deleteLink)

module.exports = router