const Users = require('../models/userModel');
const jwt = require('jsonwebtoken');

function createToken(_id) {
    return jwt.sign({_id, }, process.env.SECRET_KEY, {expiresIn: '3d'});
}

async function loginUser(req, res) {
    const { email, password } = req.body;

    try {
        const user = await Users.login(email, password);

        const token = createToken(user._id);

        res.status(200).json({email, token});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

async function signupUser(req, res) {
    const { email, password } = req.body;
    try {
        const user = await Users.signup(email, password);

        const token = createToken(user._id);

        res.status(200).json({email, token});
    } catch (error) {
        res.status(400).json(error.message);
    }
}

module.exports = { loginUser, signupUser }