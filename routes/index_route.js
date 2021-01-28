var express = require('express');
var router = express.Router();
var op = require("../bin/operations.js")

var canvList = op.canvList

/* GET home page. */
router.get('/', function(req, res, next) {
  return res.render('index', {canvas: canvas  })
  // return res.redirect(`/Canvas/${canvList[0].title}`);
});

module.exports = router;
