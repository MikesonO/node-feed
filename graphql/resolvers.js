const bcrypt = require('bcryptjs');
const validator = require('validator');

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
    }
}