const Session = require('../models/Session');

module.exports = {


    checkAuthentification: function (request, response, next) {

        if (this.isHTML(request)) {
            this.checkHTMLAuthentification(request, response, next);
        } else {
            this.checkJSONAuthentification(request, response, next);
        }

    },


    isHTML: function (request) {
        return request.get('Accept') !== "application/json"
    },


    checkHTMLAuthentification: function(request, response, next){
        if (this.isAccessTokenExist(request)) {
            let accessToken = request.cookies['accessToken'];
            Session.findByToken(accessToken, (rowSession) => {

                // si non valide -> redirection vers auth
                if (this.isAccessTokenValid(rowSession) === false) {
                    response.redirect('/sessions')
                }
                next();
            }, next);
        } else {
            response.redirect(303, '/sessions')
        }
    },


    checkJSONAuthentification : function(request, response, next){
           /*
            if (!this.isHeaderValid(request))
                next(new Error("X-AccessToken not found"))
                */
    },


    isAccessTokenValid: function (session) {
        let timestamp_now = Math.round(new Date().getTime() / 1000);

        // valide si la date courante est inférieur à la date limite
        return timestamp_now <= session.expiresAt;
    },


    isAccessTokenExist: function (request) {
        return !(request.cookies['accessToken'] === undefined);
    },


    isHeaderValid: function (request) {

        return true;

    }


};