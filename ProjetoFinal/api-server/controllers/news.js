// NEWS CONTROLLER

var News = require('../models/news');

// retorna all the news
module.exports.list = () => {
    return News.find().sort({"date":-1}).exec()
}

// return the last 10 news
module.exports.last10News = () => {
    return News.find().sort({_id: 1}).limit(10).exec()
}

// return only one new
module.exports.lookup = id => {
    return News.findOne({_id: id}).exec()
}

// record new news
module.exports.insert = (news) => {
    var newNews = new News(news)
    return newNews.save()
}
