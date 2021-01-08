var express = require('express');
var router = express.Router();
var multer = require('multer')
var upload = multer({dest: 'uploads/'})
var fs = require('fs')
var path = require('path');
var FControl = require('../controllers/files')
var User = require('../controllers/users')
var jwt = require('jsonwebtoken')








/* EDIT de Parágrafos 
router.put('/paras/:id', (req,res)=>{
  FControl.edit(req.params.id, req.body)
    .then(data => res.status(200).jsonp(data))
    .catch(err => res.status(500).jsonp(err));
}) */


module.exports = router;