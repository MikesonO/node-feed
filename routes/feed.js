const express = require('express');
const { body } = require('express-validator');

const feedController = require('../controllers/feed')

const router = express.Router();

// GET /feed/posts - Get Posts
router.get('/posts', feedController.getPosts);


// GET /feed/post - Get Post
router.get('/post/:postId', feedController.getPost);

// POST /feed/post - Create Post
router.post('/post', [
    body('title')
        .trim()
        .isLength({ min: 5 }),
    body('content')
        .trim()
        .isLength({ min: 5 })
], feedController.createPost);

// PUT /feed/post - Update Post
router.put('/post/:postId', [
    body('title')
        .trim()
        .isLength({ min: 5 }),
    body('content')
        .trim()
        .isLength({ min: 5 })
], feedController.updatePost);



module.exports = router;