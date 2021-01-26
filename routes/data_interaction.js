var express = require('express');
var router = express.Router();

var Canvas = express.Router();

/* GET current configuration */
router.get('/', (req, res) => {
    res.json(global.gConfig);
});

module.exports = router;