const express = require('express');
const { body } = require('express-validator');

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /feed/posts - Get Posts
router.get('/posts', isAuth, feedController.getPosts);


// GET /feed/post - Get Post
router.get('/post/:postId', isAuth, feedController.getPost);

// POST /feed/post - Create Post
router.post('/post', [
    body('title')
        .trim()
        .isLength({ min: 5 }),
    body('content')
        .trim()
        .isLength({ min: 5 })
], isAuth, feedController.createPost);

// PUT /feed/post - Update Post
router.put('/post/:postId', [
    body('title')
        .trim()
        .isLength({ min: 5 }),
    body('content')
        .trim()
        .isLength({ min: 5 })
], isAuth, feedController.updatePost);

// DELETE /feed/post - Delete Post
router.delete('/post/:postId', isAuth, feedController.deletePost);


// GET /feed/post - Get Status
router.get('/status', isAuth, feedController.getStatus);

// PUT /feed/post - Update Status
router.put('/status', isAuth, [
    body('status')
        .not()
        .isEmpty()
], feedController.updateStatus);



module.exports = router;