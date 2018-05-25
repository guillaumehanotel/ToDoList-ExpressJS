const db = require('../config/db');



class User {

    constructor(user_row){
        this.id = user_row.rowid;
        this.pseudo = user_row.pseudo;
        this.password = user_row.password;
        this.email = user_row.email;
        this.firstname = user_row.firstname;
        this.lastname = user_row.lastname;
        this.createdAt = user_row.createdAt;
        this.updatedAt = user_row.updatedAt;
    }



    // POST /users
    static create(user_data, callback){

    }

    // GET /users/:id
    static find(id, callback){

    }

    // GET /users
    static findAll(callback){

    }

    // PUT /users/:id
    static update(id, user_data, callback){

    }

    // DELETE /users/:id
    static delete(id, callback){

    }


}