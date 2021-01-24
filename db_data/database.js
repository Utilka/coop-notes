var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('./db_data/main.sqlite3')

function db_init() {
    return new Promise(function (resolve, reject) {
        db.run(`PRAGMA foreign_keys = ON;`);

        db.run(`CREATE TABLE IF NOT EXISTS "users" (
                "id" INTEGER PRIMARY KEY,
                "nick" TEXT NOT NULL UNIQUE,
                "settings" TEXT
                );`);

        db.run(`CREATE TABLE IF NOT EXISTS "canvasses" (
                "id" INTEGER PRIMARY KEY,
                "title" TEXT,
                "owner_id" INTEGER,
                "created_at" INTEGER DEFAULT (strftime('%s','now')),
                "settings" TEXT,
                    FOREIGN KEY (owner_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE
                );`);

        db.run(`CREATE TABLE IF NOT EXISTS "canvasses_permissions" (
                "user_id" INTEGER NOT NULL,
                "canvas_id" INTEGER NOT NULL,
                "permission" INTEGER, -- ENUM ('none','read','write')
                    PRIMARY KEY(user_id,canvas_id)
                    FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE
                    FOREIGN KEY (canvas_id) REFERENCES canvasses (id) ON UPDATE CASCADE ON DELETE CASCADE
                );`);

        db.run(`CREATE TABLE IF NOT EXISTS "notes" (
                "id" INTEGER PRIMARY KEY,
                "title" TEXT,
                "canvas_id" INTEGER NOT NULL,
                "owner_id" INTEGER,
                "created_at" INTEGER DEFAULT (strftime('%s','now')),
                "last_editor_id" INTEGER,
                "last_edited_at" INTEGER DEFAULT (strftime('%s','now')),
                "settings" TEXT,
                "coordinate_x" INTEGER,
                "coordinate_y" INTEGER,
                "body" TEXT,
                "expanded_body" TEXT,
                    FOREIGN KEY (canvas_id) REFERENCES canvasses (id) ON UPDATE CASCADE ON DELETE CASCADE,
                    FOREIGN KEY (owner_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE SET NULL
                    FOREIGN KEY (last_editor_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE SET NULL
                );`);

        db.run(`CREATE TABLE IF NOT EXISTS "connections" (
                "id" INTEGER PRIMARY KEY,
                "title" TEXT,
                "canvas_id" INTEGER NOT NULL,
                "owner_id" INTEGER,
                "created_at" INTEGER DEFAULT (strftime('%s','now')),
                "last_editor_id" INTEGER,
                "last_edited_at" INTEGER DEFAULT (strftime('%s','now')),
                "settings" TEXT,
                "expanded_body" TEXT,
                "origin_conn_type" INTEGER, -- ENUM ('note','connection','picture','free')
                "origin_conn_id" INTEGER,
                "origin_conn_pos_type" INTEGER, -- ENUM ('absolute','auto','relative_to_side','relative_to_text')
                "origin_conn_pos" TEXT,
                "target_conn_type" INTEGER, -- ENUM ('note','connection','picture','free')
                "target_conn_id" INTEGER,
                "target_conn_pos_type" INTEGER, -- ENUM ('absolute','auto','relative_to_side','relative_to_text')
                "target_conn_pos" TEXT,
                    FOREIGN KEY (canvas_id) REFERENCES canvasses (id) ON UPDATE CASCADE ON DELETE CASCADE,
                    FOREIGN KEY (owner_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE SET NULL
                    FOREIGN KEY (last_editor_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE SET NULL
                );
                `);
        db.run(`CREATE TABLE IF NOT EXISTS "pictures" (
                "id" INTEGER PRIMARY KEY,
                "title" TEXT,
                "canvas_id" INTEGER NOT NULL,
                "owner_id" INTEGER,
                "created_at" INTEGER DEFAULT (strftime('%s','now')),
                "last_editor_id" INTEGER,
                "last_edited_at" INTEGER DEFAULT (strftime('%s','now')),
                "settings" TEXT,
                "coordinate_x" INTEGER,
                "coordinate_y" INTEGER,
                "content" TEXT,
                "expanded_body" TEXT,
                    FOREIGN KEY (canvas_id) REFERENCES canvasses (id) ON UPDATE CASCADE ON DELETE CASCADE,
                    FOREIGN KEY (owner_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE SET NULL
                    FOREIGN KEY (last_editor_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE SET NULL
                );
                `);

        db.run(`CREATE TRIGGER IF NOT EXISTS note_last_edited_upd AFTER UPDATE OF last_editor_id ON notes
                BEGIN
                    UPDATE notes SET last_edited_at=strftime('%s','now') WHERE id = NEW.id;
                END;
                `);
        db.run(`CREATE TRIGGER IF NOT EXISTS conn_last_edited_upd AFTER UPDATE OF last_editor_id ON connections
                BEGIN
                    UPDATE connections SET last_edited_at=strftime('%s','now') WHERE id = NEW.id;
                END;
                `);
        db.run(`CREATE TRIGGER IF NOT EXISTS pic_last_edited_upd AFTER UPDATE OF last_editor_id ON pictures
                BEGIN
                    UPDATE pictures SET last_edited_at=strftime('%s','now') WHERE id = NEW.id;
                END;
                `);

        db.run(`CREATE TRIGGER IF NOT EXISTS note_last_editor_init AFTER INSERT ON notes
                BEGIN
                    UPDATE notes SET last_editor_id=NEW.owner_id WHERE id = NEW.id;
                END;
                `);
        db.run(`CREATE TRIGGER IF NOT EXISTS conn_last_editor_init AFTER INSERT ON connections
                BEGIN
                    UPDATE connections SET last_editor_id=NEW.owner_id WHERE id = NEW.id;
                END;
                `);
        db.run(`CREATE TRIGGER IF NOT EXISTS pic_last_editor_init AFTER INSERT on pictures
                BEGIN
                    UPDATE pictures SET last_editor_id=NEW.owner_id WHERE id = NEW.id;
                END;
                `);
        resolve()
    })
}

