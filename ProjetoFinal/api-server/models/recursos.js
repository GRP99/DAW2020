// Recursos model
var mongoose = require('mongoose')

var estrelasSchema = new mongoose.Schema({
    numero: {
        type: Number,
        required: true,
        default: 0
    },
    autores: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'utilizadores'
        }
    ]
})

var comentariosSchema = new mongoose.Schema({
    data: {
        type: String,
        required: true,
        default: new Date().getTime()
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'utilizadores',
        required: true
    },
    texto: {
        type: String,
        required: true
    }
});

var recursosSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: true
    },
    titulo: {
        type: String,
        required: true
    },
    subtitulo: {
        type: String
    },
    dataCriacao: {
        type: String,
        required: true
    },
    dataRegisto: {
        type: String,
        required: true,
        default: new Date().getTime()
    },
    visibilidade: {
        type: String,
        required: true
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'utilizadores',
        required: true
    },
    tema: [
        {
            type: String
        }
    ],
    comentarios: [
        {
            type: comentariosSchema
        }
    ],
    estrelas: {
        type: estrelasSchema,
        required: true
    }
})

module.exports = mongoose.model('recursos', recursosSchema)
