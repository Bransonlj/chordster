const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
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

userSchema.statics.login = async function(email, password) {
    if (!email || !password) {
        throw Error("Email or password cannot be empty")
    }

    const user = await this.findOne({ email });

    if (!user) {
        throw Error("Invalid Email");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw Error("Invalid Password");
    }

    return user;
}

// static signup method
userSchema.statics.signup = async function(email, password) {

    if (!email || !password) {
        throw Error("Email or password cannot be empty")
    }

    if (!validator.isEmail(email)) {
        throw Error("Invalid Email")
    }

    if (!validator.isStrongPassword(password)) {
        throw Error("Password must contain uppercase, lowercase, number and special character")
    }

    const exists = await this.findOne({ email });
    if (exists) {
        throw Error('Email already in use');
    } 

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ email, password: hash });

    return user;

}

module.exports = mongoose.model('user', userSchema)