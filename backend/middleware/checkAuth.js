const jwt = require('jsonwebtoken');
const Users = require('../models/userModel');

// checks authentication using token sent in request and adds to req, does not set any status code if fail.
const checkAuth = async (req, res, next) => {
    // authorization = 'Bearer "TOKEN"'
    const { authorization } = req.headers;
    if (!authorization) {
        // add to request
        req.authorized = false
        return next();
    }

    const token = authorization.split(' ')[1]
    try {
        // get _id from body of token after verifying with secret key
        const { _id } = jwt.verify(token, process.env.SECRET_KEY)

        // add user of _id to req
        const user = await Users.findOne({_id}).select('_id username');
        if (!user) {
            // if token is valid, however user has been deleted.
            req.authorized = false
            return next();
        }
        req.user = user;
        req.authorized = true
        next();
    } catch (error) {
        console.log(error)
        req.authorized = false
        return next();
    }

}

module.exports = checkAuth;