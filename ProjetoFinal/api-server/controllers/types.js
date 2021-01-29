// TYPES CONTROLLER
var Types = require('../models/types');

module.exports.list = () => {
    return Types.find().exec();
}

module.exports.lookup = id => {
    return Types.findOne({_id: id}).exec();
}

module.exports.insert = t => {
    var newType = new Tipo(t);
    return newType.save();
}