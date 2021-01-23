var express = require("express");
var router = express.Router();
var axios = require("axios");
var jwt = require("jsonwebtoken");
// var popup = require('popups');
const {request} = require("../app");
var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhZG1pbiIsImxldmVsIjoiYWRtaW4iLCJleHBpcmVzSW4iOiIzbSIsImlhdCI6MTYxMDExODM1OX0.omYqB6hz4vSrRjIBEAi0mg6TNVti0OaqXW6n95JljiM';


// changeprivacy
router.get("/changeprivacy/:id", function (req, res, next) {
    var requestFich = axios.get("http://localhost:3001/files/" + req.params.id + "?token=" + req.query.token);

    axios.all([requestFich]).then(axios.spread((...response) => {
        axios.put("http://localhost:3001/files/changeprivacy/" + req.params.id + "?token=" + req.query.token).then(function (resp) {
            res.redirect("/users/account?token=" + req.query.token);
        }).catch(function (error) {
            res.redirect("/users/account?token=" + req.query.token);
        });
    })).catch(function (erro) {
        console.log("ERROR ao mudar privacidade: " + erro);
    });
});

// a user bookmarks a file
router.get("/addAsFavourite/:id", function (req, res, next) {
    var requestFich = axios.get("http://localhost:3001/files/" + req.params.id + "?token=" + req.query.token);

    axios.all([requestFich]).then(axios.spread((...response) => {
        if (requestFich.data.favourites.includes(req.user._id)) {
            alert("ERRO: Este ficheiro já se encontra nos seus favoritos!");
        } else {
            axios.put("http://localhost:3001/files/addAsFavourite/" + req.params.id + "?token=" + req.query.token).then(function (resp) {
                res.redirect("/biblioteca?token=" + req.query.token);
            }).catch(function (error) {
                res.redirect("/biblioteca?token=" + req.query.token);
            });
        }
    })).catch(function (erro) {
        console.log("ERROR: Erro ao adicioanr aos favoritos: " + erro);
    });
});


// a user sorts a file in the Library
router.get("/classificar/:id", function (req, res, next) {
    var requestFich = axios.get("http://localhost:3001/files/" + req.params.id + "?token=" + req.query.token);

    axios.all([requestFich]).then(axios.spread((...response) => {
        if (requestFich.data.estrelas.autores.includes(req.user._id)) {
            alert('ERRO: Já classificou este ficheiro!')
        } else {
            axios.put("http://localhost:3001/files/classificar/" + req.params.id + "?token=" + req.query.token + "&class=" + req.query.class).then(function (resp) {
                res.redirect("/biblioteca?token=" + req.query.token);
            }).catch(function (error) {
                res.redirect("/biblioteca?token=" + req.query.token);
            });
        }
    })).catch(function (erro) {
        console.log("ERROR: Erro ao classificar: " + erro);
    });
});


// all files library
router.get("/biblioteca", (req, res) => {
    var requestUser = axios.get("http://localhost:3001/users?token=" + token);
    var requestFicheiros = axios.get("http://localhost:3001/files/public?token=" + req.query.token);

    axios.all([requestUser, requestFicheiros]).then(axios.spread((...response) => {
        var user = response[0].data;
        var ficheiros = response[1].data;
        console.log(ficheiros)
        res.render("library", {
            lista: ficheiros,
            users: user,
            token: req.query.token
        });
    })).catch(function (erro) {
        console.log("ERROR Página Biblioteca: " + erro);
    });
});

// delete of a file
router.get("/delete/:id", (req, res) => {
    var id_file = req.params.id;
    var id_autor = req.params.autor;
    axios.delete("http://localhost:3001/files/" + id_file + "?token=" + req.query.token).then(function (resp) {
        res.redirect("/users/account?token=" + req.query.token);
    }).catch(function (error) {
        console.log("Erro ao dar delete " + error);
    });
});

module.exports = router;
