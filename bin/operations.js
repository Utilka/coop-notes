var db = require('./database')
var Canvas = require("../lib/Canvas.js")


/**
 * Working with Database.
 */

 db.db_init(db.end_work)

//Check if canvas exist
    //Create Canvas if no

//Get Canvases from db in list
var canvas1 = new Canvas(1, "Canvas1", "1")
var canvas2 = new Canvas(2, "Canvas2", "1")

var canvList = [canvas1, canvas2]


// for(var i=0;i<canvList.length;i++){

// }

module.exports = {
    canvList: canvList
}