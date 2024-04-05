const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const Post = require('../models/post');


// Functions
const handleError = (err, next) => {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => {
        if (err) {
            console.error(err);
            return err;
        } else {
            console.log("Image File updated successfully");
            return null;
        }
    });
};


// Endpoints
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

    if (!req.file) {
        const error = new Error('No image provided.');
        error.statusCode = 422;
        throw error;
    }

    const title = req.body.title;
    const imageUrl = req.file.path;
    const content = req.body.content;

    // Post data
    const post = new Post({
        title: title,
        imageUrl: imageUrl,
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


exports.updatePost = (req, res, next) => {
    const errors = validationResult(req);

    // If errors exist
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed, entered data is incorrect.");
        error.statusCode = 422;
        throw error;
    }

    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;

    if (req.file) {
        imageUrl = req.file.path;
    }

    if (!imageUrl) {
        const error = new Error('No file picked.');
        error.statusCode = 422;
        throw error;
    }

    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error;
            }

            if (imageUrl !== post.imageUrl) {
                clearImage(post.imageUrl);
            }

            post.title = title;
            post.imageUrl = imageUrl;
            post.content = content;

            return post.save();
        })
        .then(result => {
            console.log(result);
            res.status(200).json({ message: 'Post updated!', post: result });
        })
        .catch(err => {
            handleError(err, next);
        });
};
