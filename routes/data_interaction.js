var express = require('express');
var router = express.Router();
var db = require('../db_data/database.js')

/* GET current configuration */
router.get('/', (req, res) => {
    res.json(global.gConfig);
});
router.get('/get_user', (req, res) => {
    let id = parseInt(req.query.id,10)  // true
    db.di.get_user(id).then (function(user) {res.json(user)}).catch(
        res.status(505).send(reson)
    );
});
router.get('/get_canvas', (req, res) => {
    //GET /data/get_canvas?id_canvas=1
    let id_canvas = parseInt(req.query.id_canvas, 10);  // true
    db.di.get_canvas(id_canvas).then (function(user) {res.json(user)}).catch(function (reason) {
        console.log(reason)
    });;
});
router.get('/get_canvas_permission', (req, res) => {
    //GET /data/get_canvas_permission?id_user=1&id_canvas=3
    let id_user = parseInt(req.query.id_user, 10);
    let id_canvas = parseInt(req.query.id_canvas, 10);  // true
    db.di.get_canvas_permission(id_user, id_canvas).then (function(row) {res.json(row)}).catch(function (reason) {
        console.log(reason)
    });
});
router.get('/get_note', (req, res) => {
    //GET /data/get_note?note_id=1
    let note_id = parseInt(req.query.note_id, 10);
    db.di.get_note(note_id).then (function(note) {res.json(note)}).catch(function (reason) {
        console.log(reason)
    });
});
router.get('/get_connection', (req, res) => {
    //GET /data/get_connection?connection_id=1
    let connection_id = parseInt(req.query.connection_id, 10);
    db.di.get_connection(connection_id).then (function(connection) {res.json(connection)}).catch(function (reason) {
        console.log(reason)
    });
});
router.get('/get_picture', (req, res) => {
    //GET /data/get_picture?picture_id=1
    let picture_id = parseInt(req.query.picture_id, 10);
    db.di.get_picture(picture_id).then (function(picture) {res.json(picture)}).catch(function (reason) {
        console.log(reason)
    });
});


router.post('/upd_user', (req, res) => {
    //POST /upd_user?user_id=1 body{nick:andrey}
    let upd_user_id = parseInt(req.query.user_id, 10);
    let data = req.body;
    db.di.upd_user(upd_user_id, data).then(res.status(200).send('All done!')).catch(
        res.status(505).send(reson)
    );
});

module.exports = router;
