var express = require('express');
var router = express.Router();
var axios = require('axios')
var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhZG1pbiIsImxldmVsIjoiYWRtaW4iLCJleHBpcmVzSW4iOiIzbSIsImlhdCI6MTYxMDExODM1OX0.omYqB6hz4vSrRjIBEAi0mg6TNVti0OaqXW6n95JljiM';


/* GET UserHome Page. */


router.get(['/account'], function(req, res, next) {

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
      switch(req.user.level){
        case 'consumer':
          renderConsumer(req,res,user)
          break;
        default:   
        res.render('account', {token: req.query.token, lista: ficheiros,user_level:req.user.level ,user_id: _id, user_name: nome, user_mail: mail, path: profilepic});
        break;
      }
      
    }))
    .catch(function(erro){
      console.log("ERROR Página User: " + erro)
    })
});

function renderConsumer(req,res,user){
  var requestUser = axios.get(
    "http://localhost:3001/users?token=" + token
  );
  var requestFicheiros = axios.get(
    "http://localhost:3001/files/public?token=" + req.query.token
  );
  axios
    .all([requestUser, requestFicheiros])
    .then(
      axios.spread((...response) => {
        var users = response[0].data;
        var ficheiros = response[1].data;
        console.log(user)
        var nome = user.name
        var mail = user._id
        var profilepic = user.profilepic
        res.render('consumer', {token: req.query.token, lista: ficheiros, user_id: mail, user_name: nome, user_mail: mail, path: profilepic,users:users});
      })
    )
    .catch(function (erro) {
      console.log("ERROR Página Biblioteca: " + erro);
    });
}


router.get('/login', function(req, res) {
  res.render('login',{ title: 'Login' });
});

router.get('/signup', function(req, res) {
  res.render('signup',{ title: 'Registar' });
});

router.post('/signup', function(req, res){
  axios.post('http://localhost:3001/users/registar?token='+token,req.body)
      .then(dados =>{
        res.redirect('/login')
      })
      .catch(error=>{console.log(error)})
})

router.post('/login',function(req, res){
  axios.post('http://localhost:3001/users/login?token='+token,req.body)
      .then(dados =>{
        res.redirect("/homepage?token="+dados.data.token)
      })
      .catch(error=>{console.log(error)})
})

router.get('/logout',function(req,res){
  res.redirect('/login')
})


module.exports = router;
