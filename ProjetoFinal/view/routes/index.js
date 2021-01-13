var express = require('express');
var router = express.Router();
var axios = require('axios')
var jwt = require('jsonwebtoken');




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
