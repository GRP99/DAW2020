/* PARAGRAPH CONTROLLER */
var Files = require('../models/files')
/* Return list of paragraphs */
module.exports.list = () => {
    return Files.find().exec()
}

module.exports.publicFiles = () => {
    return Files.find({privacy: 0}).exec()
}

/* Returns a file record */
module.exports.lookup = id => {
    return Files.findOne({_id: id}).exec()
}

/* Inserts a new paragraph */
module.exports.insert = (p, path) => {
    console.log(JSON.stringify(p))
    var newFile = new Files(p)
    newFile.filepath = path
    estrelas = {
        type:0,
        autores:[]
    }
    newFile.comentarios = []
    newFile.estrelas = estrelas;
    console.log(newFile)
    return newFile.save()
}


module.exports.filesbyUser = id => {
    return Files.find({autor: id}).exec()
}

module.exports.findByName = name => {
    return Files.findOne({name: name}).exec()
}

/* Delete a paragraph */
module.exports.remove = id => {
    return Files.deleteOne({_id: id})
}

/* Changes security */
module.exports.addFav = (id, user) => {
    Files.findOne({_id: id}).exec().then((result) => {
        result.favourites.add(user);
        return Files.findByIdAndUpdate(id, result, {new: true});
    })
}

/* Add classificação e calcula nova média */
module.exports.classifica = (id, user, classi) => {
    Files.findOne({_id: id}).exec().then((result) => {
        result.numero = ((result.numero * result.autores.length) + classi) / (result.autores.length + 1);
        result.autores = result.autores.add(user);
        return Files.findByIdAndUpdate(id, result, {new: true});
    })
}


// Adicionar um novo comentario
module.exports.adicionarComentario = (idR, comentario) => {
    return Files.update({
        _id: idR
    }, {
        $push: {
            comentarios: comentario
        }
    }).exec()
}

// Remover um comentario
module.exports.removerComentario = (idR, idC) => {
    return Files.update({
        _id: idR
    }, {
        $pull: {
            "comentarios": {
                _id: idC
            }
        }
    }).exec()
}

// Obter estrelas
module.exports.getEstrelas = (id) => {
    return Files.find({
        _id: id
    }, {
        _id: 0,
        estrelas: 1
    }).exec()
};

// Adicionar uma nova estrela
module.exports.incrementarEstrelas = (idR, idU) => {
    return Files.updateOne({
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

// Remover uma estrela
module.exports.decrementarEstrelas = (idR, idU) => {
    return Files.updateOne({
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
