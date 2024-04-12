const jsonWebToken = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');

    // Check if Authorization is in the header
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }

    const token = authHeader.split(' ')[1];
    let decodedToken

    // Verify JSON Web Token
    try {
        decodedToken = jsonWebToken.verify(token, process.env.SECRET_PHRASE);
    } catch (err) {
        req.isAuth = false;
        return next();
    }

    // Check exists is attached
    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }

    req.userId = decodedToken.userId;
    req.isAuth = true;
    next();
}