// USERS CONTROLLER

var Users = require('../models/users')


// retorna all the users
module.exports.listUsers = () => {
    return Users.find().exec();
}


// find that user
module.exports.lookUp = id => {
    return Users.findOne({_id: id}).exec();
}


// insert a new user
module.exports.insereUser = p => {
    var newUser = new Users(p);
    newUser.profilepic = 0
    return newUser.save();
}

// change the profilepic 
module.exports.updatePhoto = (id) => {
    Users.findOne({_id: id}).exec().then((result) => {
        result.profilepic = 1
        Users.findByIdAndUpdate(id, result, {new: true})
        return result.save()
    });
}