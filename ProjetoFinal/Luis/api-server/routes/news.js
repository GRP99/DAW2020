var express = require('express');
var router = express.Router();
var multer = require('multer')
var upload = multer({dest: 'uploads/'})
var fs = require('fs')
var path = require('path');
var UControl = require('../controllers/news')
var User = require('../controllers/users')

/* USERS */

/* Post warning */
router.post("/", function (req, res, next) {
  if(req.user.level == 'admin'){
    var d = new Date().toISOString().substr(0, 16);
    User.lookUp(req.body.autor)
        .then(dados=>{
          var news = {
            date: d,
            autorID:req.body.autor,
            autor: dados.name,
            descricao: req.body.descricao
          }
          NControl.insert(news)
          res.redirect("http://localhost:3002/users/account?token=" + req.query.token)
        })
  }
  else res.status(401).jsonp({error:'Nao podes'})
});


module.exports = router;
