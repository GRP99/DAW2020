var express = require("express");
var router = express.Router();
var multer = require("multer");
var upload = multer({dest: "uploads/"});
var fs = require("fs");
var path = require("path");

var FControl = require("../controllers/files");
var NControl = require("../controllers/news");
var User = require("../controllers/users");

var Limpa = require('../public/javascripts/limpa')
var SIP = require('../public/javascripts/unzip_or_zip_SIP')
var Manifesto = require('../public/javascripts/verificaManifesto')

/*
function verificaAutoriadade(autor, usr) {
    return autor == usr;
}
*/

// get all files (works)
router.get("/", function (req, res, next) {
    if (req.user.level == "admin") {
        FControl.list().then((data) => {
            res.status(200).jsonp(data);
        }).catch((err) => {
            res.status(500).jsonp(err);
        });
    } else {
        res.status(401);
    }
});


// get all public files (works)
router.get("/public", function (req, res, next) {
    FControl.publicFiles().then((data) => {
        res.status(200).jsonp(data);
    }).catch((err) => {
        res.status(500).jsonp(err);
    });
});


// get files from user (works)
router.get("/fromUser", function (req, res) {
    var userID = req.user.id;
    FControl.filesbyUser(userID).then((data) => {
        res.status(200).jsonp(data);
    }).catch((err) => {
        res.status(500).jsonp(err);
    });
});


// get file by id (works)
router.get("/:id", function (req, res, next) {
    FControl.lookup(req.params.id).then((data) => {
        if (data.autor == req.user._id || req.user.level == "admin") {
            res.status(200).jsonp(data);
        } else {
            res.status(401);
        }
    }).catch((err) => {
        res.status(500).jsonp(err);
    });
});

// privacy (works with minor bug)
router.put("/classificar/:id", function (req, res, next) { // console.log("mudar")
    id_user = req.user._id
    id_file = req.params.id
    classificacao = req.query.class

    FControl.classifica(id_file, id_user, classificacao).then((data) => {
        res.status(200).jsonp(data);
    }).catch((err) => {
        res.status(500).jsonp(err);
    });
});


// add userid to favourites of a file
router.put("/addAsFavourite/:id", function (req, res, next) { // console.log("mudar")
    id_user = req.user._id
    id_file = req.params.id;

    FControl.addFav(id_file, id_user).then((data) => {
        res.status(200).jsonp(data);
    }).catch((err) => {
        res.status(500).jsonp(err);
    });
});


// privacy (works with minor bug)
router.put("/changeprivacy/:id", function (req, res, next) { // console.log("mudar")
    FControl.lookup(req.params.id).then((result) => {
        if (req.user.level == "admin" || req.user._id == result.autor) {
            FControl.editS(id_file).then((data) => {
                res.status(200).jsonp(data);
            }).catch((err) => {
                res.status(500).jsonp(err);
            });
        } else {
            res.status(401);
        }
    });
});


// download
router.get("/download/:id_autor/:id", function (req, res) {
    FControl.lookup(req.params.id).then((file) => {
        if (req.user.level == "admin" || req.user._id == file.autor || file.privacy == 0) {
            let path = __dirname + '/../public/fileStore/' + req.params.id_autor + "/" + file.name
            SIP.zip(path, file.name);
            res.download(path + file.name);
        } else {
            res.status(401);
        }

    });
});


