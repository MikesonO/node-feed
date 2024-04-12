const bcrypt = require('bcryptjs');
const validator = require('validator');
const jsonWebToken = require('jsonwebtoken');

const User = require('../models/user');

module.exports = {
    createUser: async function ({ userInput }, req) {

        const errorsArray = [];

        // Validate email
        if (!validator.isEmail(userInput.email)) {
            errorsArray.push({ message: 'E-Mail is invalid.' });
        }

        // Validate password
        if (validator.isEmpty(userInput.password) || !validator.isLength(userInput.password, { min: 5 })) {
            errorsArray.push({ message: 'Password too short!' });
        }

        // Check errorsArray
        if (errorsArray.length > 0) {
            const error = new Error('Invalid input.');
            error.data = errorsArray;
            error.code = 422;
            throw error;
        }

        // Check if User exists 
        const existingUser = await User.findOne({ email: userInput.email });
        if (existingUser) {
            const error = new Error('User exists already!');
            throw error;
        }

        const hashedPw = await bcrypt.hash(userInput.password, 12);
        const user = new User({
            email: userInput.email,
            name: userInput.name,
            password: hashedPw
        });

        const createdUser = await user.save();
        return { ...createdUser._doc, _id: createdUser._id.toString() };
    },

    login: async function ({ email, password }) {

        // Check User
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error('User not found.');
            error.code = 401;
            throw error;
        }

        // Check Password
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error('Password is incorrect.');
            error.code = 401;
            throw error;
        }


        const tokwn = jwt.sign({
            userId: user._id.toString(),
            email: user.email
        }, process.env.SECRET_PHRASE, { expiresIn: '2h' });

        return { token: token, userId: user._id.toString() };




    }
}