var express = require('express');
const { valuesIn } = require('lodash');
var router = express.Router();
var op = require("../bin/operations.js")



var canvList = op.canvList



router.get('/:cTitle', function(req, res, next) {
    var canvasTitle = req.params['canvasTitle']
    var Canvas = canvList.find(x => x.title === canvasTitle)
  return res.render('canvas', {
     Canvas: Canvas,
     
  });
});

module.exports = router;