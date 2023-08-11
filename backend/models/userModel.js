const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
});

/**
 * Login method using username and password
 * @param {String} username 
 * @param {String} password 
 * @returns The user object
 */
userSchema.statics.login = async function(username, password) {
    if (!username || !password) {
        throw Error("username or password cannot be empty")
    }

    const user = await this.findOne({ username });

    if (!user) {
        throw Error("Invalid username");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw Error("Invalid Password");
    }

    return user;
}

// static signup method
userSchema.statics.signup = async function(username, email, password) {

    if (!username || !email || !password) {
        throw Error("Username, Email or password cannot be empty")
    }

    if (!validator.isEmail(email)) {
        throw Error("Invalid Email")
    }

    if (!validator.isStrongPassword(password)) {
        throw Error("Password must contain uppercase, lowercase, number and special character")
    }

    const existsEmail = await this.findOne({ email });
    const existsUsername = await this.findOne({ username });
    if (existsEmail) {
        throw Error('Email already in use');
    } 

    if (existsUsername) {
        throw Error('Username already in use');
    } 

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ username, email, password: hash });

    return user;

}

module.exports = mongoose.model('user', userSchema)