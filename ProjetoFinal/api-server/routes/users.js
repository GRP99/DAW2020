var express = require('express');
var router = express.Router();
var multer = require('multer')
var upload = multer({dest: 'uploads/'})
var fs = require('fs')
var path = require('path');
var jwt = require('jsonwebtoken');

var User = require('../controllers/users');

// get all users
router.get("/", function (req, res) {
    if (req.user.level == 'admin') {
        User.listUsers().then((data) => {
            res.status(200).jsonp(data);
        }).catch((err) => {
            res.status(500).jsonp(err);
        });
    } else {
        res.status(401).jsonp({error: 'You do not have permissions for such an operation!'})
    }
});

// get one user by id
router.get("/:id", function (req, res) {
    id_autor = req.params.id;
    User.lookUp(id_autor).then((data) => {
        user = {
            _id: data._id,
            name: data.name,
            level: data.level,
            profilepic: data.profilepic,
            registrationDate: data.registrationDate,
            git: data.git,
            role: data.role,
            course: data.course,
            department: data.department
        }
        res.status(200).jsonp(user);
    }).catch((err) => {
        res.status(500).jsonp(err)
    });
});


// login
router.post("/login", function (req, res) {
    User.lookUp(req.body._id).then((dados) => {
        const user = dados;
        if (! user) {
            res.status(404).jsonp({error: "User not found!"});
        } else {
            if (req.body.password == user.password) {
                jwt.sign({
                    _id: user._id,
                    level: user.level,
                    expiresIn: "1d"
                }, "PRI2020", function (err, token) {
                    if (err) {
                        res.status(400).jsonp({error: "Could not log in!"});
                    } else {
                        res.status(200).jsonp({token: token});
                    }
                });
            } else {
                res.status(401).jsonp({error: "Wrong Password!"});
            }
        }
    });
});


// register
router.post("/registar", function (req, res) {
    var user = req.body;
    user.profilepic = 0;
    User.insereUser(user).then(() => {
        res.status(200).jsonp({msg: "User created successfully!"});
    }).catch((err) => {
        res.status(500).jsonp({error: err})
    });
});


// profile pic of user
router.post("/changeprofile", upload.single("myProfilePic"), (req, res) => {
    if (req.file.mimetype == "image/png" || req.file.mimetype == "image/jpeg") {
        let quarantinePath = __dirname + "/../" + req.file.path;
        let dirpath = __dirname + "/../public/images/" + req.body.autor;
        fs.mkdirSync(dirpath, {recursive: true});
        let newPath = dirpath + "/" + "profilepic.jpeg";

        /*
        let dpath = "/../public/images/" + req.body.autor + "/" + "profilepic.jpeg"
        var normalizedPath = path.normalize(newPath);
        var correctedPath = normalizedPath.replace(/\\/g, '/');
        */

        fs.rename(quarantinePath, newPath, function (error) {
            if (error) {
                console.log("ERROR" + error);
            }
        });

        User.updatePhoto(req.body.autor);

        res.redirect("http://localhost:3002/users/account?token=" + req.query.token);
    } else {
        console.log("ERRO: Não é uma imagem!");
        res.redirect("http://localhost:3002/users/account?token=" + req.query.token);
    }
});


router.get('/:_id/profilepic.jpeg', function (req, res) {
    var userID = req.params._id
    res.sendFile(path.resolve(__dirname + '/../public/images/' + userID + '/profilepic.jpeg'));
})


module.exports = router;
