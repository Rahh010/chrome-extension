const mongoose = require('mongoose');

// Define the schema for each folder
const folderSchema = new mongoose.Schema({
  userMail: {
    type: String,
    ref: 'User', // Assuming there's a User model for authentication
    required: true,
  },
  folderName: {
    type: String,
    required: true
  },
  passCode: {
    type: String,
    required: true,
  },
  users: [
    {
      type: String,
      required: false,
    }
  ],
  categories: {
    images: [
      {
        type: String,
        required: false,
      },
    ],
    links: [
      {
        link: String,
        tag: String,
      },
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Folder', folderSchema);
