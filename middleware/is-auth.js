const jsonWebToken = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');

    // Check if Authorization is in the header
    if (!authHeader) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(' ')[1];
    let decodedToken

    // Verify JSON Web Token
    try {
        decodedToken = jsonWebToken.verify(token, process.env.SECRET_PHRASE);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }

    // Check exists is attached
    if (!decodedToken) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }

    req.userId = decodedToken.userId;
    next();
}