var db = require('./database')
var User = require("../lib/User.js")
var Note = require("../lib/Note.js")
var Connection = require("../lib/Connection.js")
var Canvas = require("../lib/Canvas.js")


/**
 * Working with Database.
 */

// db.db_init(db.end_work)
db.db_init().then(db.end_work)
//Check if canvas exist
//Create Canvas if no

//Get Canvases from db in list

//Temporary data init
var users = [
    new User(1, "User Kot"),
    new User(2, "User Foo"),
    new User(3, "User ShiZ")
]

var canv = [
    new Canvas(1, "Canvas1", users[0]),
    new Canvas(2, "Canvas2", users[0]),
    new Canvas(3, "Canvas3", users[1])
]

var notes0 = [
    new Note(1, "Note1", users[0], [10, 100]),
    new Note(2, "Note2", users[0], [500, 100]),
    new Note(3, "Note3", users[1], [1000, 500]),
    new Note(4, "Note4", users[1], [500, 500])
]
canv[0].notes = notes0

var notes1 = [
    new Note(5, "Note5", users[0], [200, 100]),
    new Note(6, "Note6", users[0], [-200, 100]),
    new Note(7, "Note7", users[2], [0, -200]),
    new Note(8, "Note8", users[2], [-100, -400])
]
canv[1].notes = notes1

var notes2 = [
    new Note(9, "Note9", users[1], [-200, -200]),
    new Note(10, "Note10", users[1], [200, -200]),
    new Note(11, "Note11", users[2], [200, 200]),
    new Note(12, "Note12", users[2], [-200, 200])
]
canv[2].notes = notes2

var connections0 = [
    new Connection(1, users[0],
        notes1[0], "note", "auto", undefined,
        notes1[1], "note", "auto", undefined,
    ),
    new Connection(2, users[1],
        notes1[0], "note", "auto", undefined,
        notes1[2], "note", "auto", undefined,
    ),
    new Connection(3, users[1],
        notes1[1], "note", "auto", undefined,
        notes1[3], "note", "auto", undefined,
    ),
    new Connection(4, users[1],
        notes1[1], "note", "auto", undefined,
        notes1[2], "note", "auto", undefined,
    ),
    new Connection(5, users[1],
        notes1[2], "note", "auto", undefined,
        notes1[3], "note", "auto", undefined,
    )
]
canv[0].connections = connections0

var connections1 = [
    new Connection(6, users[0],
        notes2[0], "note", "auto", undefined,
        notes2[2], "note", "auto", undefined,
    ),
    new Connection(7, users[0],
        notes2[2], "note", "auto", undefined,
        notes2[3], "note", "auto", undefined,
    ),
]
connections1[2] = new Connection(8, users[2],
    "note", notes2[2], "auto", undefined,
    "connection", connections1[1], "auto", undefined,
)
canv[1].connections = connections1

var connections2 = [
    new Connection(9, users[0],
        notes2[0], "note", "auto", undefined,
        notes2[1], "note", "auto", undefined,
    ),
    new Connection(10, users[1],
        notes2[1], "note", "auto", undefined,
        undefined, "free", "absolute", [300, -300],
    ),
    new Connection(11, users[3],
        undefined, "free", "absolute", [-300, -300],
        notes2[0], "note", "auto", undefined,
    ),
    new Connection(12, users[2],
        notes2[2], "note", "auto", undefined,
        notes2[3], "note", "auto", undefined,
    ),
    new Connection(13, users[3],
        notes2[3], "note", "auto", undefined,
        undefined, "free", "absolute", [-300, 300],
    ),
    new Connection(14, users[3],
        undefined, "free", "absolute", [300, 300],
        notes2[2], "note", "auto", undefined,
    )
]

canv[2].connections = connections2

var canvList = canv


// for(var i=0;i<canvList.length;i++){

// }

module.exports = {
    canvList: canvList
}