var mongoose = require('mongoose');

var FieldSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
})

var TypeSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    fields: {
        type: [FieldSchema],
        default: []
    }
})

module.exports = mongoose.model('types', TypeSchema)