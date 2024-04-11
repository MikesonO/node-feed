const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const io = require('../socket');
const Post = require('../models/post');
const User = require('../models/user');


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


// Endpoints functions
exports.getPosts = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;

    try {
        const totalItems = await Post.find().countDocuments()

        const posts = await Post.find()
            .populate('creator')
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({ message: 'Fetched posts successfully', posts: posts, totalItems: totalItems });
    } catch (error) {
        handleError(err, next);
    }

};

exports.getPost = async (req, res, next) => {
    const postId = req.params.postId;

    // Find postId in the database
    try {
        const post = await Post.findById(postId)
        if (!post) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Post fetched.', post: post });
    } catch (error) {
        handleError(err, next);
    }
};

exports.createPost = async (req, res, next) => {
    try {
        // If errors exist
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }
        if (!req.file) {
            const error = new Error('No image provided.');
            error.statusCode = 422;
            throw error;
        }
        const imageUrl = req.file.path;
        const title = req.body.title;
        const content = req.body.content;

        // Post data
        const post = new Post({
            title: title,
            content: content,
            imageUrl: imageUrl,
            creator: req.userId
        });

        // Save / Store post data to DB
        const result = await post.save();

        // Find the user
        const user = await User.findById(req.userId);
        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }

        // Update user's posts
        user.posts.push(post);
        const savedUser = await user.save();

        // Send message to all connected users
        io.getIO().emit('posts', {
            action: 'create',
            post: post
        });

        // Send response
        res.status(201).json({
            message: 'Post created successfully!',
            post: post,
            creator: { _id: savedUser._id, name: savedUser.name }
        });
    } catch (err) {
        handleError(err, next);
    }
};

exports.updatePost = async (req, res, next) => {
    try {
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

        const post = await Post.findById(postId);

        if (!post) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }

        if (post.creator.toString() !== req.userId) {
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }

        if (imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl);
        }

        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;

        const updatedPost = await post.save();

        res.status(200).json({ message: 'Post updated!', post: updatedPost });
    } catch (err) {
        handleError(err, next);
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);

        if (!post) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }

        // Check logged in User
        if (post.creator.toString() !== req.userId) {
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }

        clearImage(post.imageUrl);

        await Post.findByIdAndDelete(postId);

        const user = await User.findById(req.userId);
        user.posts.pull(postId);
        await user.save();

        res.status(200).json({ message: 'Deleted post!' });
    } catch (err) {
        handleError(err, next);
    }
};

exports.getStatus = async (req, res, next) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const status = user.status;
        res.status(200).json({ status });
    } catch (err) {
        handleError(err, next);
    }
};

exports.updateStatus = async (req, res, next) => {
    try {
        const userId = req.userId;
        const updatedStatus = req.body.status;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.status = updatedStatus;
        await user.save();

        res.status(200).json({ message: 'User updated.' });
    } catch (err) {
        handleError(err, next);
    }
};
