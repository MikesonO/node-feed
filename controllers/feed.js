const { validationResult } = require('express-validator');

const Post = require('../models/post');

const handleError = (err, next) => {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
}

exports.getPosts = (req, res, next) => {
    Post.find()
        .then(posts => {
            res.status(200).json({ message: 'Fetched posts successfully', posts: posts });
        })
        .catch(err => {
            handleError(err, next);
        });
};

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;

    // Find postId in the database
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ message: 'Post fetched.', post: post });
        })
        .catch(err => {
            handleError(err, next);
        });
};


exports.createPost = (req, res, next) => {
    const errors = validationResult(req);

    // If errors exist
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed, entered data is incorrect.");
        error.statusCode = 422;
        throw error;
    }

    const title = req.body.title;
    const content = req.body.content;

    // Post data
    const post = new Post({
        title: title,
        imageUrl: 'images/book.png',
        content: content,
        creator: {
            name: "Mikeson"
        }
    })
    // Save / Store post data to DB
    post.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Post created successfully!",
                post: result
            });
        })
        .catch(err => {
            handleError(err, next);
        });
};