var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('./db_data/main.sqlite3')

function db_init() {
    create_table("lorem","(info TEXT)" )
    create_table("loo","(boo TEXT)" )
    create_table("joo","(foo TEXT)" )

}
function create_table(table_name,parameters) {
    console.log(`create_table: ${table_name} with ${parameters}`);
    db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='${table_name}'`, [],
        function (err, row) {
            console.log(`table "${table_name}" exists: ${row !== undefined}`);
            if (row === undefined){
                db.run(`CREATE TABLE ${table_name} ${parameters}`,  [], function (err) {throw err})
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


db_init()
end_work()

// module.exports = {
//     db : db,
//     check_table_exist: check_table_exist,
//     end_work:end_work
// }