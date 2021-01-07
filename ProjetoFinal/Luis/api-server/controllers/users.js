var Users = require('../models/users')


/* Return list Users */
module.exports.listUsers = () => {
    return Users.find().exec()
}



module.exports.lookUp = id => {
    return Users.findOne({_id: id}).exec()
}


/* Inserts User */
module.exports.insereUser = p => {
    var newUser = new Users(p)
    newUser.profilepic = 0
    return newUser.save()
}



/* Changes profilepic */
module.exports.updatePhoto = (id) => {
    Users.findOne({_id: id}).exec().then((result) => {
        result.profilepic = 1
        Users.findByIdAndUpdate(id, result, {new: true})
        return result.save()
    })
}