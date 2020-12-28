// Utilizadores model
var mongoose = require('mongoose')

var filiacaoSchema = new mongoose.Schema({
    cargo: {
        type: String,
        required: true
    },
    curso: {
        type: String,
        required: true
    },
    departamento: {
        type: String
    }
})

var utilizadoresSchema = new mongoose.Schema({
    numero:{
        type: String, 
        required: true, 
        unique: true
    },
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    filiacao: {
        type: filiacaoSchema
    },
    nivel: {
        type: String,
        required: true
    },
    dataRegisto: {
        type: String,
        default: new Date().getTime()
    },
    dataUltimoAcesso: {
        type: String,
        default: new Date().getTime()
    },
    github: String
});

module.exports = mongoose.model("utilizadores", utilizadoresSchema);