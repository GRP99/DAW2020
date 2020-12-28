// Utilizador controller
var Utilizador = require('../models/utilizadores')

// Listar utilizadores
module.exports.listar = () => {
    return Utilizador.find().exec()
}

// Verificar o utilizador
module.exports.verificarUtilizador = (unumero, umail) => {
    return Utilizador.find({
        $or: [
            {
                numero: unumero
            }, {
                email: umail
            }
        ]
    }).exec()
}

// Verificar a password
module.exports.verificarPassword = (unumero, upassword) => {
    return Utilizador.find({numero: unumero, password: upassword}).exec()
}

// Consultar o utilizador
module.exports.consultar = unumero => {
    return Utilizador.findOne({numero: unumero}).exec()
}

// Atualizar utilizador
module.exports.atualizarUtilizador = (unumero, info) => {
    return Utilizador.update({
        numero: unumero
    }, {
        $set: {
            nome: info.nome,
            email: info.email,
            password: info.password,
            "filiacao.cargo": info.filiacao.cargo,
            "filiacao.curso": info.filiacao.curso,
            "filiacao.departamento": info.filiacao.departamento,
            github: info.github,
        }
    })
}

// Inserir novo utilizador
module.exports.inserir = u => {
    var novoutilizador = new Utilizador(u)
    return novoutilizador.save()
}
