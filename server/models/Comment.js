const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',  // Reference to User model
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',  // Reference to Post model
            required: true,
        },
    },
    { timestamps: true } // Automatically adds createdAt & updatedAt
);

module.exports = mongoose.model('Comment', commentSchema);
