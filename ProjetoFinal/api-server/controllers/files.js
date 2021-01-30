// FILES CONTROLLER

var Files = require('../models/files');


// return all files
module.exports.list = () => {
    return Files.find().exec();
}


// return only public files
module.exports.publicFiles = () => {
    return Files.find({privacy: 0}).exec();
}


// find that file
module.exports.lookup = id => {
    return Files.findOne({_id: id}).exec();
}


// insert a new file
module.exports.insert = (p, path) => {
    // console.log(JSON.stringify(p));
    var newFile = new Files(p)
    newFile.filepath = path
    estrelas = {
        type: 0,
        autores: []
    }
    newFile.comentarios = []
    newFile.estrelas = estrelas;
    // console.log(newFile)
    return newFile.save();
}


// all the files that user
module.exports.filesbyUser = id => {
    return Files.find({autor: id}).exec();
}


// find a file with a given title
module.exports.findByName = t => {
    return Files.findOne({title: t}).exec()
}


// delete file
module.exports.remove = id => {
    return Files.deleteOne({_id: id})
}


// add a user to favourites list from file 
module.exports.addFav = (id, user) => {
    return Files.findOne({_id: id}).exec().then((result) => {
        result.favoritos.push(user);
        return Files.findByIdAndUpdate(id, result, {new: true});
    })
}

// removes a user to favourites list from file 
module.exports.removeFav = (id, user) => {
    return Files.findOne({_id: id}).exec().then((result) => {
        var arrFavs = []
        result.favoritos.forEach(a =>{
            if (a != user){
                arrFavs.push(a)
            }
        })
        result.favoritos = arrFavs
        return Files.findByIdAndUpdate(id, result, {new: true});
    })
}

// add classification and calculate the average
module.exports.classifica = (id, user, classi, media) => {
    return Files.findOne({_id: id}).exec().then((result) => {
        var size = result.estrelas.autores.length
        var oldmedia = result.estrelas.numero
        var added = ((oldmedia * size) + parseInt(classi))
        var media = added / (size + 1)
        result.estrelas.numero = media;
        var pair = user + " - " + classi
        result.estrelas.autores.push(pair);
        return Files.findByIdAndUpdate(id, result, {new: true});
    })
}

/* Changes security */
module.exports.changeprivacy = (id) => {
    return Files.findOne({_id: id}).exec().then((result) => {
        if(result.privacy == 0) {
            p = 1;
        }
        else {
            p = 0;
        }
        return Files.findOneAndUpdate(id, {privacy:p}, {
            new: true,
            upsert: true,
            rawResult: true // Return the raw result from the MongoDB driver
          });
    })
}

// add a new comentary
module.exports.adicionarComentario = (idR, comentario) => {
    return Files.update({
        _id: idR
    }, {
        $push: {
            comentarios: comentario
        }
    }).exec()
}


// remove comentary
module.exports.removerComentario = (idR, idC) => {
    return Files.update({
        _id: idR
    }, {
        $pull: {
            "comentarios": {
                _id: idC
            }
        }
    }).exec();
}


// get stars
module.exports.getEstrelas = (id) => {
    return Files.find({
        _id: id
    }, {
        _id: 0,
        estrelas: 1
    }).exec();
};


// add star
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
    }).exec();
}


// remove star
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
    }).exec();
}