const Session = require('../models/Session');
const helper = require('../helpers/helper');

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

        if (helper.isAccessTokenExist(request)) {
            let accessToken = request.cookies['accessToken'];
            console.log('token existe');

            Session.findByToken(accessToken, (rowSession) => {

                // si non valide -> redirection vers auth
                if (this.isAccessTokenValid(rowSession) === false) {
                    console.log('cookie périmé')
                    response.redirect('/sessions')
                }

                console.log('token valide');
                next();

            }, next);
        } else {
            console.log('pas de token');
            response.redirect(303, '/sessions')
        }
    },


    isAccessTokenValid: function (session) {
        let timestamp_now = Math.round(new Date().getTime() / 1000);

        console.log((session.expiresAt - timestamp_now) / 60 + " min de session restante");

        // valide si la date courante est inférieur à la date limite, alors valide
        return timestamp_now <= session.expiresAt;
    },



    checkJSONAuthentification : function(request, response, next){
           /*
            if (!this.isHeaderValid(request))
                next(new Error("X-AccessToken not found"))
                */
    },




    isHeaderValid: function (request) {

        return true;

    },







};