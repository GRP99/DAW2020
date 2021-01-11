/* PARAGRAPH CONTROLLER */
var News = require('../models/news')

/* Return list of news */
module.exports.list = () => {
    return News.find().exec()
}

module.exports.last10News = ()=>{
    return News.find().sort({_id:1}).limit(10).exec()
}

/* Returns a file record */
module.exports.lookup = id => {
    return News.findOne({_id: id}).exec()
} 

/* Inserts a new paragraph */
module.exports.insert = (news) => {
    var newNews = new News(news)
    return newNews.save()
}


