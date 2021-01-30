var express = require('express');
var router = express.Router();

var User = require('../controllers/users');
var File = require('../controllers/files');


router.get('/users/:user', function (req, res) {
    User.search(req.params.user)
    .then((data) => {
        console.log(req.params.user)
        console.log(data)
        res.status(200).jsonp(data);
    }).catch((err) => {
        res.status(500).jsonp(err)
    });
});

router.get('/files/:file', function (req, res) {
    File.search(req.params.file).then((data) => {
        res.status(200).jsonp(data);
    }).catch((err) => {
        res.status(500).jsonp(err)
    });
});

module.exports = router;