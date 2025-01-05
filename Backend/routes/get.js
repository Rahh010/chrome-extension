const express = require('express')
const router = express.Router() 

router.get('/message', (req, res) => {
    res.status(200).json({ message : "Buttu papaa api backend la irunthu pesuren"})
})

module.exports = router