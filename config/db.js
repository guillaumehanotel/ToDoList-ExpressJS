const db = require('sqlite');


db.open('todolist_express.db').then(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (pseudo, password, email, firstname, lastname, createdAt, updatedAt)")
        .then(() => {
            console.log(('> Database ready'))
        }).catch((err) => {
        console.error('ERR> ', err)
    })
});


module.exports = db;