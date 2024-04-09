const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .normalizeEmail()
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('E-Mail address already exists!');
                    }
                })
        }),
    body('password')
        .trim()
        .isLength({ min: 5 }),

    body('name')
        .trim()
        .not().isEmpty()
        .isLength({ min: 5 })

], authController.signup);

module.exports = router;