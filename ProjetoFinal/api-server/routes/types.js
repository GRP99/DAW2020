var express = require('express');
var router = express.Router();

var TypesControl = require('../controllers/types');


router.get('/types', function (req, res) {
    TypesControl.list().then((data) => {
        res.status(200).jsonp(data);
    }).catch((err) => {
        res.status(500).jsonp(err)
    });
});

router.get('/:id', function (req, res) {
    TypesControl.lookUp(req.params.id).then(data => {
        if (data != null) {
            res.status(200).jsonp(data);
        } else {
            res.status(500).jsonp({error: 'Tipo inexistente!'});
        }
    }).catch(err => {
        res.status(500).jsonp(err);
    })
});

router.post('/', function (req, res) {
    if (req.user.level != 'consumer') {
        TypesControl.insert(req.body).then(data => {
            if (data != null) {
                res.status(200).jsonp(data);
            } else {
                res.status(500).jsonp({error: 'Tipo inexistente!'});
            }
        }).catch(err => {
            res.status(500).jsonp(err);
        })
    }
    else{
        res.status(401).jsonp({error: 'Não possui permissões para tal operação!'});
    }
    
});

module.exports = router;
