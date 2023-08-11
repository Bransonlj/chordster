const jwt = require('jsonwebtoken');
const Users = require('../models/userModel');

const useAuth = async (req, res, next) => {
    // authorization = 'Bearer "TOKEN"'
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({error: "unauthorized"})
    }

    const token = authorization.split(' ')[1]

    try {
        // get _id from body of token after verifying with secret key
        const { _id } = jwt.verify(token, process.env.SECRET_KEY)

        // add user of _id to req
        const user = await Users.findOne({_id}).select(['_id', 'username']);
        if (!user) {
            // if token is valid, however user has been deleted.
            return res.status(401).json({error: "unauthorized token, user does not exist"})
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({error: "unauthorized"})
    }

}

module.exports = useAuth;