var express = require('express');
var router = express.Router();
var axios = require('axios')
var autenticaURL = "http://localhost:3000"
var api_serverURL = "http://localhost:3001"
var token;
var token2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhZG1pbiIsImxldmVsIjoiYWRtaW4iLCJleHBpcmVzSW4iOiIzbSIsImlhdCI6MTYxMDExODM1OX0.omYqB6hz4vSrRjIBEAi0mg6TNVti0OaqXW6n95JljiM';

key = {
    key: '2cf7a71be6dc9665aba1f32451e887442cb5a9a208b29e1598611236e60b490'
}

axios.post(autenticaURL + '/autenticarApp', key).then(t => {
    token = t.data.token
}).catch(e => {
    console.log('Look like you\'re lost ... Application authentication went wrong !')
})

/* get user page */
router.get(['/account'], function (req, res, next) {
    var _id = req.user._id

    var requestUser = axios.get(api_serverURL + '/users/' + _id + "?token=" + req.query.token);
    var requestFicheiros = axios.get(api_serverURL + '/files/autor/' + _id + "?token=" + req.query.token);
    var requestResourceTypes = axios.get(api_serverURL + '/files/resourceTypes/?token=' + req.query.token);

    var alert = 0
    if (req.query.alert == "1") {
        alert = 1
    }
    console.log(alert)
    axios.all([requestUser, requestFicheiros, requestResourceTypes]).then(axios.spread((...response) => {
        var user = response[0].data;
        var ficheiros = response[1].data;
        var resourceTypes = response[2].data;
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
                    user_department: department,
                    resourceTypes: resourceTypes,
                    level: req.user.level,
                    alertValue: alert
                });
                break;
        }
    })).catch(e => {
        res.render('errorAccount', {
            error: e,
            token: req.query.token,
            level: req.user.level
        })
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
            idUser: req.user._id,
            users: users,
            level: req.user.level
        });
    })).catch(e => {
        res.render('error', {
            error: e,
            token: req.query.token,
            level: req.user.level
        })
    })
}

router.get(['/account/:id'], function (req, res, next) {
    console.log(req.params.id)
    var requestUser = axios.get(api_serverURL + '/users/' + req.params.id + "?token=" + req.query.token);
    var requestFicheiros = axios.get(api_serverURL + '/files/autor/' + req.params.id + "?token=" + req.query.token);
    axios.all([requestUser, requestFicheiros]).then(axios.spread((...response) => {
        var user = response[0].data;
        var ficheiros = response[1].data;
        var profilepic = user.profilepic
        var nome = user.name
        var mail = user._id
        var github = user.git
        var role = user.role
        var course = user.course
        var department = user.department
        var registrationDate = user.registrationDate
        var lastAccessDate = user.lastAccessDate
        var level = user.level
        res.render('user', {
            lista: ficheiros,
            path: profilepic,
            user_name: nome,
            user_mail: mail,
            user_github: github,
            user_role: role,
            user_course: course,
            user_department: department,
            user_level: level,
            user_registrationDate: registrationDate,
            user_lastAccessDate: lastAccessDate,
            token: req.query.token,
            mylevel: req.user.level
        });
    })).catch(e => {
        res.render('errorUser', {
            error: e,
            token: req.query.token,
            level: req.user.level
        })
    })
});

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
            idUser: req.user._id,
            level: req.user.level
        });
    })).catch(e => {
        res.render('errorFavourites', {
            error: e,
            token: req.query.token,
            level: req.user.level
        })
    })
});


// Admin Page :)
router.get("/admin", (req, res) => {
    var requestUser = axios.get("http://localhost:3001/users?token=" + req.query.token);
    var requestFiles = axios.get("http://localhost:3001/files?token=" + req.query.token);

    axios.all([requestUser, requestFiles]).then(axios.spread((...response) => {
        var users = response[0].data;
        var files = response[1].data;
        console.log("Entrei")
        res.render("admin", {
            idUser: req.user._id,
            users: users,
            files: files,
            token: req.query.token,
            level: req.user.level
        });
    })).catch(e => {
        res.render('error', {
            error: e,
            token: req.query.token,
            level: req.user.level
        })
    })
});


router.get("/all", (req, res) => {
    var requestUser = axios.get("http://localhost:3001/users?token=" + token2);

    axios.all([requestUser]).then(axios.spread((...response) => {
        var users = response[0].data;
        res.render("users", {
            users: users,
            token: req.query.token,
            level: req.user.level
        });
    })).catch(e => {
        res.render('errorAll', {
            error: e,
            token: req.query.token,
            level: req.user.level
        })
    })
});

router.get('/login', function (req, res) {
    res.render('login', {title: 'Login'});
});

router.get('/signup', function (req, res) {
    res.render('signup', {title: 'SignUp'});
});

router.post('/signup', function (req, res) {
    axios.post(autenticaURL + '/registar?token=' + token, req.body).then(dados => {
        res.redirect('/login');
    }).catch(e => {
        res.render('errorSignUp', {
            error: e,
            token: token
        })
    });
});

router.post('/login', function (req, res) {
    axios.post(autenticaURL + '/login?token=' + token, req.body).then(dados => {
        res.redirect("/homepage?token=" + dados.data.token);
    }).catch(e => {
        res.render('errorLogin', {
            error: e,
            token: token
        });
    });
});

router.get('/logout', function (req, res) {
    axios.post(autenticaURL + '/logout/' + req.user._id + '?token=' + token).then(() => {
        res.redirect('/login');
    }).catch(e => {
        res.render('errorLogout', {
            error: e,
            token: req.query.token
        })
    })
})


module.exports = router;
