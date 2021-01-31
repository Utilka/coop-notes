let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./db_data/main.sqlite3');
let User = require('../lib/User')
let Canvas = require('../lib/Canvas');
let Note = require('../lib/Note');
let Connection = require('../lib/Connection');
let Picture = require('../lib/Picture')

var crypto = require('crypto');

class ObjectNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "ObjectNotFoundError";
    }
}

function db_init() {
    return new Promise(function (resolve, reject) {
        db.serialize(function () {
            db.run(`PRAGMA foreign_keys = ON;`, function (err) {
                if (err) {
                    err = (`Unable to initialize database  err :${err}`)
                    reject(err)
                }
            });

            db.run(`CREATE TABLE IF NOT EXISTS "users" (
                "id" INTEGER PRIMARY KEY,
                "nick" TEXT NOT NULL UNIQUE,
                "password" TEXT, -- sha256 hash of the plain-text password
                "salt" TEXT, -- salt that is appended to the password before it is hashed
                "settings" TEXT
                );`, function (err) {
                if (err) {
                    err = (`Unable to initialize database  err :${err}`)
                    reject(err)
                }
            });

            db.run(`CREATE TABLE IF NOT EXISTS "canvasses" (
                "id" INTEGER PRIMARY KEY,
                "title" TEXT,
                "owner_id" INTEGER,
                "created_at" INTEGER DEFAULT (strftime('%s','now')),
                "default_perm" INTEGER DEFAULT (0), -- ENUM ('none','read','write')
                "settings" TEXT,
                    FOREIGN KEY (owner_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE
                );`, function (err) {
                if (err) {
                    err = (`Unable to initialize database  err :${err}`)
                    reject(err)
                }
            });

            db.run(`CREATE TABLE IF NOT EXISTS "canvasses_permissions" (
                "user_id" INTEGER NOT NULL,
                "canvas_id" INTEGER NOT NULL,
                "permission" INTEGER, -- ENUM ('none','read','write')
                    PRIMARY KEY(user_id,canvas_id)
                    FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE
                    FOREIGN KEY (canvas_id) REFERENCES canvasses (id) ON UPDATE CASCADE ON DELETE CASCADE
                );`, function (err) {
                if (err) {
                    err = (`Unable to initialize database  err :${err}`)
                    reject(err)
                }
            });

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
                );`, function (err) {
                if (err) {
                    err = (`Unable to initialize database  err :${err}`)
                    reject(err)
                }
            });

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
                `, function (err) {
                if (err) {
                    err = (`Unable to initialize database  err :${err}`)
                    reject(err)
                }
            });
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
                `, function (err) {
                if (err) {
                    err = (`Unable to initialize database  err :${err}`)
                    reject(err)
                }
            });

            db.run(`CREATE TRIGGER IF NOT EXISTS note_last_edited_upd AFTER UPDATE OF last_editor_id ON notes
                BEGIN
                    UPDATE notes SET last_edited_at=strftime('%s','now') WHERE id = NEW.id;
                END;
                `, function (err) {
                if (err) {
                    err = (`Unable to initialize database  err :${err}`)
                    reject(err)
                }
            });
            db.run(`CREATE TRIGGER IF NOT EXISTS conn_last_edited_upd AFTER UPDATE OF last_editor_id ON connections
                BEGIN
                    UPDATE connections SET last_edited_at=strftime('%s','now') WHERE id = NEW.id;
                END;
                `, function (err) {
                if (err) {
                    err = (`Unable to initialize database  err :${err}`)
                    reject(err)
                }
            });
            db.run(`CREATE TRIGGER IF NOT EXISTS pic_last_edited_upd AFTER UPDATE OF last_editor_id ON pictures
                BEGIN
                    UPDATE pictures SET last_edited_at=strftime('%s','now') WHERE id = NEW.id;
                END;
                `, function (err) {
                if (err) {
                    err = (`Unable to initialize database  err :${err}`)
                    reject(err)
                }
            });

            db.run(`CREATE TRIGGER IF NOT EXISTS note_last_editor_init AFTER INSERT ON notes
                BEGIN
                    UPDATE notes SET last_editor_id=NEW.owner_id WHERE id = NEW.id;
                END;
                `, function (err) {
                if (err) {
                    err = (`Unable to initialize database  err :${err}`)
                    reject(err)
                }
            });
            db.run(`CREATE TRIGGER IF NOT EXISTS conn_last_editor_init AFTER INSERT ON connections
                BEGIN
                    UPDATE connections SET last_editor_id=NEW.owner_id WHERE id = NEW.id;
                END;
                `, function (err) {
                if (err) {
                    err = (`Unable to initialize database  err :${err}`)
                    reject(err)
                }
            });
            db.run(`CREATE TRIGGER IF NOT EXISTS pic_last_editor_init AFTER INSERT on pictures
                BEGIN
                    UPDATE pictures SET last_editor_id=NEW.owner_id WHERE id = NEW.id;
                END;
                `, function (err) {
                if (err) {
                    err = (`Unable to initialize database  err :${err}`)
                    reject(err)
                }
            });
            console.log("initialized database")
        })
        resolve()
    })
}


function hashPassword(password, salt) {
    var hash = crypto.createHash('sha256');
    hash.update(password);
    hash.update(salt);
    return hash.digest('hex');
}

function create_user(nick, password, salt) {
    let res = new User(null, nick)
    res.password = hashPassword(password, salt)
    res.salt = salt
    return res
}

function db_load_sample_data() {
    return new Promise(function (resolve, reject) {
        let users = [create_user("Kot", "12345678", "123"),
            create_user("Ignat", "asdfgjkl", "123"),
            create_user("ShiZ", "<>asd", "123"),]
        db.serialize(function () {
            db.run(`INSERT INTO users (nick,password,salt) VALUES
                ("${users[0].nick}","${users[0].password}","${users[0].salt}"),
                ("${users[1].nick}","${users[1].password}","${users[1].salt}"),
                ("${users[2].nick}","${users[2].password}","${users[2].salt}");
                `, function (err) {
                if (err) {
                    err = (`Unable to insert sample data err :${err}`)
                    reject(err)
                }
            });
            db.run(`INSERT INTO canvasses (title,owner_id) VALUES
                ("Canvas1",1),
                ("Canvas2",1),
                ("Canvas3",2);
                `, function (err) {
                if (err) {
                    err = (`Unable to insert sample data err :${err}`)
                    reject(err)
                }
            });
            db.run(`INSERT INTO canvasses_permissions (user_id,canvas_id,permission) VALUES
                (2,1,2),
                (3,1,1),
                (1,3,2);
                `, function (err) {
                if (err) {
                    err = (`Unable to insert sample data err :${err}`)
                    reject(err)
                }
            });
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
                `, function (err) {
                if (err) {
                    err = (`Unable to insert sample data err :${err}`)
                    reject(err)
                }
            });
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
                `, function (err) {
                if (err) {
                    err = (`Unable to insert sample data err :${err}`)
                    reject(err)
                }
            });
        })
        resolve()
    })
}

function check_db_empty() {
    return new Promise(function (resolve, reject) {
        db.get("SELECT id FROM users;", [], function (err, row) {
            if (err) {
                reject(err)
            }
            if (row === undefined) {
                resolve()
            } else {
                reject("db is not empty")
            }
        })
    })
}

function end_work() {
    db.close();
    console.log("database closed")
}

function data_dict_stringify(data_dict) {
    // {"key":"value"}
    let data_string = ""
    Object.entries(data_dict).forEach(([key, value]) => {
        data_string += `${key} = "${value}",`
    });
    data_string = data_string.substring(0, data_string.length - 1);
    return data_string;
}

function data_list_stringify(data_list) {
    let data_string = ""
    Object.entries(data_list).forEach(([key, value]) => {
        data_string += `"${value}",`
    });
    data_string = data_string.substring(0, data_string.length - 1);
    return data_string;
}

class Data_interaction {
    static get_user(user_id) {
        return new Promise(function (resolve, reject) {
            db.get(`SELECT id,nick,settings FROM users WHERE id = ${user_id};`, [], function (err, row) {
                if (err) {
                    err = `Unable to SELECT user with id ${user_id}| err :${err}`
                    reject(err)
                }
                if (row !== undefined) {
                    let res = new User()
                    Object.assign(res, row)
                    resolve(res)
                } else {
                    reject(new ObjectNotFoundError(`No user with id ${user_id} were found`))
                }

            })
        })
    }

    static get_canvas(canvas_id) {
        return new Promise(function (resolve, reject) {
            db.get(`SELECT * FROM canvasses WHERE id = ${canvas_id};`, [], function (err, row) {
                if (err) {
                    err = (`Unable to SELECT canvas with id ${canvas_id}| err :${err}`)
                    reject(err)
                }
                if (row !== undefined) {
                    let res = new Canvas()
                    Object.assign(res, row)
                    resolve(res)
                } else {
                    reject(new ObjectNotFoundError(`No canvas with id ${canvas_id} were found`))
                }

            })
        })
    }

    static get_canvas_permission(user_id, canvas_id) {
        return new Promise(function (resolve, reject) {
            db.get(`SELECT * FROM canvasses_permissions WHERE (user_id = ${user_id} and canvas_id = ${canvas_id});`, [], function (err, row) {
                if (err) {
                    err = (`Unable to SELECT canvas_permission with U_id ${user_id}, C_id ${canvas_id} | err :${err}`)
                    reject(err)
                }
                if (row !== undefined) {
                    resolve(row)
                } else {
                    reject(new ObjectNotFoundError(`No canvas_permission with id ${user_id} ${canvas_id} were found`))
                }


            })
        })
    }

    static get_note(note_id) {
        return new Promise(function (resolve, reject) {
            db.get(`SELECT * FROM notes WHERE id = ${note_id};`, [], function (err, row) {
                if (err) {
                    err = (`Unable to SELECT note with id ${note_id}| err :${err}`)
                    reject(err)
                }
                if (row !== undefined) {
                    let res = new Note()
                    Object.assign(res, row)
                    resolve(res)
                } else {
                    reject(new ObjectNotFoundError(`No note with id ${user_id} were found`))
                }

            })
        })
    }

    static get_connection(connection_id) {
        return new Promise(function (resolve, reject) {
            db.get(`SELECT * FROM connections WHERE id = ${connection_id};`, [], function (err, row) {
                if (err) {
                    err = (`Unable to SELECT connection with id ${connection_id}| err :${err}`)
                    reject(err)
                }
                if (row !== undefined) {
                    let res = new Connection()
                    Object.assign(res, row)
                    resolve(res)
                } else {
                    reject(new ObjectNotFoundError(`No connection with id ${connection_id} were found`))
                }

            })
        })
    }

    static get_picture(picture_id) {
        return new Promise(function (resolve, reject) {
            db.get(`SELECT * FROM pictures WHERE id = ${picture_id};`, [], function (err, row) {
                if (err) {
                    err = (`Unable to SELECT picture with id ${picture_id}| err :${err}`)
                    reject(err)
                }
                if (row !== undefined) {
                    let res = new Picture()
                    Object.assign(res, row)
                    resolve(res)
                } else {
                    reject(new ObjectNotFoundError(`No picture with id ${picture_id} were found`))
                }

            })
        })
    }

    static upd_user(user_id, data) {
        let data_string = data_dict_stringify(data)
        return new Promise(function (resolve, reject) {
            db.run(`UPDATE users SET ${data_string} WHERE id = ${user_id};`, [], function (err) {
                if (err) {
                    err = (`Unable to update user with id ${user_id} and data ${data_string}| err :${err}`)
                    reject(err)
                }
                resolve()
            })
        })
    }

    static upd_canvas(canvas_id, data) {
        let data_string = data_dict_stringify(data)
        return new Promise(function (resolve, reject) {
            db.run(`UPDATE canvasses SET ${data_string} WHERE id = ${canvas_id};`, [], function (err) {
                if (err) {
                    err = (`Unable to update canvas with id ${canvas_id} and data ${data_string}| err :${err}`)
                    reject(err)
                }
                resolve()
            })
        })
    }

    static upd_canvas_permission(user_id, canvas_id, data) {
        let data_string = data_dict_stringify(data)
        return new Promise(function (resolve, reject) {
            db.run(`UPDATE canvasses_permissions SET ${data_string} WHERE (user_id = ${user_id} and canvas_id = ${canvas_id});`, [], function (err) {
                if (err) {
                    err = (`Unable to update canvas_permission with u_id ${user_id}, c_id ${canvas_id} and data ${data_string}| err :${err}`)
                    reject(err)
                }
                resolve()
            })
        })
    }

    static upd_note(note_id, data) {
        let data_string = data_dict_stringify(data)
        return new Promise(function (resolve, reject) {
            db.run(`UPDATE notes SET ${data_string} WHERE id = ${note_id};`, [], function (err) {
                if (err) {
                    err = (`Unable to update note with id ${note_id} and data ${data_string}| err :${err}`)
                    reject(err)
                }
                resolve()
            })
        })
    }

    static upd_connection(connection_id, data) {
        let data_string = data_dict_stringify(data)
        return new Promise(function (resolve, reject) {
            db.run(`UPDATE connections SET ${data_string} WHERE id = ${connection_id};`, [], function (err) {
                if (err) {
                    err = (`Unable to update connection with id ${connection_id} and data ${data_string}| err :${err}`)
                    reject(err)
                }
                resolve()
            })
        })
    }

    static upd_picture(picture_id, data) {
        let data_string = data_dict_stringify(data)
        return new Promise(function (resolve, reject) {
            db.run(`UPDATE pictures SET ${data_string} WHERE id = ${picture_id};`, [], function (err) {
                if (err) {
                    err = (`Unable to update picture with id ${picture_id} and data ${data_string}| err :${err}`)
                    reject(err)
                }
                resolve()
            })
        })
    }

    static get_user_by_nick(user_nick) {
        return new Promise(function (resolve, reject) {
            db.get(`SELECT id,nick,settings FROM users WHERE nick = "${user_nick}";`, [], function (err, row) {
                if (err) {
                    err = (`Unable to select user with nick ${user_nick}| err :${err}`)
                    reject(err)
                }
                if ((row !== undefined)) {
                    let res = new User()
                    Object.assign(res, row)
                    resolve(res)
                } else {
                    reject(new ObjectNotFoundError(`No user with nick ${user_nick} were found`))
                }

            })
        })
    }

    static get_permitted_canvasses(user_id) {
        // returns list of canvas id that user can access
        return new Promise(function (resolve, reject) {
            let res = []
            db.all(`SELECT * FROM canvasses_permissions WHERE (user_id = ${user_id} and permission > 0);`, [], function (err, rows) {
                if (err) {
                    err = (`Unable to select permitted_canvasses with user_id ${user_id}| err :${err}`)
                    reject(err)
                }

                if ((rows !== undefined) && (rows.length > 0)) {
                    rows.forEach(row => {
                        res.push(row.canvas_id)
                    });
                }

                db.all(`SELECT id FROM canvasses WHERE (default_perm > 0) OR (owner_id = ${user_id});`, [], function (err, rows) {
                    if (err) {
                        err = (`Unable to select canvasses with (default_perm > 0) OR (owner_id = ${user_id})| err :${err}`)
                        reject(err)
                    }
                    if ((rows !== undefined) && (rows.length > 0)) {
                        rows.forEach(row => {
                            res.push(row.id)
                        });
                    }
                    if (res.length === 0) {
                        reject(new ObjectNotFoundError(`User with id ${user_id} can't access any canvasses`))
                    }
                    res = Array.from([...new Set(res)]); // remove duplicates
                    resolve(res)
                })
            })
        })
    }

    static get_canvasses_list(canvas_id_list) {
        let str_canvas_id_list = data_list_stringify(canvas_id_list)
        return new Promise(function (resolve, reject) {
            db.all(`SELECT * FROM canvasses WHERE id IN (${str_canvas_id_list});`, [], function (err, rows) {
                if (err) {
                    err = (`Unable to select canvases with id ${canvas_id_list}| err :${err}`)
                    reject(err)
                }
                if ((rows !== undefined) && (rows.length > 0)) {
                    let res = []
                    rows.forEach(row => {
                        let res_row = new Canvas() // specify type of object
                        Object.assign(res_row, row)
                        res.push(res_row)
                    });
                    resolve(res)
                } else {
                    reject(new ObjectNotFoundError(`No canvases with id ${canvas_id_list}`))
                }
            })
        })
    }

    static get_notes_in_canvas(canvas_id) {
        return new Promise(function (resolve, reject) {
            db.all(`SELECT * FROM notes WHERE canvas_id = ${canvas_id};`, [], function (err, rows) {
                if (err) {
                    err = (`Unable to select notes with canvas_id ${canvas_id}| err :${err}`)
                    reject(err)
                }
                if ((rows !== undefined) && (rows.length > 0)) {
                    let res = []
                    rows.forEach(row => {
                        let res_row = new Note() // specify type of object
                        Object.assign(res_row, row)
                        res.push(res_row)
                    });
                    resolve(res)
                } else {
                    reject(new ObjectNotFoundError(`No notes with canvas_id ${canvas_id}`))
                }
            })
        })
    }

    static get_connections_in_canvas(canvas_id) {
        return new Promise(function (resolve, reject) {
            db.all(`SELECT * FROM connections WHERE canvas_id = ${canvas_id};`, [], function (err, rows) {
                if (err) {
                    err = (`Unable to select connections with canvas_id ${canvas_id}| err :${err}`)
                    reject(err)
                }
                if ((rows !== undefined) && (rows.length > 0)) {
                    let res = []
                    rows.forEach(row => {
                        let res_row = new Connection() // specify type of object
                        Object.assign(res_row, row)
                        res.push(res_row)
                    });
                    resolve(res)
                } else {
                    reject(new ObjectNotFoundError(`No connections with canvas_id ${canvas_id}`))
                }
            })
        })
    }

    static get_pictures_in_canvas(canvas_id) {
        return new Promise(function (resolve, reject) {
            db.all(`SELECT * FROM pictures WHERE canvas_id = ${canvas_id};`, [], function (err, rows) {
                if (err) {
                    err = (`Unable to select pictures with canvas_id ${canvas_id}| err :${err}`)
                    reject(err)
                }
                if ((rows !== undefined) && (rows.length > 0)) {
                    let res = []
                    rows.forEach(row => {
                        let res_row = new Picture() // specify type of object
                        Object.assign(res_row, row)
                        res.push(res_row)
                    });
                    resolve(res)
                } else {
                    reject(new ObjectNotFoundError(`No pictures with canvas_id ${canvas_id}`))
                }
            })
        })
    }

    static insert_user(user_nick, password) {
        let salt = "123"; // TODO generate salt securely
        let hashedPass = hashPassword(password, salt);
        let str_data_list = data_list_stringify({user: user_nick, password: hashedPass, salt: salt});
        return new Promise(function (resolve, reject) {
            db.get(`INSERT INTO users (nick,password,salt) VALUES (${str_data_list});`, [], function (err) {
                if (err) {
                    err = (`Unable to insert user with user_nick ${user_nick}| err :${err}`)
                    reject(err)
                }
                resolve()
            })
        })
    }

    static insert_canvas(title, owner_id) {
        let str_data_list = data_list_stringify(arguments);
        return new Promise(function (resolve, reject) {
            db.get(`INSERT INTO canvasses (title,owner_id) VALUES (${str_data_list});`, [], function (err) {
                if (err) {
                    err = (`Unable to insert canvas with user_nick ${title} owner_id ${owner_id}| err :${err}`)
                    reject(err)
                }
                resolve()
            })
        })
    }

    static insert_canvas_permission(user_id, canvas_id, permission) {
        let str_data_list = data_list_stringify(arguments)
        return new Promise(function (resolve, reject) {
            db.get(`INSERT INTO canvasses_permissions (user_id,canvas_id,permission) VALUES (${str_data_list});`, [], function (err) {
                if (err) {
                    err = (`Unable to insert canvas_permission with user_id ${user_id} canvas_id ${canvas_id}| err :${err}`)
                    reject(err)
                }
                resolve()
            })
        })
    }

    static insert_note(canvas_id, owner_id, coordinate_x, coordinate_y) {
        let str_data_list = data_list_stringify(arguments)
        return new Promise(function (resolve, reject) {
            db.get(`INSERT INTO notes (canvas_id,owner_id,coordinate_x,coordinate_y) VALUES (${str_data_list});`, [], function (err) {
                if (err) {
                    err = (`Unable to insert note with canvas_id ${canvas_id} owner_id ${owner_id}| err :${err}`)
                    reject(err)
                }
                resolve()
            })
        })
    }

    static insert_connection(canvas_id, owner_id,
                             origin_conn_type, origin_conn_id, origin_conn_pos_type, origin_conn_pos,
                             target_conn_type, target_conn_id, target_conn_pos_type, target_conn_pos) {
        let str_data_list = data_list_stringify(arguments)
        return new Promise(function (resolve, reject) {
            db.get(`INSERT INTO connections
                    (canvas_id,owner_id,
                    origin_conn_type,origin_conn_id,origin_conn_pos_type,origin_conn_pos,
                    target_conn_type,target_conn_id,target_conn_pos_type,target_conn_pos) 
                    VALUES (${str_data_list});`, [], function (err) {
                if (err) {
                    err = (`Unable to insert connection with canvas_id ${canvas_id} owner_id ${owner_id}| err :${err}`)
                    reject(err)
                }
                resolve()
            })
        })
    }

    static insert_picture(canvas_id, owner_id, coordinate_x, coordinate_y, content) {
        let str_data_list = data_list_stringify(arguments)
        return new Promise(function (resolve, reject) {
            db.get(`INSERT INTO pictures (canvas_id,owner_id,coordinate_x,coordinate_y,content) VALUES (${str_data_list});`, [], function (err) {
                if (err) {
                    err = (`Unable to insert picture with canvas_id ${canvas_id} owner_id ${owner_id}| err :${err}`)
                    reject(err)
                }
                resolve()
            })
        })
    }

    static check_user_canvas_permission(user_id, canvas_id) {
        //returns permission value
        return new Promise(function (resolve, reject) {
            Data_interaction.get_canvas_permission(user_id, canvas_id).then(function (row) {
                resolve(row.permission)
            }).catch(function (reason) {
                if (reason.name === "ObjectNotFoundError") {
                    db.get(`SELECT owner_id,default_perm FROM canvasses WHERE id = ${canvas_id}`, [], function (err, row) {
                        if (err) {
                            err = (`Unable to SELECT FROM canvas with id = ${canvas_id} | err :${err}`)
                            reject(err)
                        }
                        if ((row !== undefined)) {
                            if (row.owner_id === user_id) {
                                resolve(2) // if user is owner then give them write access
                            } else {
                                resolve(row.default_perm)
                            }
                        } else {
                            reject(new ObjectNotFoundError(`No canvas with id ${canvas_id} were found`))
                        }


                    })

                } else {
                    // reject(reason)
                }
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
    "di": Data_interaction
}

