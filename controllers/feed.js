const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{
            _id: "1",
            title: "First Posts",
            content: "This is the first post!",
            imageUrl: "images/book.png",
            creator: {
                name: "Mikeson"
            },
            createdAt: new Date()
        }]
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
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};