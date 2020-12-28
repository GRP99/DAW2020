// Recurso controller
var Recurso = require('../models/recursos')

// Todos os recursos
module.exports.listar = () => {
    return Recurso.find().exec()
}

// Consultar recurso
module.exports.obterRecurso = idR => {
    return Recurso.findOne({_id: idR}).exec()
}

// Recursos do user
module.exports.filtrarRecursosAutor = idA => {
    return Recurso.find({autor: idA}).exec()
}

// Inserir novo recurso
module.exports.inserir = r => {
    var novorecurso = new Recurso(r)
    return novorecurso.save()
}

// Remover recurso
module.exports.remover = idR => {
    return Recurso.deleteOne({_id: idR})
}

// Adicionar um novo comentario
module.exports.adicionarComentario = (idR, comentario) => {
    return Recurso.update({
        _id: idR
    }, {
        $push: {
            comentarios: comentario
        }
    }).exec()
}

// Remover um comentario
module.exports.removerComentario = (idR, idC) => {
    return Recurso.update({
        _id: idR
    }, {
        $pull: {
            "comentarios": {
                _id: idC
            }
        }
    }).exec()
}

// Adicionar uma nova estrela
module.exports.incrementarEstrelas = (idR, idU) => {
    return Recurso.updateOne({
        _id: idR
    }, {
        $push: {
            "estrelas.autores": idU
        },
        $inc: {
            "estrelas.numero": 1
        }
    }).exec()
}

// Remove uma estrela
module.exports.decrementarEstrelas = (idR, idU) => {
    return Recurso.updateOne({
        _id: idR
    }, {
        $pull: {
            "estrelas.autores": idU
        },
        $inc: {
            "estrelas.numero": -1
        }
    }).exec()
}

// Encontrar um tipo
module.exports.filtrarTipo = t => {
    return Recurso.find({tipo: t}).exec()
}
