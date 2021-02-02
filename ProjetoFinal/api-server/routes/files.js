var express = require("express");
var router = express.Router();
var multer = require("multer");
var upload = multer({dest: "uploads/"});
var fs = require("fs");
var path = require("path");
var rimraf = require("rimraf");

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

// This route gets all files, but u need to be admin to have access to all files
// First we see if request is sent by a admin, if not we responde with error 401, if it is proceed.
router.get("/", function (req, res, next) {
    if (req.user.level == "admin") {
        FControl.list().then((data) => {
            res.status(200).jsonp(data);
        }).catch((err) => {
            res.status(500).jsonp(err);
        });
    } else {
        res.status(401).jsonp({error: 'Only Admins are allowed!'});
    }
});

// This route gets all public files. If they are public everyone has access to them xD
router.get("/public", function (req, res, next) {
    FControl.publicFiles().then((data) => {
        res.status(200).jsonp(data);
    }).catch((err) => {
        res.status(500).jsonp(err)
    });
});

// This route gets all files from a user, only the user or the admin can get them.
router.get("/fromUser", function (req, res) {
    var userID = req.user.id;
    FControl.filesbyUser(userID).then((data) => {
        res.status(200).jsonp(data)
    }).catch((err) => {
        res.status(500).jsonp(err)
    });
});

router.get("/resourceTypes", function (req, res) {
    FControl.getResourceTypes().then((data) => {
        res.status(200).jsonp(data)
    }).catch((err) => {
        res.status(500).jsonp(err)
    });
});

/******** HOME - TOP 3  ********/

// Top 3 classified files
router.get("/topClass", function (req, res) {
    FControl.topclassificados().then((data) => {
        res.status(200).jsonp(data);
    }).catch((err) => {
        res.status(500).jsonp(err);
    });
});

// Top 3 Favourites Files
router.get("/topFavs", function (req, res) {
    FControl.topfavoritos().then((data) => {
        res.status(200).jsonp(data);
    }).catch((err) => {
        res.status(500).jsonp(err);
    });
});

// Top 3 Authors by number of Uploads
router.get("/topAut", function (req, res) {
    FControl.topautores().then((data) => {
        res.status(200).jsonp(data);
    }).catch((err) => {
        res.status(500).jsonp(err);
    });
});

// This route gets an file by it's ID, it's only available if it is public, or it's the autor or the admin
router.get("/:id", function (req, res, next) {
    FControl.lookup(req.params.id).then((data) => {
        if (data.autor == req.user._id || req.user.level == "admin" || data.privacy == 1) {
            res.status(200).jsonp(data);
        } else {
            res.status(401).jsonp({error: 'You are not allowed to view this file!'});
        }
    }).catch((err) => res.status(500).jsonp(err));
});

// privacy (works with minor bug)
router.put("/classificar/:id", function (req, res, next) { // console.log("mudar")
    id_user = req.user._id
    id_file = req.params.id
    FControl.classifica(id_file, id_user, req.query.class).then((data) => {
        res.status(200).jsonp({classificacao: data.numero});
    }).catch((err) => {
        res.status(200).jsonp(err);
    });
});


// add userid to favourites of a file
router.put("/addAsFavourite/:id", (req, res) => { // console.log("mudar")
    id_user = req.user._id
    id_file = req.params.id;
    FControl.addFav(id_file, id_user).then((data) => {
        res.status(200).jsonp(data)
    }).catch((err) => {
        res.status(500).jsonp(err)
    });
});

// remove userid to favourites of a file
router.put("/removeFavourite/:id", function (req, res, next) { // console.log("mudar")
    id_user = req.user._id
    id_file = req.params.id;
    FControl.removeFav(id_file, id_user).then((data) => {
        res.status(200).jsonp(data)
    }).catch((err) => {
        res.status(500).jsonp(err)
    });
});

// privacy (works with minor bug)
router.put("/changeprivacy/:id", (req, res) => { // console.log("mudar")
    FControl.lookup(req.params.id).then((result) => {
        if (req.user.level == "admin" || req.user._id == result.autor) {
            FControl.changeprivacy(req.params.id).then((data) => {
                res.status(200).jsonp(data);
            }).catch((err) => {
                res.status(500).jsonp(err);
            });
        } else {
            res.status(401).jsonp({error: 'You are not allowed to do this!'});
        }
    });
});

