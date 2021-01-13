var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('./db_data/main.sqlite3')

function db_init() {
    return new Promise(function (resolve, reject) {
        check_table_exist("lorem").then(create_table_constr("lorem", "(info TEXT)"))
        check_table_exist("foo").then(create_table_constr("foo", "(boo TEXT)"))
        resolve()
    })
}

// function create_table(table_name, parameters) {
//     console.log(`create_table: ${table_name} with ${parameters}`);
//     db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='${table_name}'`, [],
//         function (err, row) {
//             // if (err){throw err}
//             console.log(`table "${table_name}" exists: ${row !== undefined}`);
//             if (row === undefined) {
//                 db.run(`CREATE TABLE ${table_name} ${parameters}`, [], function (err) {
//                     if (err) {
//                         throw err
//                     }
//                 })
//                 console.log(`created table: ${table_name} ${parameters} ////`);
//             } // if database did not returned a row with table
//         })
// }

function check_table_exist(table_name) {
    return new Promise(function (resolve, reject) {
        db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='${table_name}'`, [],
            function (err, row) {
                console.log(`table ${table_name} exist: ${row !== undefined}`);
                if (err) {
                    reject(err)
                }
                if (row !== undefined) {
                    resolve(row.name)
                } else {
                    resolve(undefined)
                }
            })
    })
}

// function create_table(table_name, parameters) {
//     return new Promise(function (resolve, reject) {
//         db.run(`CREATE TABLE ${table_name} ${parameters}`, [], function (err) {
//             if (err) {
//                 reject(err)
//             }
//             else {
//                 console.log(`created table: ${table_name} ${parameters}`)
//                 resolve()
//             }
//         })
//     })
// }

function create_table_constr(table_name, parameters) {
    return function (table_exists) {
        if (table_exists === undefined) {
            db.run(`CREATE TABLE ${table_name} ${parameters}`, [], function (err) {
                if (err) {
                    throw err
                } else {
                    console.log(`created table: ${table_name} ${parameters}`)
                }
            })
        }

    }
}

function end_work() {
    db.close();
    console.log("database closed")
}

db.serialize(function () {

    // db.run('CREATE TABLE lorem (info TEXT)')
    // var stmt = db.prepare('INSERT INTO lorem VALUES (?)')
    //
    // for (var i = 0; i < 10; i++) {
    //     stmt.run('Ipsum ' + i)
    // }
    //
    // stmt.finalize()
    //
    // db.each('SELECT rowid AS id, info FROM lorem', function (err, row) {
    //     console.log(row.id + ': ' + row.info);
    // })
})

module.exports = {
    "db": db,
    "db_init": db_init,
    "end_work": end_work
}

