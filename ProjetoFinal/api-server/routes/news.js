var express = require('express');
var router = express.Router();
var multer = require('multer');

var NControl = require('../controllers/news');
var User = require('../controllers/users');


router.get('/', function (req, res) {
    NControl.last5News().then((data) => {
        res.status(200).jsonp(data);
    }).catch((err) => {
        res.status(500).jsonp(err)
    });
})

// post warning
router.post("/", function (req, res, next) {
    if (req.user.level == 'admin') {
        var d = new Date().toISOString().substr(0, 16);
        User.lookUp(req.body.autor).then(dados => {
            var news = {
                date: d,
                autorID: req.body.autor,
                autor: dados.name,
                descricao: req.body.descricao
            }
            NControl.insert(news);
            res.redirect("http://localhost:3002/users/account?token=" + req.query.token);
        });
    } else {
        res.status(401).jsonp({error: 'You do not have permissions for such an operation'});
    }
});


module.exports = router;
