// Noticias controller
var Noticia = require('../models/noticias')

// Listar noticias
module.exports.listar = () => {
    return Noticia.find().exec()
}

// Consultar noticia
module.exports.consultar = id => {
    return Noticia.findOne({_id: id}).exec()
}

// Inserir um nova noticia
module.exports.inserir = noticia => {
    var nova = new Noticia(noticia)
    return nova.save()
}

// Remover uma noticia
module.exports.remover = id => {
    return Noticia.deleteOne({_id: id})
}
