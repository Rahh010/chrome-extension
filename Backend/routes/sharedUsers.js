const express = require('express')
const router = express.Router() 
const checkLoggedIn = require('../middlewares/checkLoggedIn')
const { 
    shareFolder, 
    deleteSharedUser, 
    getUser
} = require('../controllers/sharedUsers')

// Add the Another user for a folder
router.post('/', checkLoggedIn, shareFolder)

router.get('/', checkLoggedIn, getUser)

// Delete a user 
router.delete('/', checkLoggedIn, deleteSharedUser)

module.exports = router