function db_load_sample_data() {
    db.serialize(function () {
        db.run(`INSERT INTO users (nick) VALUES
                ("Kot"),
                ("Foo"),
                ("ShiZ");
                `);
        db.run(`INSERT INTO canvasses (title,owner_id) VALUES
                ("Canvas1",1),
                ("Canvas2",1),
                ("Canvas3",2);
                `);
        db.run(`INSERT INTO canvasses_permissions (user_id,canvas_id,permission) VALUES
                (2,1,2),
                (3,1,1),
                (1,3,2);
                `);
        db.run(`INSERT INTO notes (owner_id,canvas_id,coordinate_x,coordinate_y,title) VALUES
                (1,1,10,100,"Note1"),
                (1,1,500,100,"Note2"),
                (2,1,1000,500,"Note3"),
                (2,1,500,500,"Note4"),
                
                (1,2,200,100,"Note5"),
                (1,2,-200,100,"Note6"),
                (3,2,0,-200,"Note7"),
                (3,2,-100,-400,"Note8"),
                
                (2,3,-200,-200,"Note9"),
                (2,3,200,-200,"Note10"),
                (3,3,200,200,"Note11"),
                (3,3,-200,200,"Note12");
                `);
        db.run(`INSERT INTO connections
                (canvas_id,owner_id,
                origin_conn_type,origin_conn_id,origin_conn_pos_type,origin_conn_pos,
                target_conn_type,target_conn_id,target_conn_pos_type,target_conn_pos) VALUES
                (1,1,    1,1,2,null,    1,2,2,null),
                (1,2,    1,1,2,null,    1,3,2,null),
                (1,2,    1,2,2,null,    1,4,2,null),
                (1,2,    1,2,2,null,    1,3,2,null),
                (1,2,    1,3,2,null,    1,4,2,null),
                
                (2,1,    1,5,2,null,    1,7,2,null),
                (2,1,    1,7,2,null,    1,8,2,null),
                (2,3,    1,6,2,null,    2,6,2,null),
                
                (3,1,    1,9,2,null,    1,10,2,null),
                (3,2,    1,10,2,null,    4,null,1,"300, -300"),
                (3,3,    4,null,1,"-300, -300",    1,9,2,null),
                (3,2,    1,11,2,null,    1,12,2,null),
                (3,3,    1,12,2,null,    4,null,1,"-300, 300"),
                (3,3,    4,null,1,"300, 300",    1,11,2,null);
                `);
    })
}

