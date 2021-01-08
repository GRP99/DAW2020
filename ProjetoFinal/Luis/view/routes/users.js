var express = require('express');
var router = express.Router();
var axios = require('axios')
var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhZG1pbiIsImxldmVsIjoiYWRtaW4iLCJleHBpcmVzSW4iOiIzbSIsImlhdCI6MTYxMDExODM1OX0.omYqB6hz4vSrRjIBEAi0mg6TNVti0OaqXW6n95JljiM';


/* GET UserHome Page. */
router.get(['/'], function(req, res, next) {

    var _id = req.user._id
    // render invoca o pug
    var requestUser = axios.get("http://localhost:3001/users/" + _id+"?token="+token)
    var requestFicheiros = axios.get("http://localhost:3001/files/autor/" + _id+"?token="+token)
    axios.all([requestUser, requestFicheiros])
      .then(axios.spread((...response) => {
        var user = response[0].data;
        var ficheiros = response[1].data;
        var nome = user.name
        var mail = user._id
        var profilepic = user.profilepic
        res.render('user', {token: req.query.token, lista: ficheiros, user_id: _id, user_name: nome, user_mail: mail, path: profilepic});
      }))
      .catch(function(erro){
        console.log("ERROR Página User: " + erro)
      })
});

router.get('/login', function(req, res) {
  res.render('login-form',{ title: 'Login' });
});

router.get('/registar', function(req, res) {
  res.render('registar-form',{ title: 'Registar' });
});

router.post('/registar', function(req, res){
  axios.post('http://localhost:3001/users/registar?token='+token,req.body)
      .then(dados =>{
        res.redirect('/login')
      })
      .catch(error=>{console.log(error)})
})

router.post('/login',function(req, res){
  axios.post('http://localhost:3001/users/login?token='+token,req.body)
      .then(dados =>{
        res.redirect("/users?token="+dados.data.token)
      })
      .catch(error=>{console.log(error)})
})

module.exports = router;
