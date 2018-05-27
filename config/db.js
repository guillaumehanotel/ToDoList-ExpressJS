const db = require('sqlite');


db.open('todolist_express.db').then(() => {

    createTableUsers();
    createTableSessions();
    createTableTodos();

});

function createTableUsers(){
    db.run("CREATE TABLE IF NOT EXISTS users (pseudo, password, email, firstname, lastname, createdAt, updatedAt)")
        .then(() => {
            console.log(('> Table users created'))
        }).catch((err) => {
            console.error('ERR> ', err)
        })
}

function createTableSessions(){
    db.run("CREATE TABLE IF NOT EXISTS sessions (userId, accessToken, createdAt, expiresAt)")
        .then(() => {
            console.log(('> Table sessions created'))
        }).catch((err) => {
        console.error('ERR> ', err)
    })
}

function createTableTodos(){
    db.run("CREATE TABLE IF NOT EXISTS todos (userId, message, createdAt, updatedAt, completedAt)")
        .then(() => {
            console.log(('> Table todos created'))
        }).catch((err) => {
        console.error('ERR> ', err)
    })
}



module.exports = db;