// upload file (works)
router.post("/", upload.single("myFile"), (req, res) => {
    if (req.user.level != "consumer") { /*
        let quarantinePath = __dirname + "/../" + req.file.path;
        let dirpath = __dirname + "/../public/fileStore/" + req.body.autor;
        fs.mkdirSync(dirpath, {recursive: true});
        let newPath = dirpath + "/" + req.file.originalname;

        // let dpath = "/../public/fileStore/" + req.body.autor + "/" + req.files[i].originalname
        var normalizedPath = path.normalize(newPath);
        var correctedPath = normalizedPath.replace(/\\/g, "/");

        /* dá move do ficheiro 
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
            privacy: req.body.privacy,
            descricao: req.body.descricao
        };
        */

        if (req.file != null) {
            if (req.file.mimetype == 'application/x-zip-compressed') {
                SIP.unzip(req.file.path);
                if (Manifesto.verifica(__dirname + '/../' + req.file.path + 'sip')) {
                    var obj_json = __dirname + '/../' + req.file.path + 'sip' + '/manifesto.json'
                    req.body.manifesto = JSON.stringify(require(obj_json));
                    let quarantinePath = __dirname + '/../' + req.file.path + 'sip'
                    let dirpath = __dirname + "/../public/fileStore/" + req.body.autor

                    fs.mkdirSync(dirpath, {recursive: true})

                    let newPath = dirpath + "/" + req.file.originalname
                    var normalizedPath = path.normalize(newPath)
                    var correctedPath = normalizedPath.replace(/\\/g, '/')

                    fs.rename(quarantinePath, newPath, function (error) {
                        if (error) {
                            console.log("ERROR" + error)
                        }
                    })

                    var d = new Date().toISOString().substr(0, 16);

                    var fD = {
                        date: d,
                        autor: req.body.autor,
                        name: req.file.originalname,
                        mimetype: req.file.mimetype,
                        size: req.file.size,
                        privacy: 1,
                        descricao: req.body.descricao
                    }

                    if (req.body.privacy == 0) {
                        User.lookUp(req.body.autor).then(dados => {
                            var news = {
                                date: d,
                                autorID: req.body.autor,
                                autor: dados.name,
                                descricao: 'O ' + dados.name + ' adicionou o ficheiro ' + req.file.originalname
                            }
                            NControl.insert(news)
                        })

                    }

                    FControl.insert(fD, correctedPath).then(() => {
                        res.redirect("http://localhost:3002/users/account?token=" + req.query.token)
                    }).catch(err => {
                        res.status(500).jsonp(err);
                    });

                } else {
                    Limpa.eliminaPasta(__dirname + '/../' + req.file.path + 'sip');
                    res.redirect("http://localhost:3002/users/account?token=" + req.query.token)
                }
            }


        } else {
            res.status(500).jsonp(err);
        }
    }
});


// delete file (works)
router.delete("/:id", (req, res) => {
    FControl.lookup(req.params.id).then((result) => {
        if (req.user.level == "admin" || req.user._id == result.autor) { // apagar ficheiro da pasta
            let fpath = "public/fileStore/" + result.autor + "/" + result.name;
            fs.unlink(fpath, (error) => {
                if (error) {
                    console.error(error);
                    return;
                }
                FControl.remove(req.params.id).then((data) => res.status(200).jsonp(data)).catch((err) => res.status(500).jsonp(err));
            });
        } else {
            res.status(401)
        }
    });
});


// all the files from user TO SEE UTILITY
router.get("/autor/:id", function (req, res, next) {
    id_autor = req.params.id;
    FControl.filesbyUser(id_autor).then((data) => {
        res.status(200).jsonp(data);
    }).catch((err) => {
        res.status(500).jsonp(err);
    });
});


// add comment
router.post('/:id/adicionarComentario', function (req, res) {
    FControl.adicionarComentario(req.params.id, req.body).then(dados => {
        res.jsonp(dados)
    }).catch(erro => {
        res.status(500).jsonp(erro)
    })
});


// remove comment
router.post('/:id/removerComentario', function (req, res) {
    var idC = req.query.comentario
    FControl.removerComentario(req.params.id, idC).then(dados => {
        res.jsonp(dados)
    }).catch(e => {
        res.status(500).jsonp(e)
    })
});


// classify
router.post('/:id/estrelas/:idU', function (req, res) {
    var flag;
    FControl.getEstrelas(req.params.id).then(estrelas => {
        flag = estrelas.toString().includes(req.params.idU);
        if (! flag) {
            FControl.incrementarEstrelas(req.params.id, req.params.idU).then(dados => {
                res.jsonp(dados)
            }).catch(e => {
                res.status(500).jsonp(e)
            })
        } else {
            FControl.decrementarEstrelas(req.params.id, req.params.idU).then(dados => {
                res.jsonp(dados)
            }).catch(e => {
                res.status(500).jsonp(e)
            })
        }
    }).catch(e => {
        res.status(500).jsonp(e)
    })
});

module.exports = router;