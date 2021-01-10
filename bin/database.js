var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('./db_data/main.sqlite3')

function db_init(callback) {
    create_table("lorem","(info TEXT)" )
    create_table("poo","(boo TEXT)" )
    create_table("koo","(foo TEXT)" )
    callback()
}

function create_table(table_name,parameters) {
    console.log(`create_table: ${table_name} with ${parameters}`);
    db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='${table_name}'`, [],
        function (err, row) {
            // if (err){throw err}
            console.log(`table "${table_name}" exists: ${row !== undefined}`);
            if (row === undefined){
                db.run(`CREATE TABLE ${table_name} ${parameters}`,  [], function (err) { if (err){throw err}})
                console.log(`created table: ${table_name} ${parameters} ////`);
            } // if database did not returned a row with table
        })
}

function end_work() {
    db.close();
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

// db_init(end_work)

module.exports = {
    db_init: db_init,
    end_work:end_work
}

