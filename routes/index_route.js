var express = require('express');
var router = express.Router();
// var op = require("../bin/operations.js")

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user)
  res.render('index')
  // res.redirect(`/canvas/0`);
  // TODO Last opened canvas
  // res.redirect(`/Canvas/${}`);
});

router.get('/ping', (req, res) => {
  res.status(200).send("pong!");
});

module.exports = router;
