var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.put('/:_id', update);
router.get('/:_id', blocking);
router.get('/unblock/:_id', unblock);
router.get('/activate/:hash', activate);
router.delete('/:_id', _delete);

module.exports = router;

function authenticate(req, res) {
    userService.authenticate(req.body.username, req.body.password)
        .then(function (user) {
            if (user) {
                // authentication successful
                res.send(user);
            } else {
                // authentication failed
                res.status(400).send('Username or password is incorrect or you are blocked');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function register(req, res) {
    userService.create(req.body, req.params.activated)
        .then(function () {
            res.json('success');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    userService.getAll()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrent(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    userService.update(req.params._id, req.body)
        .then(function () {
            res.json('success');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    var deleteSelf = req.user.sub === req.params._id;
    userService.delete(req.params._id)
        .then(function () {
            res.json({deleteSelf: deleteSelf});
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function blocking(req, res) {
    var deleteSelf = req.user.sub === req.params._id;
    userService.blocking(req.params._id)
        .then(function () {
        res.json({deleteSelf: deleteSelf});
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
        
}

function unblock(req, res) {
    userService.unblock(req.params._id)
        .then(function () {
            res.json('success');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function activate(req, res) {
    var enter = req.user.password == req.params.hash
    if (enter){
        console.log("BLAAA");
    }
    console.log("OOOO");
}



