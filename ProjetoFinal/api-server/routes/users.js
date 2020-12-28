var express = require('express');
var router = express.Router();
var Utilizadores = require('../controllers/users')
var passport = require('passport')

/* GET users listing. */
router.get('/', passport.authenticate('jwt', {session: false}), function (req, res) {
    Utilizadores.listar().then(dados => {
        res.jsonp(dados);
    }).catch(e => {
        res.status(500).jsonp(e);
    })
});

router.get('/:numero', passport.authenticate('jwt', {session: false}), function (req, res) {
    Utilizadores.consultar(req.params.numero).then(dados => {
        res.jsonp(dados);
    }).catch(e => {
        res.status(500).jsonp(e);
    })
});

router.get('/info/:numero', passport.authenticate('jwt', {session: false}), function (req, res) {
    Utilizadores.consultar(req.params.numero).then(dados => {
        res.jsonp(dados)
    }).catch(e => {
        res.status(500).jsonp(e)
    })
});

router.get('/utilizador', function (req, res) {
    if (req.query.numero && req.query.email) {
        Utilizadores.verificarUtilizador(req.query.numero, req.query.email).then(dados => {
            res.jsonp(dados)
        }).catch(e => {
            res.status(500).jsonp(e)
        })
    }
})

router.post('/', function (req, res) {
    Utilizadores.inserir(req.body).then(dados => {
        res.jsonp(dados)
    }).catch(e => {
        res.status(500).jsonp(e)
    })
})

module.exports = router;
