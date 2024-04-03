const { validationResult } = require('express-validator');

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
    const title = req.body.title;
    const content = req.body.content;

    // If errors exist
    if (!error.isEmpty()) {
        return res.status(422).json({
            message: "Validation failed, entered data is incorrect.",
            errors: errors.array()
        })
    }

    // Create Posts in DB
    res.status(201).json({
        message: "Post created successfully!",
        post: {
            _id: new Date().toISOString,
            title: title,
            content: content,
            creator: {
                name: "Mikeson"
            },
            createdAt: new Date()
        }
    })

}