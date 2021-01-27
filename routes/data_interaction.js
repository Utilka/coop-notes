var express = require('express');
var router = express.Router();

var db = require('../db_data/database.js')

/* GET current configuration */
router.get('/', (req, res) => {
    res.json(global.gConfig);
});

router.get('/user', (req, res) => {
    let id = parseInt(req.query.id,10)  // true
    db.di.get_user(id).then (function(user) {res.json(user)})
});

module.exports = router;