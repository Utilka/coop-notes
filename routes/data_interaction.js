var express = require('express');
var router = express.Router();
var db = require('../db_data/database.js')

/* GET current configuration */
router.get('/', (req, res) => {
    res.json(global.gConfig);
});
router.get('/get_user', (req, res) => {
    let id = parseInt(req.query.id, 10)  // true
    db.di.get_user(id).then(function (user) {
        res.json(user)
    }).catch(function (reason) {
            console.log(reason);
            res.status(505).send(reason);
        }
    );
});
router.get('/get_canvas', (req, res) => {
    //GET /data/get_canvas?id_canvas=1
    let id_canvas = parseInt(req.query.id_canvas, 10);  // true
    db.di.get_canvas(id_canvas).then(function (user) {
        res.json(user)
    }).catch(function (reason) {
        console.log(reason);
        res.status(505).send(reason);
    });
    ;
});
router.get('/get_canvas_permission', (req, res) => {
    //GET /data/get_canvas_permission?id_user=1&id_canvas=3
    let id_user = parseInt(req.query.id_user, 10);
    let id_canvas = parseInt(req.query.id_canvas, 10);  // true
    db.di.get_canvas_permission(id_user, id_canvas).then(function (row) {
        res.json(row)
    }).catch(function (reason) {
        console.log(reason);
        res.status(505).send(reason);
    });
});
router.get('/get_note', (req, res) => {
    //GET /data/get_note?note_id=1
    let note_id = parseInt(req.query.note_id, 10);
    db.di.get_note(note_id).then(function (note) {
        res.json(note)
    }).catch(function (reason) {
        console.log(reason);
        res.status(505).send(reason);
    });
});
router.get('/get_connection', (req, res) => {
    //GET /data/get_connection?connection_id=1
    let connection_id = parseInt(req.query.connection_id, 10);
    db.di.get_connection(connection_id).then(function (connection) {
        res.json(connection)
    }).catch(function (reason) {
        console.log(reason);
        res.status(505).send(reason);
    });
});
router.get('/get_picture', (req, res) => {
    //GET /data/get_picture?picture_id=1
    let picture_id = parseInt(req.query.picture_id, 10);
    db.di.get_picture(picture_id).then(function (picture) {
        res.json(picture)
    }).catch(function (reason) {
        console.log(reason);
        res.status(505).send(reason);
    });
});


router.post('/upd_user', (req, res) => {
    //POST /data/upd_user?user_id=1 body{nick:fill}
    let upd_user_id = parseInt(req.query.user_id, 10);
    let data = req.body;
    db.di.upd_user(upd_user_id, data).then(res.status(200).send('User updated!')).catch(
        res.status(505).send(reson)
    );
});
router.post('/upd_canvas', (req, res) => {
    //POST /data/upd_canvas?canvas_id=1 body{title:new Canvas1}
    let upd_canvas_id = parseInt(req.query.canvas_id, 10);
    let data = req.body;
    console.log(data);
    db.di.upd_canvas(upd_canvas_id, data).then(res.status(200).send('Canvas updated!')).catch(
        res.status(505).send(reson)
    );
});
router.post('/upd_canvas_permission', (req, res) => {
    //POST /data/upd_canvas_permission?user_id=1&canvas_id=3 body{permission:4}
    let upd_user_id = parseInt(req.query.user_id, 10);
    let upd_canvas_id = parseInt(req.query.canvas_id, 10);
    let data = req.body;
    db.di.upd_canvas_permission(upd_user_id, upd_canvas_id, data).then(res.status(200).send('Canvas permission updated!')).catch(
        res.status(505).send(reson)
    );
});
router.post('/upd_note', (req, res) => {
    //POST /data/upd_note?note_id=1 body{title:new Note1}
    let upd_note_id = parseInt(req.query.note_id, 10);
    let data = req.body;
    db.di.upd_note(upd_note_id, data).then(res.status(200).send('Note updated!')).catch(
        res.status(505).send(reson)
    );
});
//---------------------------------------------
router.post('/upd_connection', (req, res) => {
    //POST /data/upd_connection?conn_id=1 body{title:new Title1}
    let upd_conection_id = parseInt(req.query.conn_id, 10);
    let data = req.body;
    db.di.upd_connection(upd_conection_id, data).then(
        res.status(200).send('Connection updated!'))
    .catch(
        res.status(505).send(reson)
    );
});
//--------------------------------------------
router.post('/upd_picture', (req, res) => {
    //POST /data/upd_picture?picture_id=1 body{title:new Title1}
    let upd_picture_id = parseInt(req.query.picture_id, 10);
    let data = req.body;
    db.di.upd_picture(upd_picture_id, data).then(res.status(200).send('Picture updated!')).catch(
        res.status(505).send(reson)
    );
});
//-------------------------------------------
router.post('/get_user_by_nick', (req, res) => {
    //POST /data/get_user_by_nick body{nick:andrey}
    let user_nick = req.body.nick;
    db.di.get_user_by_nick(user_nick).then(function(user) {res.json(user)}).catch(function (reason) {
        console.log(reason)
    });
});
router.post('/get_permitted_canvasses', (req, res) => {
    //POST /data/get_permitted_canvasses body{user_id:1}
    let user_id = req.body.user_id;
    db.di.get_permitted_canvasses(user_id).then(function(canvas) {res.json(canvas)}).catch(function (reason) {
        console.log(reason)
    });
});
//TODO
router.post('/get_canvasses_list', (req, res) => {
    //POST /data/get_permitted_canvasses body{id:1}
    let canvas_id = req.body.id;
    db.di.get_canvasses_list(canvas_id).then(function(canvas) {res.json(canvas)}).catch(function (reason) {
        console.log(reason)
    });
});
router.post('/get_notes_in_canvas', (req, res) => {
    //POST /data/get_notes_in_canvas body{canvas_id:1}
    let canvas_id = req.body.canvas_id;
    db.di.get_notes_in_canvas(canvas_id).then(function(canvas) {res.json(canvas)}).catch(function (reason) {
        console.log(reason)
    });
});
router.post('/get_connections_in_canvas', (req, res) => {
    //POST /data/get_notes_in_canvas body{canvas_id:1}
    let canvas_id = req.body.canvas_id;
    db.di.get_notes_in_canvas(canvas_id).then(function(canvas) {res.json(canvas)}).catch(function (reason) {
        console.log(reason)
    });
});
//can't check(no pictures)
router.post('/get_pictures_in_canvas', (req, res) => {
    //POST /data/get_pictures_in_canvas body{canvas_id:2}
    let canvas_id = req.body.canvas_id;
    db.di.get_pictures_in_canvas(canvas_id).then(function(canvas) {res.json(canvas)}).catch(function (reason) {
        console.log(reason)
    });
});
//-------------------------------------------
router.post('/insert_user', (req, res) => {
    //POST /data/insert_user body{nick:vanya}
    let nick = req.body.nick;
    db.di.insert_user(nick).then(res.status(200).send('User added!')).catch(
        res.status(505).send(reson)
    );
});

module.exports = router;
