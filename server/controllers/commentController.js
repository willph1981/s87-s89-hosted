const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Create a comment on a post
const createComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.user.userId;

        // Ensure post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Create new comment
        const comment = new Comment({
            content,
            author: userId,
            post: postId,
        });

        const savedComment = await comment.save();

        // Add the new comment to the post's comments array
        post.comments.push(savedComment._id);
        await post.save();

        res.status(201).json(savedComment); // Return the saved comment
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all comments for a post
const getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        console.log("Received postId:", postId); //delete this
        const comments = await Comment.find({ post: postId }).populate('author', 'username');
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a comment
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        // Ensure req.user exists before proceeding
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Allow the comment author OR an admin to delete the comment
        if (comment.author.toString() !== req.user.userId && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Delete Comment Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createComment, getComments, deleteComment };
