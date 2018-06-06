const db = require('../config/db');
const helper = require('../helpers/helper');

class Todo {

    // (userId, message, createdAt, updatedAt, completedAt)

    constructor(rowTodo){

        this._id = rowTodo.rowid;
        this._userId = rowTodo.userId;
        this._message = rowTodo.message;
        this._createdAt = rowTodo.createdAt;
        this._updatedAt = rowTodo.updatedAt;
        this._completedAt = rowTodo.completedAt;

    }

    // POST /todos
    static create(todo_data, callback, next){

        let timestamp_now = helper.getTimestampWithHours();

        todo_data.push(timestamp_now);
        todo_data.push(null);
        todo_data.push(null);

        let query_insert_todo = "INSERT INTO todos  (userId, message, createdAt, updatedAt, completedAt) VALUES (?, ?, ?, ?, ?)";

        db.run(query_insert_todo, todo_data)
            .then((data) => {
                let lastID = data.lastID;
                callback(lastID);
            })
            .catch(next);
    }


    // GET /todos/:todoId
    static find(id, callback, next){

        let query_select_todo = "SELECT rowid, * FROM todos WHERE rowid = ?";

        db.get(query_select_todo, id)
            .then((row) => {
                callback(row);
            })
            .catch(next);
    }


    static findByUserId(userId, callback, next){

        let query_select_todo = "SELECT rowid, * FROM todos WHERE userId = ? ORDER BY completedAt";

        db.all(query_select_todo, userId.toString())
            .then((row) => {
                callback(row);
            })
            .catch(next);
    }



    // GET /todos
    static findAll(callback, next){
        db.all("SELECT rowid, * FROM todos")
            .then((rows) => {
                callback(rows);
            })
            .catch(next)
    }

    // PUT /todos/:id
    static update(id, todo_data, callback, next){

        todo_data.push(id);

        let query_update_todo = "UPDATE todos SET userId = ?, message = ?, updatedAt = ?, completedAt = ? WHERE rowid = ?";

        db.run(query_update_todo, todo_data)
            .then(() => {
                callback();
            })
            .catch(next)
    }


    // DELETE /todos/:id
    static delete(id, callback, next){

        let query_delete_todo = "DELETE FROM todos WHERE rowid = ?";

        db.run(query_delete_todo, id)
            .then(() => {
                callback();
            })
            .catch(next)

    }



    get id() {
        return this._id;
    }

    get userId() {
        return this._userId;
    }

    get message() {
        return this._message;
    }

    get createdAt() {
        return this._createdAt;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    get completedAt() {
        return this._completedAt;
    }

    toString(){
        return "[Todo " + this._id + "] userId : " + this._userId + " msg : " + this._message;
    }

}



module.exports = Todo;