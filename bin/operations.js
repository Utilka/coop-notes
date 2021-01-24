var db = require('../db_data/database.js')
var User = require("../lib/User.js")
var Note = require("../lib/Note.js")
var Connection = require("../lib/Connection.js")
var Canvas = require("../lib/Canvas.js")


db.db_init().then(function () {
    if ((global.gConfig.create_sample_data === true)) {
        db.check_db_empty(db.db_load_sample_data)
    }
})
//Check if canvas exist
//Create Canvas if no

//Get Canvases from db in list