function check_db_empty(callback) {
    //calls callback function if there are no users in database
    db.get("SELECT * FROM users;", [], function (err, row) {
        if (row === undefined) {
            callback()
        }
    })
}

function end_work() {
    db.close();
    console.log("database closed")
}

function data_dict_stringify(data_dict) {
    // {"key":"value"}
    let data_string = ""
    Object.entries(data_dict).forEach(entry => {
        const [key, value] = entry;
        data_string += `${key} = ${value},`
    });
    data_string = data_string.substring(0, data_string.length-1);
    return data_string;
}
function data_list_stringify(data_list) {
    // {"key":"value"}
    let data_string = ""
    data_list.forEach(entry => {
        data_string += `${entry},`
    });
    data_string = data_string.substring(0, data_string.length-1);
    return data_string;
}
class data_interaction {
    get_user(user_id) {
        return new Promise(function (resolve, reject) {
            db.get(`SELECT * FROM users WHERE id = ${user_id};`, [], function (err, row) {
                resolve(row)
            })
        })
    }
    get_canvas(canvas_id) {
        return new Promise(function (resolve, reject) {
            db.get(`SELECT * FROM canvasses WHERE id = ${canvas_id};`, [], function (err, row) {
                resolve(row)
            })
        })
    }
    get_canvas_permission(user_id, canvas_id) {
        return new Promise(function (resolve, reject) {
            db.get(`SELECT * FROM canvasses_permissions WHERE (user_id = ${user_id} and canvas_id = ${canvas_id});`, [], function (err, row) {
                resolve(row)
            })
        })
    }
    get_note(note_id) {
        return new Promise(function (resolve, reject) {
            db.get(`SELECT * FROM notes WHERE id = ${note_id};`, [], function (err, row) {
                resolve(row)
            })
        })
    }
    get_connection(connection_id) {
        return new Promise(function (resolve, reject) {
            db.get(`SELECT * FROM connections WHERE id = ${connection_id};`, [], function (err, row) {
                resolve(row)
            })
        })
    }
    get_picture(picture_id) {
        return new Promise(function (resolve, reject) {
            db.get(`SELECT * FROM pictures WHERE id = ${picture_id};`, [], function (err, row) {
                resolve(row)
            })
        })
    }

    upd_user(user_id,data) {
        let data_string=data_dict_stringify(data)
        return new Promise(function (resolve, reject) {
            db.run(`UPDATE users SET ${data_string} WHERE id = ${user_id};`, [], function (err, row) {
                resolve(row)
            })
        })
    }
    upd_canvas(canvas_id,data) {
        let data_string=data_dict_stringify(data)
        return new Promise(function (resolve, reject) {
            db.run(`UPDATE canvasses SET ${data_string} WHERE id = ${canvas_id};`, [], function (err, row) {
                resolve(row)
            })
        })
    }
    upd_canvas_permission(user_id,canvas_id,data) {
        let data_string=data_dict_stringify(data)
        return new Promise(function (resolve, reject) {
            db.run(`UPDATE canvasses_permissions SET ${data_string} WHERE (user_id = ${user_id} and canvas_id = ${canvas_id});`, [], function (err, row) {
                resolve(row)
            })
        })
    }
    upd_note(note_id,data) {
        let data_string=data_dict_stringify(data)
        return new Promise(function (resolve, reject) {
            db.run(`UPDATE notes SET ${data_string} WHERE id = ${note_id};`, [], function (err, row) {
                resolve(row)
            })
        })
    }
    upd_connection(connection_id,data) {
        let data_string=data_dict_stringify(data)
        return new Promise(function (resolve, reject) {
            db.run(`UPDATE notes SET ${data_string} WHERE id = ${connection_id};`, [], function (err, row) {
                resolve(row)
            })
        })
    }
    upd_picture(picture_id,data) {
        let data_string=data_dict_stringify(data)
        return new Promise(function (resolve, reject) {
            db.run(`UPDATE notes SET ${data_string} WHERE id = ${picture_id};`, [], function (err, row) {
                resolve(row)
            })
        })
    }

