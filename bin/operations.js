var db = require('../db_data/database.js')


db.db_init().then(function () {
    if ((global.gConfig.create_sample_data === true)) {
        db.check_db_empty(db.db_load_sample_data)
    }
}).then(function () {
    // db.di.get_user(1).then(row => {console.log(row)}).catch(function (reason) {console.log(reason)})
    // db.di.get_user_by_nick("Kot").then(row => {console.log(row)}).catch(function (reason) {console.log(reason)})
    // db.di.get_permitted_canvasses(1).then(res => {
    //     console.log(res)
    // }).catch(function (reason) {
    //     console.log(reason)
    // })
    // db.di.get_canvasses_list([1,2,3]).then(row => {console.log(row)}).catch(function (reason) {console.log(reason)})
    // db.di.get_permitted_canvasses(2).then(db.di.get_canvasses_list).then(res => {
    //     console.log(res)
    // }).catch(function (reason) {
    //     console.log(reason)
    // })
    // db.di.check_user_canvas_permission(1, 1).then(res => {
    //     console.log(res)
    // }).catch(function (reason) {
    //     console.log(reason)
    // })
    // db.di.check_user_canvas_permission(1, 3).then(res => {
    //     console.log(res)
    // }).catch(function (reason) {
    //     console.log(reason)
    // })
    // db.di.check_user_canvas_permission(3, 3).then(res => {
    //     console.log(res)
    // }).catch(function (reason) {
    //     console.log(reason)
    // })
}).catch(function (reason) {
    throw `unable to initialize database| reason: ${reason}`
})

//Check if canvas exist
//Create Canvas if no

//Get Canvases from db in list