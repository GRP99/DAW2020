var express = require('express');
var router = express.Router();
var axios = require('axios')
var jwt = require('jsonwebtoken');


router.get('/homepage', function(req, res, next) {
  var requestNews = axios.get("http://localhost:3001/news?token="+req.query.token)
  axios.all([requestNews])
    .then(axios.spread((...response) => {
      news = response[0].data
      console.log(news)
      res.render('home',{token:req.query.token,noticias:news})
    }))
    
  
});

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
