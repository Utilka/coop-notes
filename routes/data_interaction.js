var express = require('express');
var router = express.Router();
var db = require('../db_data/database.js')

/* GET current configuration */
router.get('/', (req, res) => {
    res.json(global.gConfig);
});
router.get('/get_user', (req, res) => {
    let id = parseInt(req.query.id, 10);
    db.di.get_user(id).then(function (user) {
        res.json(user);
    }).catch(function (reason) {
            console.log(reason);
            res.status(505).send(reason);
        }
    );
});
router.get('/get_canvas', (req, res) => {
    //GET /data/get_canvas?id_canvas=1
    let id_canvas = parseInt(req.query.id_canvas, 10); 
    db.di.get_canvas(id_canvas).then(function (user) {
        res.json(user);
    }).catch(function (reason) {
        console.log(reason);
        res.status(505).send(reason);
    });
    ;
});
router.get('/get_canvas_permission', (req, res) => {
    //GET /data/get_canvas_permission?id_user=1&id_canvas=3
    let id_user = parseInt(req.query.id_user, 10);
    let id_canvas = parseInt(req.query.id_canvas, 10); 
    db.di.get_canvas_permission(id_user, id_canvas).then(function (row) {
        res.json(row);
    }).catch(function (reason) {
        console.log(reason);
        res.status(505).send(reason);
    });
});
router.get('/get_note', (req, res) => {
    //GET /data/get_note?note_id=1
    let note_id = parseInt(req.query.note_id, 10);
    db.di.get_note(note_id).then(function (note) {
        res.json(note);
    }).catch(function (reason) {
        console.log(reason);
        res.status(505).send(reason);
    });
});
router.get('/get_connection', (req, res) => {
    //GET /data/get_connection?connection_id=1
    let connection_id = parseInt(req.query.connection_id, 10);
    db.di.get_connection(connection_id).then(function (connection) {
        res.json(connection);
    }).catch(function (reason) {
        console.log(reason);
        res.status(505).send(reason);
    });
});
router.get('/get_picture', (req, res) => {
    //GET /data/get_picture?picture_id=1
    let picture_id = parseInt(req.query.picture_id, 10);
    db.di.get_picture(picture_id).then(function (picture) {
        res.json(picture);
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
        res.status(505).send(reason)
    );
});
router.post('/upd_canvas', (req, res) => {
    //POST /data/upd_canvas?canvas_id=1 body{title:new Canvas1}
    let upd_canvas_id = parseInt(req.query.canvas_id, 10);
    let data = req.body;
    console.log(data);
    db.di.upd_canvas(upd_canvas_id, data).then(res.status(200).send('Canvas updated!')).catch(
        res.status(505).send(reason)
    );
});
router.post('/upd_canvas_permission', (req, res) => {
    //POST /data/upd_canvas_permission?user_id=1&canvas_id=3 body{permission:4}
    let upd_user_id = parseInt(req.query.user_id, 10);
    let upd_canvas_id = parseInt(req.query.canvas_id, 10);
    let data = req.body;
    db.di.upd_canvas_permission(upd_user_id, upd_canvas_id, data).then(res.status(200).send('Canvas permission updated!')).catch(
        res.status(505).send(reason)
    );
});
router.post('/upd_note', (req, res) => {
    //POST /data/upd_note?note_id=1 body{title:new Note1}
    let upd_note_id = parseInt(req.query.note_id, 10);
    let data = req.body;
    db.di.upd_note(upd_note_id, data).then(res.status(200).send('Note updated!')).catch(
        res.status(505).send(reason)
    );
});
router.post('/upd_connection', (req, res) => {
    //POST /data/upd_connection?conn_id=1 body{title:new Title1}
    let upd_conection_id = parseInt(req.query.conn_id, 10);
    let data = req.body;
    db.di.upd_connection(upd_conection_id, data).then(
        res.status(200).send('Connection updated!'))
    .catch(
        res.status(505).send(reason)
    );
});
router.post('/upd_picture', (req, res) => {
    //POST /data/upd_picture?picture_id=1 body{title:new Title1}
    let upd_picture_id = parseInt(req.query.picture_id, 10);
    let data = req.body;
    db.di.upd_picture(upd_picture_id, data).then(res.status(200).send('Picture updated!')).catch(
        res.status(505).send(reason)
    );
});
router.get('/get_user_by_nick', (req, res) => {
    //GET /data/get_user_by_nick?nick=fill
    let user_nick = req.query.nick;
    db.di.get_user_by_nick(user_nick).then(function(user) 
    {
        res.json(user);
    }).catch(function (reason) {
        console.log(reason);
        res.status(505).send(reason);
    });
});
//problems with answer(not what i waited)
router.get('/get_permitted_canvasses', (req, res) => {
    //GET /data/get_permitted_canvasses?user_id=1
    let user_id = parseInt(req.query.user_id, 10);
    db.di.get_permitted_canvasses(user_id).then(function(canvas)
     {
        res.json(canvas);
    }).catch(function (reason) {
        console.log(reason);
        res.status(505).send(reason);
    });
});
//TODO
router.get('/get_canvasses_list', (req, res) => {
    //GET /data/get_canvasses_list?list=1,2
    let canvas_id = req.query.list;
    let canvas_id_list = canvas_id.split(',').map(function(item) {
        return parseInt(item, 10);
    });
    db.di.get_canvasses_list(canvas_id_list).then(function(canvas) 
    {
        res.json(canvas)
    }).catch(function (reason) {
         res.status(505).send(reason)
        console.log(reason)
    });
});

router.get('/get_notes_in_canvas', (req, res) => {
    //GET /data/get_notes_in_canvas?canvas_id=1
    let canvas_id = req.query.canvas_id;
    db.di.get_notes_in_canvas(canvas_id).then(function(canvas) 
    {
        res.json(canvas);
    }).catch(function (reason) {
        console.log(reason);
        res.status(505).send(reason);
    });
});
router.get('/get_connections_in_canvas', (req, res) => {
    //GET /data/get_connections_in_canvas?canvas_id=1
    let canvas_id = req.query.canvas_id;
    db.di.get_connections_in_canvas(canvas_id).then(function(canvas) 
    {
        res.json(canvas);
    }).catch(function (reason) {
        console.log(reason);
        res.status(505).send(reason);
    });
});

//can't check(no pictures)
router.get('/get_pictures_in_canvas', (req, res) => {
    //POST /data/get_pictures_in_canvas?canvas_id=2
    let canvas_id = req.body.canvas_id;
    db.di.get_pictures_in_canvas(canvas_id).then(function(canvas) 
    {
        res.json(canvas);
    }).catch(function (reason) {
        console.log(reason);
        res.status(505).send(reason);
    });
});

router.post('/insert_user', (req, res) => {
    //POST /data/insert_user body{nick:vanya}
    let nick = req.body.nick;
    console.log(nick);
    db.di.insert_user(nick).then(res.status(200).send('User added!')).catch(
        res.status(505).send(reason)
    );
});

router.post('/insert_canvas', (req, res) => {
    //POST /data/insert_canvas body{title:Title1, owner_id:1}
    let title = req.body.title;
    let owner_id = req.body.owner_id;
    db.di.insert_canvas(title, owner_id).then(res.status(200).send('Canvas added!')).catch(
        res.status(505).send(reason)
    );
});
router.post('/insert_canvas_permission', (req, res) => {
    //POST /data/insert_canvas_permission body{user_id:1, canvas_id:1, permission:1}
    let user_id = req.body.user_id;
    let canvas_id = req.body.canvas_id;
    let permission = req.body.permission;
    db.di.insert_canvas_permission(user_id, canvas_id, permission).then(res.status(200).send('Canvas permission added!')).catch(
        res.status(505).send(reason)
    );
});
router.post('/insert_note', (req, res) => {
    //POST /data/insert_note body{owner_id:3, canvas_id:1, coordinate_x:213, coordinate_y:35, title:Title1}
    let owner_id = req.body.owner_id;
    let canvas_id = req.body.canvas_id;
    let coordinate_x = req.body.coordinate_x;
    let coordinate_y = req.body.coordinate_y;
    db.di.insert_note(canvas_id, owner_id, coordinate_x, coordinate_y).then(res.status(200).send('Note added!')).catch(
        res.status(505).send(reason)
    );
});
router.post('/insert_connection', (req, res) => {
    //POST /data/insert_connection body{canvas_id:1, owner_id:3, origin_conn_type:3, origin_conn_id:1, origin_conn_pos_type:2, origin_conn_pos:2, target_conn_type:4, target_conn_id:1, target_conn_pos_type:3, target_conn_pos:5}
    let canvas_id = req.body.canvas_id;
    let owner_id = req.body.owner_id;
    let origin_conn_type = req.body.origin_conn_type;
    let origin_conn_id = req.body.origin_conn_id;
    let origin_conn_pos_type = req.body.origin_conn_pos_type;
    let origin_conn_pos = req.body.origin_conn_pos;
    let target_conn_type = req.body.target_conn_type;
    let target_conn_id = req.body.target_conn_id;
    let target_conn_pos_type = req.body.target_conn_pos_type;
    let target_conn_pos = req.body.target_conn_pos;
    db.di.insert_connection(canvas_id, owner_id,
        origin_conn_type, origin_conn_id, origin_conn_pos_type, origin_conn_pos,
        target_conn_type, target_conn_id, target_conn_pos_type, target_conn_pos).then(res.status(200).send('Connection added!')).catch(
        res.status(505).send(reason)
    );
});
router.post('/insert_picture', (req, res) => {
    //POST /data/insert_picture body{canvas_id:2, owner_id:1, coordinate_x:23, coordinate_y:543, content:null}
    let canvas_id = req.body.canvas_id;
    let owner_id = req.body.owner_id;
    let coordinate_x = req.body.coordinate_x;
    let coordinate_y = req.body.coordinate_y;
    let content = req.body.content;
    db.di.insert_picture(canvas_id, owner_id, coordinate_x, coordinate_y, content).then(res.status(200).send('Picture added!')).catch(
        res.status(505).send(reason)
    );
});
router.get('/check_user_canvas_permission', (req, res) => {
    //GET /data/check_user_canvas_permission?user_id=2&canvas_id=1 
    let canvas_id = req.query.canvas_id;
    let user_id = req.query.user_id;
    db.di.check_user_canvas_permission(user_id, canvas_id).then(function(permission) {
        res.json(permission);
    }).catch(function (reason) {
        console.log(reason);
        res.status(505).send(reason);
    });
});
module.exports = router;