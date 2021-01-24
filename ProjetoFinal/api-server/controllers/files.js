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


// find a file with a given name
module.exports.findByName = name => {
    return Files.findOne({name: name}).exec()
}


// delete file
module.exports.remove = id => {
    return Files.deleteOne({_id: id})
}


// add a user to favourites list from file 
module.exports.addFav = (id, user) => {
    Files.findOne({_id: id}).exec().then((result) => {
        result.favoritos.push(user);
        return Files.findByIdAndUpdate(id, result, {new: true});
    })
}

// removes a user to favourites list from file 
module.exports.removeFav = (id, user) => {
    Files.findOne({_id: id}).exec().then((result) => {
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
    Files.findOne({_id: id}).exec().then((result) => {
        result.estrelas.numero = media
        var pair = user + " - " + classi
        result.estrelas.autores = result.estrelas.autores.push(pair);
        return Files.findByIdAndUpdate(id, result, {new: true});
    })
}

/* Changes security */
module.exports.changeprivacy = (id) => {
    Files.findOne({_id: id}).exec().then((result) => {
        if(result.privacy == 0) {
            result.privacy = 1;
        }
        else {
            result.privacy = 0;
        }
        return Files.findByIdAndUpdate(id, result, {new: true})
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