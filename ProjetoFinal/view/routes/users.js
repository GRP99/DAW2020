var express = require('express');
var router = express.Router();
var axios = require('axios')
var autenticaURL = "http://localhost:3535"
var api_serverURL = "http://localhost:3001"
var token;
var token2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhZG1pbiIsImxldmVsIjoiYWRtaW4iLCJleHBpcmVzSW4iOiIzbSIsImlhdCI6MTYxMDExODM1OX0.omYqB6hz4vSrRjIBEAi0mg6TNVti0OaqXW6n95JljiM';


key = {
    key: '2cf7a71be6dc9665aba1f32451e887442cb5a9a208b29e1598611236e60b490'
}
axios.post(autenticaURL + '/autenticarApp', key).then(t => {
    token = t.data.token
}).catch(e => console.log(e))

/* get user page */
router.get(['/account'], function (req, res, next) {
    var _id = req.user._id

    var requestUser = axios.get(api_serverURL + '/users/' + _id + "?token=" + req.query.token);
    var requestFicheiros = axios.get(api_serverURL + '/files/autor/' + _id + "?token=" + req.query.token);

    axios.all([requestUser, requestFicheiros]).then(axios.spread((...response) => {
        var user = response[0].data;
        var ficheiros = response[1].data;
        var nome = user.name
        var mail = user._id
        var profilepic = user.profilepic
        var github = user.git
        var role = user.role
        var course = user.course
        var department = user.department
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
                    path: profilepic,
                    user_github: github,
                    user_role: role,
                    user_course: course,
                    user_department: department
                });
                break;
        }
    })).catch(function (erro) {
        console.log("ERROR Página User: " + erro)
    })
});

function renderConsumer(req, res, user) {
    var rUser = axios.get("http://localhost:3001/users?token=" + token2);
    var rFicheiros = axios.get("http://localhost:3001/files/public?token=" + req.query.token);
    var arr = []

    axios.all([rFicheiros, rUser]).then(axios.spread((...resposta) => {
        files = resposta[0].data;
        users = resposta[1].data;
        files.forEach(f => {
            if (f.favoritos.includes(user._id)) {
                arr.push(f)
            }
        })
        var nome = user.name
        var mail = user._id
        var profilepic = user.profilepic
        var github = user.git
        var role = user.role
        var course = user.course
        var department = user.department
        res.render('consumer', {
            token: req.query.token,
            lista: arr,
            user_id: mail,
            user_name: nome,
            user_mail: mail,
            path: profilepic,
            user_github: github,
            user_role: role,
            user_course: course,
            user_department: department,
            users: users
        });
    })).catch(function (erro) {
        console.log("ERROR Página Consumer: " + erro);
    });
}

// favourites
router.get("/favourites", (req, res) => {
    var requestUser = axios.get("http://localhost:3001/users?token=" + token2);
    var requestFicheiros = axios.get("http://localhost:3001/files/public?token=" + req.query.token);
    var arr = []

    axios.all([requestUser, requestFicheiros]).then(axios.spread((...response) => {
        var users = response[0].data;
        var files = response[1].data;
        files.forEach(f => {
            if (f.favoritos.includes(req.user._id)) {
                arr.push(f)
            }
        })
        res.render("library", {
            lista: arr,
            users: users,
            token: req.query.token,
            idUser: req.user._id
        });
    })).catch(function (erro) {
        console.log("ERROR Página Favoritos: " + erro);
    });
});


router.get('/login', function (req, res) {
    res.render('login', {title: 'Login'});
});

router.get('/signup', function (req, res) {
    res.render('signup', {title: 'Registar'});
});

router.post('/signup', function (req, res) {
    axios.post(autenticaURL + '/registar?token=' + token, req.body).then(dados => {
        res.redirect('/login');
    }).catch(error => {
        console.log(error);
    })
})

router.post('/login', function (req, res) {
    axios.post(autenticaURL + '/login?token=' + token, req.body).then(dados => {
        res.redirect("/homepage?token=" + dados.data.token);
    }).catch(error => {
        console.log(error);
    })
})


router.get('/logout', function (req, res) {
    axios.post(autenticaURL + '/logout/' + req.user._id + '?token=' + token).then(() => {
        res.redirect('/login');
    }).catch(error => {
        console.log(error);
    })
})


module.exports = router;
