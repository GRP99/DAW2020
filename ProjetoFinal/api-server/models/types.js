var mongoose = require('mongoose');

var TypeSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    fields: {
        type: [String],
        default: []
    }
})

module.exports = mongoose.model('types', TypeSchema)
