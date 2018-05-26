const db = require('../config/db');



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
            let timestamp_now = Math.round(new Date().getTime() / 1000);
            let timestamp_1_hour = Math.round(new Date().addHours(1).getTime() / 1000);

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
            .catch(next);
    }


    static delete(token, callback, next){

        let query_delete_session = "DELETE FROM sessions WHERE accessToken = ?";

        db.run(query_delete_session, token)
            .then(() => {
                callback();
            })
            .catch(next)
    }


}


Date.prototype.addHours = function(h){
    this.setHours(this.getHours()+h);
    return this;
};

module.exports = Session;