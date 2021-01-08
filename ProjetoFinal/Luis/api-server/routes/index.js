var express = require('express');
var router = express.Router();
var multer = require('multer')
var upload = multer({dest: 'uploads/'})
var fs = require('fs')
var path = require('path');
var FControl = require('../controllers/files')
var User = require('../controllers/users')
var jwt = require('jsonwebtoken')

function verificaAutoriadade(autor, usr){
  return autor==usr
}

/* GET all files. */
router.get('/files', function(req, res, next) {
  FControl.list()
    .then(data => res.status(200).jsonp(data))
    .catch(err => res.status(500).jsonp(err));
});

/* GET file by id. */
router.get('/files/:id', function(req, res, next) {
  FControl.lookup(req.params.id)
    .then(data => res.status(200).jsonp(data))
    .catch(err => res.status(500).jsonp(err));
});

router.get('/download/:id_autor/:filename', function(req, res){
  // Se for privado e for autorizado -> verificaAutoridade siga
  // Ou é público.
  res.download(__dirname + '/../public/fileStore/' + req.params.id_autor + "/" + req.params.filename)
})

/* POST de files de um autor */
router.post('/files', upload.single('myFile'), (req, res)=>{

    let quarantinePath = __dirname + '/../' + req.file.path
    let dirpath = __dirname + "/../public/fileStore/" + req.body.autor
    fs.mkdirSync(dirpath, { recursive: true })
    let newPath = dirpath + "/" + req.file.originalname 


    // let dpath = "/../public/fileStore/" + req.body.autor + "/" + req.files[i].originalname 
    var normalizedPath = path.normalize(newPath);
    var correctedPath = normalizedPath.replace(/\\/g, '/');


    /* dá move do ficheiro */ 
    fs.rename(quarantinePath, newPath, function(error){
      if(error){
          console.log("ERROR" + error)
      }
    })

    var d = new Date().toISOString().substr(0, 16)

    var fD = {
      date: d,
      autor: req.body.autor,
      name: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size, 
      privacy: 1,
      descricao: req.body.descricao
    }
    FControl.insert(fD, correctedPath)
    .then(res.redirect('http://localhost:3002/users?token='+req.query.token))
    .catch(err => res.status(500).jsonp(err));
});

/* Foto de perfil de um autor */
router.post('/changeprofile', upload.single('myProfilePic'), (req, res)=>{
  if(req.file.mimetype== 'image/png' || req.file.mimetype == 'image/jpeg') {
    let quarantinePath = __dirname + '/../' + req.file.path
    let dirpath = __dirname + "/../public/images/" + req.body.autor
    fs.mkdirSync(dirpath, { recursive: true })
    let newPath = dirpath + "/" + "profilepic.jpeg"

    // let dpath = "/../public/images/" + req.body.autor + "/" + "profilepic.jpeg"
    /* var normalizedPath = path.normalize(newPath);
    var correctedPath = normalizedPath.replace(/\\/g, '/'); */


    /* dá move do ficheiro */ 
    fs.rename(quarantinePath, newPath, function(error){
      if(error){
          console.log("ERROR" + error)
      }
    })

    FControl.updatePhoto(req.body.autor)
    res.redirect('http://localhost:3002/users/'+req.body.autor)
    
  }
  else {
    console.log("ERRO: Não é uma imagem!")
    res.redirect('http://localhost:3002/users/'+req.body.autor)
  }
});

/* Privacidade - Público ou Privado */
router.put('/files/changeprivacy/:id', function(req, res, next) {
    /* console.log("mudar") */
    id_file = req.params.id
    FControl.editS(id_file)
      .then(data => res.status(200).jsonp(data))
      .catch(err => res.status(500).jsonp(err));
});

/* DELETE de Files */ 
router.delete('/files/:id', (req,res)=>{
  FControl.lookup(req.params.id)
    .then((result) =>{
      /* Apagar ficheiro da pasta */
      let fpath = "public/fileStore/" + result.autor + "/" + result.name
      fs.unlink(fpath, (error) => {
        if (error) {
          console.error(error)
          return
        }
        FControl.remove(req.params.id)
          .then(data => res.status(200).jsonp(data))
          .catch(err => res.status(500).jsonp(err));
      })
    })
})

/* EDIT de Parágrafos 
router.put('/paras/:id', (req,res)=>{
  FControl.edit(req.params.id, req.body)
    .then(data => res.status(200).jsonp(data))
    .catch(err => res.status(500).jsonp(err));
}) */

/* USERS */

/* GET all users */
router.get('/users', function(req, res, next) {
  User.listUsers()
    .then(data => res.status(200).jsonp(data))
    .catch(err => res.status(500).jsonp(err));
});

/* Get one User by id*/
router.get('/users/:id', function(req, res, next) {
  id_autor = req.params.id
  User.lookUp(id_autor)
    .then(data => res.status(200).jsonp(data))
    .catch(err => res.status(500).jsonp(err));
});

/* Todos os ficheiros de um user */
router.get('/files/autor/:id', function(req, res, next) {
  id_autor = req.params.id
  FControl.filesbyUser(id_autor)
    .then(data => res.status(200).jsonp(data))
    .catch(err => res.status(500).jsonp(err));
});

router.post('/login',function(req, res){
  User.lookUp(req.body._id)
   .then(dados=>{
      const user = dados
      if(!user){
        res.status(404).jsonp({error:'Utilizador não encontrado'})
      }
      else{
        if(req.body.password == user.password){
          jwt.sign({_id: user._id,level:"admin", expiresIn: '1d'},'PRI2020',
          function(err,token){
            if(err){
              res.status(400).jsonp({error:'Impossível Login'})
            } 
            else{
              res.status(200).jsonp({token:token})
            }
           
        });
      }
      else{res.status(401).jsonp({error:'Password Errada'})}
    }
  })
}
)

router.post('/registar',function(req,res){
  var user = req.body;
  user.profilepic = 0
  User.insereUser(user)
    .then(dados=>res.status(200).jsonp({msg:'Utilizador Criado com Exito'}))
    .catch(err=>res.status(500).jsonp({error:err}))
  }
)

module.exports = router;