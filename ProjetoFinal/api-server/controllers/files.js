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
module.exports.editS = (id) => {
    Files.findOne({_id: id}).exec().then((result) => {
        if (result.privacy == 0) {
            result.privacy = 1;
        } else {
            result.privacy = 0;
        }
        return Files.findByIdAndUpdate(id, result, {new: true})
    })
    /*console.log(file.body)
    if(file.privacy == 0) {
        file.privacy = 1;
    }
    else {
        file.privacy = 0;
    }
    return Files.findByIdAndUpdate(id, file, {new: true})*/
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
