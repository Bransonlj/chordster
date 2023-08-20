const Users = require('../models/userModel');
const jwt = require('jsonwebtoken');

function createToken(_id) {
    return jwt.sign({_id, }, process.env.SECRET_KEY, {expiresIn: '2h'});
}

async function loginUser(req, res) {
    const { username, password } = req.body;

    try {
        const user = await Users.login(username, password);

        const token = createToken(user._id);

        res.status(200).json({username, token});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

async function signupUser(req, res) {
    const { username, email, password } = req.body;
    try {
        const user = await Users.signup(username, email, password);

        const token = createToken(user._id);

        res.status(200).json({username, token});
    } catch (error) {
        res.status(400).json(error.message);
    }
}

module.exports = { loginUser, signupUser }