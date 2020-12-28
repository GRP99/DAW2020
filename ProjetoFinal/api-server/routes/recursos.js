var express = require('express');
var router = express.Router();

var multer = require('multer')
var upload = multer({
    dest: 'uploads/'
})

var Limpa = require('../public/javascripts/limpa')
var SIP = require('../public/javascripts/unzip_or_zip_SIP')
var Manifesto = require('../public/javascripts/verificaManifesto')


/* GET home page. */
router.get('/', function (req, res, next) {});

router.post('/novorecurso', upload.single('myFile'), function (req, res) {
    if (req.file != null) {
        if (req.file.mimetype == 'application/zip') {
            SIP.unzip(req.file.path)

            if (Manifesto.verifica(__dirname + '/../' + req.file.path + 'dir')) {

                var obj_json = __dirname + '/../' + req.file.path + 'dir' + '/manifesto.json'
                req.body.manifesto = JSON.stringify(require(obj_json))

                //Adicionar Recurso

            } else {
                Limpa.eliminaPasta(__dirname + '/../' + req.file.path + 'dir')
            }
        } else {
            Limpa.eliminaPasta(__dirname + '/../' + req.file.path + 'dir')
        }

    } else{

    }
});

module.exports = router;