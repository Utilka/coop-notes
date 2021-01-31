var express = require('express');
var router = express.Router();
var db = require('../db_data/database')

// TODO GET USRER_ID
user_id = 3
user_name = "Ignat"

// return res.render('user_error', {
//     message: `User ${user_name} Have no Ca`
// })

router.get('/:canvasID', function(req, res, next) {

    if (req.params['canvasID'] === "empty"){
        db.di.insert_canvas("New Canvas", user_id).then(function(){
            res.redirect(`/`);
        }).catch(function (reason) {
            console.log(reason)
            res.render('user_error', {
                message: `Some Big Problem(((`,
                addition: reason.message
            })
        })
    }else{

        db.di.get_permitted_canvasses(user_id).then(p_canvases_ids => {

            let canvasID = parseInt(req.params['canvasID'], 10)
            if (p_canvases_ids.includes(canvasID)){

                db.di.get_canvas(canvasID).then(canvas => {

                    res.render('canvas', {
                        canvas: canvas,
                    })

                }).catch(function (reason) {
                    res.render('user_error', {
                        message: `No Canvas With ID = ${canvasID} Was Found or...`,
                        addition: reason.message
                    })
                })

            }else{
                res.render('user_error', {
                    message: `You have no permission to access canvas with id = ${canvasID}`,
                    addition: ''
                })
            }


        }).catch(function (reason) {
            console.log(reason)
            
            res.redirect(`/canvas/empty`)
        })
    }
})

module.exports = router;
