var express = require('express');
var router = express.Router();
var axios = require('axios');
var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhZG1pbiIsImxldmVsIjoiYWRtaW4iLCJleHBpcmVzSW4iOiIzbSIsImlhdCI6MTYxMDExODM1OX0.omYqB6hz4vSrRjIBEAi0mg6TNVti0OaqXW6n95JljiM';


router.get('/homepage', function (req, res, next) {
    var requestNews = axios.get("http://localhost:3001/news?token=" + req.query.token)
    var rUser = axios.get("http://localhost:3001/users?token=" + token);
    var requestTopClassi = axios.get("http://localhost:3001/files/topClass?token=" + req.query.token)
    var requestTopFavs = axios.get("http://localhost:3001/files/topFavs?token=" + req.query.token)
    var requestTopAut = axios.get("http://localhost:3001/files/topAut?token=" + req.query.token)
    axios.all([requestNews, requestTopClassi, requestTopFavs, requestTopAut, rUser]).then(axios.spread((...response) => {
        news = response[0].data
        classified = response[1].data
        favourites = response[2].data
        authors = response[3].data
        users = response[4].data
        res.render('home', {token: req.query.token,noticias: news, classified: classified, favourites: favourites, authors: authors, users: users})
    }))
    .catch(function (erro) {
        console.log("ERROR HOME PAGE: " + erro);
    });
});

router.post('/search',function(req,res){
    axios.get('http://localhost:3001/search/'+req.body.type+'/'+req.body.search+'?token='+req.query.token)
                .then(resposta => {res.send(resposta.data)})
                .catch(error => {res.send(error)})
});

module.exports = router;