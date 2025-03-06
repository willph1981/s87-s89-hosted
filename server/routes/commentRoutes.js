const express = require('express');
const router = express.Router();
const { createComment, getComments, deleteComment } = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

console.log('commentRoutes loaded');
// Create a comment on a post (Requires authentication)
router.post('/:postId/comments', authMiddleware, createComment);  // Fixed

// Get all comments for a post
router.get('/:postId/comments', getComments);

// Delete a specific comment (Requires authentication)
router.delete('/:commentId', authMiddleware, deleteComment);

module.exports = router;
