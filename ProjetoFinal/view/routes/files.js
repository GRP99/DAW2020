var createError = require('http-errors');
var express = require("express");
var router = express.Router();
var axios = require("axios");
var jwt = require("jsonwebtoken");
// var popup = require('popups');
const {request} = require("../app");
var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhZG1pbiIsImxldmVsIjoiYWRtaW4iLCJleHBpcmVzSW4iOiIzbSIsImlhdCI6MTYxMDExODM1OX0.omYqB6hz4vSrRjIBEAi0mg6TNVti0OaqXW6n95JljiM';

/*
// a user bookmarks a file
router.get("/addAsFavourite/:id", function (req, res, next) {
    var requestFich = axios.get("http://localhost:3001/files/" + req.params.id + "?token=" + req.query.token);

    axios.all([requestFich]).then(axios.spread((...response) => {
            axios.put("http://localhost:3001/files/addAsFavourite/" + req.params.id + "?token=" + req.query.token).then(function (resp) {
                res.redirect("/files/biblioteca?token=" + req.query.token);
            }).catch(function (error) {
                res.redirect("/files/biblioteca?token=" + req.query.token);
            });
    })).catch(function (erro) {
        console.log("ERROR: Erro ao adicionar aos favoritos: " + erro);
    });
});

// a user removes file from favourites
router.get("/removeFavourite/:id", function (req, res, next) {
    var requestFich = axios.get("http://localhost:3001/files/" + req.params.id + "?token=" + req.query.token);

    axios.all([requestFich]).then(axios.spread((...response) => {
            axios.put("http://localhost:3001/files/removeFavourite/" + req.params.id + "?token=" + req.query.token).then(function (resp) {
                res.redirect("/files/biblioteca?token=" + req.query.token);
            }).catch(function (error) {
                res.redirect("/files/biblioteca?token=" + req.query.token);
            });
        }
    )).catch(function (erro) {
        console.log("ERROR: Erro ao remover dos favoritos: " + erro);
    });
});


// a user rates a file in the Library
router.get("/classificar/:id", function (req, res, next) {
    var requestFich = axios.get("http://localhost:3001/files/" + req.params.id + "?token=" + req.query.token);

    axios.all([requestFich]).then(axios.spread((...response) => {
            var classi = req.query.class
            var size = response[0].data.estrelas.autores.length
            var oldmedia = response[0].data.estrelas.numero
            var added = ((oldmedia * size) + parseInt(classi))
            var media = added / (size + 1)
            axios.put("http://localhost:3001/files/classificar/" + req.params.id + "?token=" + req.query.token + "&media=" + media + "&class=" + req.query.class).then(function (resp) {
                res.redirect("/biblioteca?token=" + req.query.token);
            }).catch(function (error) {
                res.redirect("/biblioteca?token=" + req.query.token);
            });
    })).catch(function (erro) {
        console.log("ERROR: Erro ao classificar: " + erro);
    });
});
*/

// all files library
router.get("/biblioteca", (req, res) => {
    var requestUser = axios.get("http://localhost:3001/users?token=" + token);
    var requestFicheiros = axios.get("http://localhost:3001/files/public?token=" + req.query.token);

    axios.all([requestUser, requestFicheiros]).then(axios.spread((...response) => {
        var user = response[0].data;
        var ficheiros = response[1].data;
        res.render("library", {
            lista: ficheiros,
            users: user,
            token: req.query.token,
            idUser: req.user._id,
            level: req.user.level
        });
    })).catch(e => {
        res.render('errorLibrary', {
            error: e,
            token: req.query.token,
            level: req.user.level
        });
    });
});

// get profile of file
router.get("/:id", (req, res) => {
    var requestUser = axios.get("http://localhost:3001/users?token=" + token);
    var requestFich = axios.get("http://localhost:3001/files/" + req.params.id + "?token=" + req.query.token);

    axios.all([requestFich, requestUser]).then(axios.spread((...response) => {
        var fich = response[0].data;
        var users = response[1].data;
        res.render("file", {
            fich: fich,
            idUser: req.user._id,
            users: users,
            token: req.query.token,
            level: req.user.level
        });
    })).catch(e => {
        res.render('errorFile', {
            error: e,
            token: req.query.token,
            level: req.user.level
        });
    });
});


module.exports = router;
