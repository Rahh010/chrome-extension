const mongoose = require('mongoose');


connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected')
    }catch(e) {
        console.error('MongoDB error:', e)
        process.exit(1)
    }
}

module.exports = connectDB