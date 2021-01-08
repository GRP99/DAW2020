var express = require('express');
var router = express.Router();
var multer = require('multer')
var upload = multer({dest: 'uploads/'})
var fs = require('fs')
var path = require('path');
var FControl = require('../controllers/files')
var User = require('../controllers/users')
var jwt = require('jsonwebtoken')

/* USERS */

/* GET all users */
router.get("/", function (req, res, next) {
  User.listUsers()
    .then((data) => res.status(200).jsonp(data))
    .catch((err) => res.status(500).jsonp(err));
});

/* Get one User by id*/
router.get("/:id", function (req, res, next) {
  id_autor = req.params.id;
  User.lookUp(id_autor)
    .then((data) => res.status(200).jsonp(data))
    .catch((err) => res.status(500).jsonp(err));
});

router.post("/login", function (req, res) {
  User.lookUp(req.body._id).then((dados) => {
    const user = dados;
    if (!user) {
      res.status(404).jsonp({ error: "Utilizador não encontrado" });
    } else {
      if (req.body.password == user.password) {
        jwt.sign(
          { _id: user._id, level: "admin", expiresIn: "1d" },
          "PRI2020",
          function (err, token) {
            if (err) {
              res.status(400).jsonp({ error: "Impossível Login" });
            } else {
              res.status(200).jsonp({ token: token });
            }
          }
        );
      } else {
        res.status(401).jsonp({ error: "Password Errada" });
      }
    }
  });
});

router.post("/registar", function (req, res) {
  var user = req.body;
  user.profilepic = 0;
  User.insereUser(user)
    .then((dados) =>
      res.status(200).jsonp({ msg: "Utilizador Criado com Exito" })
    )
    .catch((err) => res.status(500).jsonp({ error: err }));
});

/* Foto de perfil de um autor */
router.post("/changeprofile", upload.single("myProfilePic"), (req, res) => {
  if (req.file.mimetype == "image/png" || req.file.mimetype == "image/jpeg") {
    let quarantinePath = __dirname + "/../" + req.file.path;
    let dirpath = __dirname + "/../public/images/" + req.body.autor;
    fs.mkdirSync(dirpath, { recursive: true });
    let newPath = dirpath + "/" + "profilepic.jpeg";

    // let dpath = "/../public/images/" + req.body.autor + "/" + "profilepic.jpeg"
    /* var normalizedPath = path.normalize(newPath);
    var correctedPath = normalizedPath.replace(/\\/g, '/'); */

    /* dá move do ficheiro */
    fs.rename(quarantinePath, newPath, function (error) {
      if (error) {
        console.log("ERROR" + error);
      }
    });

    FControl.updatePhoto(req.body.autor);
    res.redirect("http://localhost:3002/users/" + req.body.autor);
  } else {
    console.log("ERRO: Não é uma imagem!");
    res.redirect("http://localhost:3002/users/" + req.body.autor);
  }
});


module.exports = router;
