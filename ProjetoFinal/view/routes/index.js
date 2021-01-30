var express = require('express');
var router = express.Router();
var axios = require('axios');

router.get('/homepage', function (req, res, next) {
    var requestNews = axios.get("http://localhost:3001/news?token=" + req.query.token)
    axios.all([requestNews]).then(axios.spread((...response) => {
        news = response[0].data
        res.render('home', {token: req.query.token,noticias: news})
    }))
});

module.exports = router;