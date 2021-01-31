const express = require('express');
const passport = require('passport');
const db = require('../db_data/database');
const router = express.Router();


router.get('/', (req, res) => {
    console.log(req.user)
    res.status(200).send(req.user);
})

router.get('/login', (req, res) => {
    res.render('login');
})
router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/login', passport.authenticate('local', {failureRedirect: '/user/login', failureFlash: true}),
    function (req, res, next) {
        req.session.save((err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/user/');
        });
    }
)

router.post('/register', (req, res, next) => {
    let nick = req.body.username
    let password = req.body.password

    db.di.insert_user(nick,password)
    passport.authenticate('local')(req, res, () => {
        req.session.save((err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
    });
})

//logout
router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

module.exports = router; 