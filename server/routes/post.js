const express = require('express');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new post (Protected Route)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;
        const newPost = new Post({ title, content, author: req.user.userId });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a single post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a post (Only Author)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.author.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        post.title = req.body.title || post.title;
        post.content = req.body.content || post.content;
        await post.save();

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a post (Only Author or Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.author.toString() !== req.user.userId && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await post.deleteOne();
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
