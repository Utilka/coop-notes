var express = require('express');
const { valuesIn } = require('lodash');
var router = express.Router();
var op = require("../bin/operations.js")

var canvList = op.canvList

router.get('/:canvasTitle', function(req, res, next) {
    let canvasTitle = req.params['canvasTitle']
    let canvas = canvList.find(x => x.title === canvasTitle)
    return res.render('canvas', {
        canvas: canvas,
    })
})

module.exports = router;
