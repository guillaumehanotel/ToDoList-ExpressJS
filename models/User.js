const db = require('../config/db');



class User {

    constructor(user_row){
        this._id = user_row.rowid;
        this._pseudo = user_row.pseudo;
        this._password = user_row.password;
        this._email = user_row.email;
        this._firstname = user_row.firstname;
        this._lastname = user_row.lastname;
        this._createdAt = user_row.createdAt;
        this._updatedAt = user_row.updatedAt;
    }


    // POST /users
    static create(user_data, callback, next){

        let timestamp = require('../helpers/helper').getTimestampWithHours();
        user_data.push(timestamp);
        user_data.push(null);

        let query_insert_user = "INSERT INTO users (pseudo, password, email, firstname, lastname, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)";

        db.run(query_insert_user, user_data)
            .then((data) => {
                let lastID = data.lastID;
                callback(lastID);
            })
            .catch(next);
    }

    // GET /users/:id
    static find(id, callback, next){

        let query_select_user = "SELECT rowid, * FROM users WHERE rowid = ?";

        db.get(query_select_user, id)
            .then((row) => {
                callback(row);
            })
            .catch(next);
    }


    static findByEmail(email, callback, next){

        let query_select_user = "SELECT rowid, * FROM users WHERE email = ?";

        db.get(query_select_user, email)
            .then((row) => {
                callback(row);
            })
            .catch(next)

    }


    // GET /users
    static findAll(callback, next){
        db.all("SELECT rowid, * FROM users")
            .then((rows) => {
                callback(rows);
            })
            .catch(next)
    }

    // PUT /users/:id
    static update(id, user_data, callback, next){

        let timestamp = require('../helpers/helper').getTimestampWithHours();
        user_data.push(timestamp);
        user_data.push(id);

        let query_update_user = "UPDATE users SET pseudo = ?, password = ?, email = ?, firstname = ?, lastname = ?, updatedAt = ? WHERE rowid = ?";

        db.run(query_update_user, user_data)
            .then(() => {
                callback();
            })
            .catch(next)

    }

    // DELETE /users/:id
    static delete(id, callback, next){

        let query_delete_user = "DELETE FROM users WHERE rowid = ?";

        db.run(query_delete_user, id)
            .then(() => {
                callback();
            })
            .catch(next)

    }


    toString(){
        return "[User " + this._id + "] " + this._pseudo;
    }

    // GETTERS
    get id() {
        return this._id;
    }

    get pseudo(){
        return this._pseudo;
    }

    get password() {
        return this._password;
    }

    get email() {
        return this._email;
    }

    get firstname() {
        return this._firstname;
    }

    get lastname() {
        return this._lastname;
    }

    get createdAt() {
        return this._createdAt;
    }

    get updatedAt() {
        return this._updatedAt;
    }


}



module.exports = User;