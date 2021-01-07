/* PARAGRAPH CONTROLLER */
var Files = require('../models/files')
/* Return list of paragraphs */
module.exports.list = () => {
    return Files.find().exec()
}

/* Returns a file record */
module.exports.lookup = id => {
    return Files.findOne({_id: id}).exec()
} 

/* Inserts a new paragraph */
module.exports.insert = (p,path) => {
    console.log(JSON.stringify(p))
    var newFile = new Files(p)
    newFile.filepath = path
    return newFile.save()
}


module.exports.filesbyUser = id => {
    return Files.find({autor: id}).exec()
}


/* Delete a paragraph */
module.exports.remove = id => {
    return Files.deleteOne({_id: id})
} 

/* Changes security */
module.exports.editS = (id) => {
    Files.findOne({_id: id}).exec().then((result) => {
        if(result.privacy == 0) {
            result.privacy = 1;
        }
        else {
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

