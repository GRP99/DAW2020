// Noticias model
const mongoose = require('mongoose')

var noticiasSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true,
        default: new Date().getTime()
    },
    texto: {
        type: String
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'utilizadores',
        required: true
    }
});

module.exports = mongoose.model('noticias', noticiasSchema)
