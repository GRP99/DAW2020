var express = require('express');
var router = express.Router();

const Aluno = require('../controllers/aluno');

router.get(['/alunos', '/'], (req, res) => {
  Aluno.listar()
    .then(dados => res.render('index', {
      lista: dados
    }))
    .catch(e => res.render('error', {
      error: e
    }))
})

router.get('/registar', function (req, res, next) {
  res.render('form', {})
});

router.get(/\/alunos\/[0-9a-zA-Z]*/, (req, res) => {
  var split = req.url.split("/")[2]
  console.log(split)
  Aluno.consultar(split)
    .then(aln => res.render('aluno', {
      aluno: aln
    }))
    .catch(e => res.render('error', {
      error: e
    }))

})

router.post('/alunos', (req, res) => {
  Aluno.inserir(req)
  res.redirect('/')
})

module.exports = router;