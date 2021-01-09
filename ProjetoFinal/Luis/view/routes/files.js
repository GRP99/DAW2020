var express = require("express");
var router = express.Router();
var axios = require("axios");
var jwt = require("jsonwebtoken");

/* Privacidade - Público ou Privado */
router.get("/changeprivacy/:id", function (req, res, next) {
  var requestFich = axios.get(
    "http://localhost:3001/files/" + req.params.id + "?token=" + req.query.token
  );
  /* console.log("mudar") */
  axios
    .all([requestFich])
    .then(
      axios.spread((...response) => {
        axios
          .put(
            "http://localhost:3001/files/changeprivacy/" +
              req.params.id +
              "?token=" +
              req.query.token
          )
          .then(function (resp) {
            res.redirect("/users?token=" + req.query.token);
          })
          .catch(function (error) {
            res.redirect("/users?token=" + req.query.token);
          });
      })
    )
    .catch(function (erro) {
      console.log("ERROR ao mudar privacidade: " + erro);
    });
});

/* Biblioteca all files */
router.get("/biblioteca", (req, res) => {
  var requestUser = axios.get(
    "http://localhost:3001/users?token=" + req.query.token
  );
  var requestFicheiros = axios.get(
    "http://localhost:3001/files/public?token=" + req.query.token
  );
  axios
    .all([requestUser, requestFicheiros])
    .then(
      axios.spread((...response) => {
        var user = response[0].data;
        var ficheiros = response[1].data;
        res.render("biblioteca", { lista: ficheiros, users: user });
      })
    )
    .catch(function (erro) {
      console.log("ERROR Página Biblioteca: " + erro);
    });
});

/* Dar delete de file */
router.get("/delete/:id", (req, res) => {
  var id_file = req.params.id;
  var id_autor = req.params.autor;
  axios
    .delete(
      "http://localhost:3001/files/" + id_file + "?token=" + req.query.token
    )
    .then(function (resp) {
      res.redirect("/users?token=" + req.query.token);
    })
    .catch(function (error) {
      console.log("Erro ao dar delete " + error);
    });
});

module.exports = router;
