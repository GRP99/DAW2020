var mongoose = require('mongoose')


var NewsSchema = new mongoose.Schema({file: String, date: String, autor: String, descricao: String});


module.exports = mongoose.model('news', NewsSchema)
