var mongoose = require('mongoose')

var UserSchema = new mongoose.Schema({
    name: String,
    _id: String,
    password: String,
    profilepic: Number
})

module.exports = mongoose.model('users', UserSchema)