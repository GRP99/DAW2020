var express = require('express');
var router = express.Router();
var fs = require('fs');
var jwt = require('jsonwebtoken');
var User = require('../controllers/users');

/* Let's give a token to view, so it can make requests! */
router.post('/autenticarApp', function(req, res, next) {
  if(req.body.key!=undefined){
    switch(req.body.key){
      case "2cf7a71be6dc9665aba1f32451e887442cb5a9a208b29e1598611236e60b490" :
        var privateKey = fs.readFileSync(__dirname +  '/../keys/mykey.pem')
        jwt.sign(
          {expiresIn: "1d" },
          privateKey,
          { algorithm:  
            'RS256' 
          }, 
          function (err, token) {
            if (err) {
              res.status(400).jsonp({ error: "Impossível Login" });
            } else {
              res.status(200).jsonp({ token: token });
            }
          }
        );
      break;
      default: res.status(400).jsonp({error:'Chave errada'}); break;
    }
  }
  else res.status(401).jsonp({error:'Chave não enviada'})  
});

// login
router.post("/login", function (req, res) {
  User.lookUp(req.body._id).then((dados) => {
      const user = dados;
      if (! user) {
          res.status(404).jsonp({error: "Utilizador não encontrado!"});
      } else {
          if (req.body.password == user.password) {
              jwt.sign({
                  _id: user._id,
                  level: user.level,
                  expiresIn: "1d"
              }, "PRI2020", function (err, token) {
                  if (err) {
                      res.status(400).jsonp({error: "Não foi possível efectuar o login !"});
                  } else {
                      res.status(200).jsonp({token: token});
                  }
              });
          } else {
              res.status(401).jsonp({error: "Password Errada!"});
          }
      }
  });
});

// register
router.post("/registar", function (req, res) {
  var user = req.body;
  user.profilepic = 0;
  User.insereUser(user).then(() => {
      res.status(200).jsonp({msg: "Utilizador criado com sucesso!"});
  }).catch((err) => {
      res.status(500).jsonp({error: err})
  });
});






module.exports = router;
