const db = require('../config/db');
const helper = require('../helpers/helper');



class Session {

    constructor(session_row){
        this._userId = session_row.userId;
        this._accessToken = session_row.accessToken ;
        this._createdAt = session_row.createdAt;
        this._expiresAt = session_row.expiresAt;
    }



    static create(userId, callback, next){

        require('crypto').randomBytes(48, function (err, buffer) {
            let token = buffer.toString('hex');
            let timestamp_now = helper.getTimestampWithHours();
            let timestamp_1_hour = helper.getTimestampWithHours(1);

            let session_data = [userId, token, timestamp_now, timestamp_1_hour];
            let query_insert_session = "INSERT INTO sessions (userId, accessToken, createdAt, expiresAt) VALUES (?, ?, ?, ?)";

            db.run(query_insert_session, session_data)
                .then((row) => {
                    callback(row);
                })
                .catch(next);
        })
    }


    static find(userId, callback, next){
        let query_get_session = "SELECT * FROM sessions WHERE userId = ?";

        db.get(query_get_session, userId)
            .then((rowSession) => {
                callback(rowSession);
            })
            .catch(next);
    }


    static findByToken(token, callback, next){

        let query_get_session = "SELECT * FROM sessions WHERE accessToken = ?";

        db.get(query_get_session, token)
            .then((rowSession) => {
                callback(rowSession);
            })
            .catch((err) => {
                console.log(err)
            });
    }



    static delete(token, callback, next){

        let query_delete_session = "DELETE FROM sessions WHERE accessToken = ?";

        db.run(query_delete_session, token)
            .then(() => {
                callback();
            })
            .catch(next)
    }


    static truncate(callback, next){

        let query_truncate= "DELETE FROM sessions";

        db.run(query_truncate)
            .then(() => {
                callback();
            })
            .catch(next)
    }


}

module.exports = Session;