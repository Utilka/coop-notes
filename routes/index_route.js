var express = require('express');
var router = express.Router();
// var op = require("../bin/operations.js")

/* GET home page. */
router.get('/', function(req, res, next) {
  //return res.render('index', {canvas: canvas  })
  return res.redirect(`/canvas/0`);
  // TODO Last opened canvas
  //return res.redirect(`/Canvas/${}`);
});

module.exports = router;
