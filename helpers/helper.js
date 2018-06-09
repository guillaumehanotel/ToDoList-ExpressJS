const User = require('../models/User');


module.exports = {


    /**
     * Retourne le timestamp actuel si aucun argument,
     * retourne le timestamp actuel + X heures selon le paramètre
     */
    getTimestampWithHours: function (optionalHour) {
        let date;
        if (typeof optionalHour === 'undefined') {
            date = new Date();
        } else {
            date = new Date();
            let hour = date.getHours();
            date.setHours(hour + optionalHour)
        }
        return Math.round(date.getTime() / 1000);
    },


    /**
     * Vérifie que le les valeurs du tableau des champs sont tous remplis
     * @param fields
     * @returns {boolean}
     */
    checkEmptyFields: function (fields) {
        for (let field in fields) {
            if (!fields[field]) {
                return true;
            }
        }
        return false;
    },

    isCookieAccessTokenExist: function (request) {
        if (request.cookies) {
            return !(request.cookies['accessToken'] === undefined);
        }
        return false;
    },

    isHeaderAccessTokenExist: function(request){
        if(request.headers){
            return !(request.headers['x-access-token'] === undefined)
        }
        return false;
    },

    getAccessToken: function (request, response) {
        if (this.isCookieAccessTokenExist(request)) {
            return request.cookies['accessToken'];
        }
    },

    addCurrentUserToLocals: async function (request, response, next, Session){

        // 1 : choper l'access token
        // 2 : requeter table session pour choper la ligne qui possède ce token
        // 3 : requeter table user pour choper le user qui possède session.userId

        let accessToken  = this.getAccessToken(request, response);

        Session.findByToken(accessToken, (rowSession) => {
            User.find(rowSession.userId, (rowUser) => {
                response.locals.connectedUser = rowUser;
                request.session.connectedUser = rowUser;
                next();
            }, next)
        }, next);
    },

    isRequestBelongToWhiteList: function (url, method) {
        const whiteListRequests = [
            {
                url: '/users',
                method: 'POST'
            },
            {
                url: '/sessions',
                method: 'GET'
            },
            {
                url: '/sessions',
                method: 'POST'
            }
        ];

        for (let whiteListRequest of whiteListRequests) {
            if(whiteListRequest.url == url && whiteListRequest.method == method){
                return true
            }
        }
        return false;
    }


};