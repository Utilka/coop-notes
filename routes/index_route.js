var express = require('express');
var router = express.Router();
var op = require("../bin/operations.js")

var canvList = op.canvList

/* GET home page. */
// router.get('/', function(req, res, next) {
//   return res.redirect(`/Canvas/`);
// });

module.exports = router;
