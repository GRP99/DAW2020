var express = require("express");
var router = express.Router();
var axios = require("axios");

router.get('/types', function (req, res, next) {
    res.render('index', {});
});

router.post('/types', function (req, res, next) {

});


module.exports = router;