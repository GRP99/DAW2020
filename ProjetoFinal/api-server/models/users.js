var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({role: String, course: String, department: String});

var UserSchema = new mongoose.Schema({
    _id: String,
    name: String,
    password: String,
    level: String,
    profilepic: Number,
    registrationDate: String,
    lastAccessDate: String,
    git: String,
    affiliation: {
        type: affiliationSchema
    }
});


module.exports = mongoose.model('users', UserSchema);