    get_user_by_nick(user_nick) {
        return new Promise(function (resolve, reject) {
            db.get(`SELECT * FROM users WHERE nick = "${user_nick}";`, [], function (err, row) {
                resolve(row)
            })
        })
    }
    get_permitted_canvasses(user_id) {
        return new Promise(function (resolve, reject) {
            db.get(`SELECT * FROM canvasses_permissions WHERE (user_id = ${user_id} and permission > 0);`, [], function (err, row) {
                resolve(row)
            })
        })
    }
    get_canvasses_list(canvas_id_list) {
        let str_canvas_id_list = data_list_stringify(canvas_id_list)
        return new Promise(function (resolve, reject) {
            db.get(`SELECT * FROM canvasses WHERE id IN (${str_canvas_id_list});`, [], function (err, row) {
                resolve(row)
            })
        })
    }
    get_notes_in_canvas(canvas_id) {
        return new Promise(function (resolve, reject) {
            db.get(`SELECT * FROM notes WHERE canvas_id = ${canvas_id};`, [], function (err, row) {
                resolve(row)
            })
        })
    }
    get_connections_in_canvas(canvas_id) {
        return new Promise(function (resolve, reject) {
            db.get(`SELECT * FROM connections WHERE canvas_id = ${canvas_id};`, [], function (err, row) {
                resolve(row)
            })
        })
    }
    get_pictures_in_canvas(canvas_id) {
        return new Promise(function (resolve, reject) {
            db.get(`SELECT * FROM pictures WHERE canvas_id = ${canvas_id};`, [], function (err, row) {
                resolve(row)
            })
        })
    }

    insert_user(user_nick) {
        let str_data_list = data_list_stringify(arguments);
        return new Promise(function (resolve, reject) {
            db.get(`INSERT INTO users (nick) VALUES (${str_data_list});";`, [], function (err, row) {
                resolve(row)
            })
        })
    }
    insert_canvas(title,owner_id) {
        let str_data_list = data_list_stringify(arguments);
        return new Promise(function (resolve, reject) {
            db.get(`INSERT INTO canvasses (title,owner_id) VALUES (${str_data_list});`, [], function (err, row) {
                resolve(row)
            })
        })
    }
    insert_canvas_permission(user_id,canvas_id,permission) {
        let str_data_list = data_list_stringify(arguments)
        return new Promise(function (resolve, reject) {
            db.get(`INSERT INTO canvasses_permissions (user_id,canvas_id,permission) VALUES (${str_data_list});`, [], function (err, row) {
                resolve(row)
            })
        })
    }
    insert_note(canvas_id,owner_id,coordinate_x,coordinate_y) {
        let str_data_list = data_list_stringify(arguments)
        return new Promise(function (resolve, reject) {
            db.get(`INSERT INTO notes (canvas_id,owner_id,coordinate_x,coordinate_y) VALUES (${str_data_list});`, [], function (err, row) {
                resolve(row)
            })
        })
    }
    insert_connection(canvas_id,owner_id,
                      origin_conn_type,origin_conn_id,origin_conn_pos_type,origin_conn_pos,
                      target_conn_type,target_conn_id,target_conn_pos_type,target_conn_pos) {
        let str_data_list = data_list_stringify(arguments)
        return new Promise(function (resolve, reject) {
            db.get(`INSERT INTO connections
                    (canvas_id,owner_id,
                    origin_conn_type,origin_conn_id,origin_conn_pos_type,origin_conn_pos,
                    target_conn_type,target_conn_id,target_conn_pos_type,target_conn_pos) 
                    VALUES (${str_data_list});`, [], function (err, row) {
                resolve(row)
            })
        })
    }
    insert_picture(canvas_id,owner_id,coordinate_x,coordinate_y,content) {
        let str_data_list = data_list_stringify(arguments)
        return new Promise(function (resolve, reject) {
            db.get(`INSERT INTO pictures (canvas_id,owner_id,coordinate_x,coordinate_y,content) VALUES (${str_data_list});`, [], function (err, row) {
                resolve(row)
            })
        })
    }

}

module.exports = {
    "db": db,
    "db_init": db_init,
    "check_db_empty": check_db_empty,
    "db_load_sample_data": db_load_sample_data,
    "end_work": end_work,
    "di":data_interaction
}

