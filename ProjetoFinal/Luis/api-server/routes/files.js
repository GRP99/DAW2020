var express = require("express");
var router = express.Router();
var multer = require("multer");
var upload = multer({ dest: "uploads/" });
var fs = require("fs");
var path = require("path");
var FControl = require("../controllers/files");
var User = require("../controllers/users");
var jwt = require("jsonwebtoken");

function verificaAutoriadade(autor, usr) {
  return autor == usr;
}

/* GET all files. Works */
router.get("/", function (req, res, next) {
  if (req.user.level == "admin") {
    FControl.list()
      .then((data) => res.status(200).jsonp(data))
      .catch((err) => res.status(500).jsonp(err));
  } else {
    res.status(401);
  }
});

/* Get All Public Files. Works */
router.get("/public", function (req, res, next) {
  FControl.publicFiles()
    .then((data) => res.status(200).jsonp(data))
    .catch((err) => res.status(500).jsonp(err));
});

/*Get Files from User. Works*/
router.get("/fromUser", function (req, res) {
  var userID = req.user.id;
  FControl.filesbyUser(userID)
    .then((data) => res.status(200).jsonp(data))
    .catch((err) => res.status(500).jsonp(err));
});

/* GET file by id. Work.*/
router.get("/:id", function (req, res, next) {
  FControl.lookup(req.params.id)
    .then((data) => {
      if (data.autor == req.user._id || req.user.level == "admin") {
        res.status(200).jsonp(data);
      } else res.status(401);
    })
    .catch((err) => res.status(500).jsonp(err));
});

/* Privacidade - Público ou Privado. Works with minor bug */
router.put("/changeprivacy/:id", function (req, res, next) {
  /* console.log("mudar") */
  id_file = req.params.id;
  FControl.editS(id_file)
    .then((data) => res.status(200).jsonp(data))
    .catch((err) => res.status(500).jsonp(err));
});

/*Make Download. Works*/
router.get("/download/:id_autor/:id", function (req, res) {
  FControl.lookup(req.params.id).then((file) => {
    if (
      req.user.level == "admin" ||
      req.user._id == file.autor ||
      file.privacy == 0
    ) {
      var pa = __dirname + "/../public/fileStore/" + req.params.id_autor + "/" + file.name
      console.log(pa)
      res.download(
        __dirname +
          "/../public/fileStore/" +
          req.params.id_autor +
          "/" +
          file.name
      );
    } else res.status(401);
  });
});

/* POST de files de um autor. Works*/
router.post("/", upload.single("myFile"), (req, res) => {
  if (req.user.level != "consumer") {
    let quarantinePath = __dirname + "/../" + req.file.path;
    let dirpath = __dirname + "/../public/fileStore/" + req.body.autor;
    fs.mkdirSync(dirpath, { recursive: true });
    let newPath = dirpath + "/" + req.file.originalname;

    // let dpath = "/../public/fileStore/" + req.body.autor + "/" + req.files[i].originalname
    var normalizedPath = path.normalize(newPath);
    var correctedPath = normalizedPath.replace(/\\/g, "/");

    /* dá move do ficheiro */
    fs.rename(quarantinePath, newPath, function (error) {
      if (error) {
        console.log("ERROR" + error);
      }
    });

    var d = new Date().toISOString().substr(0, 16);

    var fD = {
      date: d,
      autor: req.body.autor,
      name: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      privacy: 1,
      descricao: req.body.descricao,
    };
    FControl.insert(fD, correctedPath)
      .then(
        res.redirect("http://localhost:3002/users?token=" + req.query.token)
      )
      .catch((err) => res.status(500).jsonp(err));
  }
});

/* DELETE de Files. Works*/
router.delete("/:id", (req, res) => {
  FControl.lookup(req.params.id).then((result) => {
    if (req.user.level == "admin" || req.user._id == result.autor) {
      /* Apagar ficheiro da pasta */
      let fpath = "public/fileStore/" + result.autor + "/" + result.name;
      fs.unlink(fpath, (error) => {
        if (error) {
          console.error(error);
          return;
        }
        FControl.remove(req.params.id)
          .then((data) => res.status(200).jsonp(data))
          .catch((err) => res.status(500).jsonp(err));
      });
    }
    else{res.status(401)}
  });
});

/* Todos os ficheiros de um user TO SEE UTILITY */
router.get("/autor/:id", function (req, res, next) {
  id_autor = req.params.id;
  FControl.filesbyUser(id_autor)
    .then((data) => res.status(200).jsonp(data))
    .catch((err) => res.status(500).jsonp(err));
});

module.exports = router;
