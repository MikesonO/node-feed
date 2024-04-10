const User = require('../models/user');

const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');

// Functions
const handleError = (err, next) => {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
}

// Endpoints functions
exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                name: name
            });
            return user.save();
        })
        .then(result => {
            res.status(201).json({ message: 'User created!', userId: result._id })
        })
        .catch(err => {
            handleError(err, next);
        });
}

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error('A user with this email could not be found.');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);

        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password!');;
                error.statusCode = 401;
                throw error;
            }

            console.log(process.env.SECRET_PHRASE)

            const token = jsonWebToken.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            }, process.env.SECRET_PHRASE, { expiresIn: '1h' });

            res.status(200).json({ token: token, userId: loadedUser._id.toString() });

        })
        .catch(err => {
            handleError(err, next);
        })
}
