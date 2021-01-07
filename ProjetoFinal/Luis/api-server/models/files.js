var mongoose = require('mongoose')

var FileSchema = new mongoose.Schema({
    date: String,
    autor: String,
    name: String,
    mimetype: String,
    size: Number,
    privacy: Number,
    filepath: String,
    descricao: String
})

module.exports = mongoose.model('files', FileSchema)