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
        return res.status(422).json({
            message: "Validation failed, entered data is incorrect.",
            errors: errors.array()
        })
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
            console.log(err);
        })
}