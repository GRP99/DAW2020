var express = require('express');
var router = express.Router();
var Noticias = require('../controllers/noticias');
const {route} = require('./users');

/* GET noticias listing. */
router.get('/', function (req, res) {
    Noticias.listar().then(dados => {
        res.jsonp(dados);
    }).catch(e => {
        res.status(500).jsonp(e);
    })
});

router.get('/:id', function (req, res) {
    Noticias.consultar(req.params.id).then(dados => {
        res.jsonp(dados)
    }).catch(e => {
        res.status(500).jsonp(e)
    })
});


router.post('/', function (req, res) {
    Noticias.inserir(req.body).then(dados => {
        res.jsonp(dados)
    }).catch(e => {
        res.status(500).jsonp(e)
    })
})

router.delete('/:id', function (req, res) {
    Noticias.remover(req.params.id).then(dados => {
        res.jsonp(dados)
    }).catch(e => {
        res.status(500).jsonp(e)
    })
})
