var express = require('express');
var router = express.Router();
var axios = require('axios')
var autenticaURL  = "http://localhost:3535"
var api_serverURL = "http://localhost:3001"
var token;


key = {key:'2cf7a71be6dc9665aba1f32451e887442cb5a9a208b29e1598611236e60b490'}
axios.post(autenticaURL+'/autenticarApp',key).then(t=>{token=t.data.token}).catch(e=>console.log(e))

/* get user page */
router.get(['/account'], function (req, res, next) {
    var _id = req.user._id

    var requestUser = axios.get(api_serverURL+'/users/' + _id + "?token=" + req.query.token);
    var requestFicheiros = axios.get(api_serverURL+'/files/autor/' + _id + "?token=" + req.query.token);

    axios.all([requestUser, requestFicheiros]).then(axios.spread((...response) => {
        var user = response[0].data;
        var ficheiros = response[1].data;
        var nome = user.name
        var mail = user._id
        var profilepic = user.profilepic
        switch (req.user.level) {
            case 'consumer': renderConsumer(req, res, user)
                break;
            default: res.render('account', {
                    token: req.query.token,
                    lista: ficheiros,
                    user_level: req.user.level,
                    user_id: _id,
                    user_name: nome,
                    user_mail: mail,
                    path: profilepic
                });
                break;
        }
    })).catch(function (erro) {
        console.log("ERROR Página User: " + erro)
    })
});

function renderConsumer(req, res, user) {
    var requestUser = axios.get("http://localhost:3001/users?token=" + token);
    var requestFicheiros = axios.get("http://localhost:3001/files/public?token=" + req.query.token);

    axios.all([requestUser, requestFicheiros]).then(axios.spread((...response) => {
        var users = response[0].data;
        var ficheiros = response[1].data;
        console.log(user)
        var nome = user.name
        var mail = user._id
        var profilepic = user.profilepic
        res.render('consumer', {
            token: req.query.token,
            lista: ficheiros,
            user_id: mail,
            user_name: nome,
            user_mail: mail,
            path: profilepic,
            users: users
        });
    })).catch(function (erro) {
        console.log("ERROR Página Biblioteca: " + erro);
    });
}

router.get('/login', function (req, res) {
    res.render('login', {title: 'Login'});
});

router.get('/signup', function (req, res) {
    res.render('signup', {title: 'Registar'});
});

router.post('/signup', function (req, res) {
    axios.post(autenticaURl+'/registar?token=' + token, req.body).then(dados => {
        res.redirect('/login');
    }).catch(error => {
        console.log(error);
    })
})

router.post('/login', function (req, res) {
    axios.post(autenticaURl+'/login?token=' + token, req.body).then(dados => {
        res.redirect("/homepage?token=" + dados.data.token);
    }).catch(error => {
        console.log(error);
    })
})


router.get('/logout', function (req, res) {
    res.redirect('/login');
})


module.exports = router;
