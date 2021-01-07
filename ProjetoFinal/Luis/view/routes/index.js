var express = require('express');
var router = express.Router();
var axios = require('axios')
var jwt = require('jsonwebtoken');

/* GET Home Page. */
router.get(['/users'], function(req, res, next) {

  var _id = req.user._id
  // render invoca o pug
  var requestUser = axios.get("http://localhost:3001/users/" + _id)
  var requestFicheiros = axios.get("http://localhost:3001/files/autor/" + _id)
  axios.all([requestUser, requestFicheiros])
    .then(axios.spread((...response) => {
      var user = response[0].data;
      var ficheiros = response[1].data;
      var nome = user.name
      var mail = user._id
      var profilepic = user.profilepic
      res.render('user', {lista: ficheiros, user_id: _id, user_name: nome, user_mail: mail, path: profilepic});
    }))
    .catch(function(erro){
      console.log("ERROR Página User: " + erro)
    })
});

/* Privacidade - Público ou Privado */
router.get('/files/changeprivacy/:id', function(req, res, next) {
  var requestFich = axios.get("http://localhost:3001/files/" + req.params.id)
  /* console.log("mudar") */
  axios.all([requestFich])
    .then(axios.spread((...response) => {
      var user = response[0].data.autor;
      console.log(user)
      axios.put('http://localhost:3001/files/changeprivacy/'+req.params.id)
        .then(function (resp){
          res.redirect('/users/' + user);
        })
        .catch(function(error){
          res.redirect('/users/' + user);
        })
    }))
    .catch(function(erro){
      console.log("ERROR ao mudar privacidade: " + erro)
    })
});

/* Biblioteca all files */
router.get('/biblioteca', (req, res)=> {
  var requestUser = axios.get("http://localhost:3001/users/")
  var requestFicheiros = axios.get("http://localhost:3001/files")
  axios.all([requestUser, requestFicheiros])
    .then(axios.spread((...response) => {
      var user = response[0].data;
      var ficheiros = response[1].data;
      res.render('biblioteca', {lista: ficheiros, users: user});
    }))
    .catch(function(erro){
      console.log("ERROR Página Biblioteca: " + erro)
    })
});

/* Dar delete de file */
router.get('/files/delete/:autor/:id', (req, res)=> {
  console.log("ok")
  var id_file = req.params.id
  var id_autor = req.params.autor
  axios.delete('http://localhost:3001/files/'+id_file)
  .then(function (resp){
      res.redirect('/users/' + id_autor);
  })
  .catch(function(error){
      console.log("Erro ao dar delete " + error)
  })
});




router.get('/login', function(req, res) {
  res.render('login-form',{ title: 'Login' });
});

router.get('/registar', function(req, res) {
  res.render('registar-form',{ title: 'Registar' });
});

router.post('/registar', function(req, res){
  axios.post('http://localhost:3001/registar',req.body)
      .then(dados =>{
        res.redirect('/login')
      })
      .catch(error=>{console.log(error)})
})

router.post('/login',function(req, res){
  axios.post('http://localhost:3001/login',req.body)
      .then(dados =>{
        res.redirect("/users?token="+dados.data.token)
      })
      .catch(error=>{console.log(error)})
}
)


/* DELETE e PUT ROUTES
router.delete(/\/alunos\/:[0-9a-zA-Z]/, (req,res)=>{
  var split = req.url.split(":")[1]
  Aluno.remove(split)
  res.redirect('/alunos')
})

router.put(/\/alunos\/:[0-9a-zA-Z]/, (req,res)=>{
  var split = req.url.split(":")[1]
  Aluno.editar(split)
  res.redirect('/alunos')
}) */

module.exports = router;