// download
router.get("/download/:id_autor/:id", function (req, res) {
    FControl.lookup(req.params.id).then((file) => {
        if (req.user.level == "admin" || req.user._id == file.autor || file.privacy == 0) {
            let path = __dirname + '/../public/fileStore/' + req.params.id_autor + "/uploads/" + file.name
            SIP.zip(path);
            let quarantinePath = path + "_dip"
            let dirpath = __dirname + "/../public/fileStore/" + req.params.id_autor + "/downloads"
            fs.mkdirSync(dirpath, {recursive: true});
            let newPath = dirpath + "/" + file.name
            fs.rename(quarantinePath, newPath, function (error) {
                if (error) {
                    res.status(500).jsonp({error: "Error in the downloads folder"});
                }
            })
            res.download(newPath);
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
                if (Manifesto.verifica(__dirname + '/../' + req.file.path + '_sip')) {
                    var obj_json = __dirname + '/../' + req.file.path + '_sip' + '/manifesto.json'
                    req.body.manifesto = JSON.stringify(require(obj_json));
                    let quarantinePath = __dirname + '/../' + req.file.path + '_sip'
                    let dirpath = __dirname + "/../public/fileStore/" + req.body.autor + "/uploads/"

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
                        title: req.body.title,
                        subtitle: req.body.subtitle,
                        resourceType: req.body.resourceType,
                        creationDate: req.body.date,
                        registrationDate: d,
                        autor: req.body.autor,
                        name: req.file.originalname,
                        mimetype: req.file.mimetype,
                        size: req.file.size,
                        privacy: req.body.privacy,
                        descricao: req.body.descricao
                    }

                    FControl.insert(fD, correctedPath).then((result) => {
                        if (req.body.privacy == 0) {
                            User.lookUp(req.body.autor).then(dados => {
                                var news = {
                                    file: result._id,
                                    date: d,
                                    autorID: req.body.autor,
                                    autor: dados.name,
                                    descricao: 'New submission: Producer' + dados.name + ' has just released an ' + req.body.resourceType + ' entitled \"' + req.body.title + '\".'
                                }
                                NControl.insert(news)
                            })
                        }
                        res.redirect("http://localhost:3002/users/account?token=" + req.query.token)
                    }).catch(err => {
                        res.status(500).jsonp({error: "ERROR: Uploads folder error."});
                    });

                } else {
                    Limpa.eliminaPasta(__dirname + '/../' + req.file.path + 'sip');
                    res.redirect("http://localhost:3002/users/account?token=" + req.query.token)
                }
            } else {
                Limpa.eliminaPasta(__dirname + '/../' + req.file.path);
                res.redirect("http://localhost:3002/users/account?token=" + req.query.token)
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
            let fpath = "public/fileStore/" + result.autor + "/uploads/" + result.name;
            /* fs.unlink(fpath, (error) => {
                if (error) {
                    console.error(error);
                    return;
                }
                FControl.remove(req.params.id).then((data) => res.status(200).jsonp(data)).catch((err) => res.status(500).jsonp(err));
            }); */
            // Dá delete à pasta
            rimraf(fpath, function () {
                console.log("Filepath deleted.");
            });
            FControl.remove(req.params.id).then((data) => {
                res.status(200).jsonp(data)
            }).catch((err) => {
                res.status(500).jsonp(err)
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
router.post('/:id/comentarios', function (req, res) {
    FControl.adicionarComentario(req.params.id, req.body).then(dados => {
        res.redirect("http://localhost:3002/files/" + req.params.id + "?token=" + req.query.token)
    }).catch(erro => {
        res.redirect("http://localhost:3002/files/" + req.params.id + "?token=" + req.query.token)
    })
});


// remove comment
router.delete('/:id/comentarios', function (req, res) {
    var temp = ""
    FControl.lookup(req.params.id).then((result) => {
        result.comentarios.forEach(element => {
            if(element._id == req.query.comentario) {
                temp = element.autor
            }
        });
        if (req.user.level == "admin" || req.user._id == result.autor || req.user._id == temp) {
            FControl.removerComentario(req.params.id, req.query.comentario).then(dados => {
                res.jsonp(dados)
            }).catch(e => {
                res.status(500).jsonp(e)
            })
        } else {
                    res.status(401).jsonp({error: 'You are not allowed to do this!'});
        }
    })
});

/*
// classify
router.post('/:id/estrelas/:idU', function (req, res) {
    var flag;
    FControl.getEstrelas(req.params.id).then(estrelas => {
        flag = estrelas.toString().includes(req.params.idU);
        if (! flag) {
            FControl.incrementarEstrelas(req.params.id, req.params.idU).then(dados => {
                res.jsonp(dados)
            }).catch(e => {
                res.status(500).jsonp(console.log(e))
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
}); */

module.exports = router;
