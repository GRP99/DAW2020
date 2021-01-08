var express = require('express');
var fs = require('fs');
var router = express.Router();

var multer = require('multer')
var upload = multer({dest: 'uploads/'})

var Limpa = require('../public/javascripts/limpa')
var SIP = require('../public/javascripts/unzip_or_zip_SIP')
var Manifesto = require('../public/javascripts/verificaManifesto')


/* GET home page. */
router.get('/', function (req, res, next) {});


router.get('/download/:id_autor/:filename', function (req, res) {
    // Se for privado e for autorizado -> verificaAutoridade siga
    // Ou é público.
    let path = __dirname + '/../public/fileStore/' + req.params.id_autor + "/" + req.params.filename
    let filename = req.params.filename + '.zip'
    Zip.zip(path, filename);
    res.download(path + filename);
})

router.post('/novorecurso', upload.single('myFile'), function (req, res) {
    console.log('É um POST...')
    if (req.file != null) {
        console.log('...nao vazio...')
        console.log(req.file.mimetype)
        if (req.file.mimetype == 'application/x-zip-compressed') {
            console.log('...e zip...')
            SIP.unzip(req.file.path)
            console.log('...afinal ja nao e ...')

            if (Manifesto.verifica(__dirname + '/../' + req.file.path + 'dir')) {
                console.log('...bom manifesto ...')
                var obj_json = __dirname + '/../' + req.file.path + 'dir' + '/manifesto.json'
                req.body.manifesto = JSON.stringify(require(obj_json))

                console.log(req.body.manifesto)

                let quarantinePath = __dirname + '/../' + req.file.path
                let dirpath = __dirname + "/../public/fileStore/" + req.body.autor

                fs.mkdirSync(dirpath, {recursive: true})

                let newPath = dirpath + "/" + req.file.originalname
                var normalizedPath = path.normalize(newPath)
                var correctedPath = normalizedPath.replace(/\\/g, '/')

                fs.rename(quarantinePath, newPath, function (error) {
                    if (error) {
                        console.log("ERROR" + error)
                    }
                })


                // Adicionar Recurso com autorização -> BD
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

                FControl.insert(fD, correctedPath).then(res.redirect('http://localhost:3002/users/' + req.body.autor)).catch(err => res.status(500).jsonp(err));

            } else {
                console.log('time to clean...');
                Limpa.eliminaPasta(__dirname + '/../' + req.file.path + 'dir')
            }
        } else {
            Limpa.eliminaPasta(__dirname + '/../' + req.file.path + 'dir')
        }

    } else {}
});

module.exports = router;
