const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const salutRounds = 10;

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true,"Please enter Username"],
        unique: true
    },
    email: {
        type: String,
        required: [true,"Please enter Email"],
        unique: true
    },
    password: {
        type: String,
        required: [true,"Please enter password"]
    },
    uuid: {
        type: String,
        default: uuid.v4()
    },
    createAt: {
        type: Number,
        default: Date.now
    },
});

UserSchema.pre('save',function(next) {
    var user = this;
    bcrypt.hash(user.password,salutRounds).then(hash => {
        user.password = hash;
        next();
    }).catch((err) => {
        throw new Error(err);
    })
})

UserSchema.plugin(uniqueValidator, { message: '{PATH} already Used!' });

const User = mongoose.model('User',UserSchema);
module.exports = User;