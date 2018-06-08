const Session = require('../models/Session');
const helper = require('../helpers/helper');



/**
 * Va chercher la session en BDD à partir du token et vérifie la date
 * @param accessToken
 */
function checkToken(accessToken) {
    return new Promise((resolve, reject) => {
        Session.findByToken(accessToken, (rowSession) => {
            resolve(isDateAccessTokenValid(rowSession.expiresAt));
        });
    })
}

/**
 * valide si la date courante est inférieur à la date limite, alors valide
 */
function isDateAccessTokenValid(expirationDate) {
    return Math.round(new Date().getTime() / 1000) < expirationDate
}


const checkAuthentification = function (request, response, next) {

    response.format({
        html: function() {

            // test si le cookie est présent
            if (helper.isAccessTokenExist(request)) {

                let accessToken = request.cookies['accessToken'];

                checkToken(accessToken).then((isTokenValid) => {

                    // check si sa date est valide
                    if (isTokenValid) {
                        //valide
                        console.log('token valide');
                        next()

                    } else {
                        // date pas valide -> redirect
                        console.log('token périmé');
                        response.clearCookie('accessToken');
                        response.locals.connectedUser = null;
                        request.session.connectedUser = null;

                        response.redirect('/sessions')
                    }

                }).catch(next)

            } else {
                console.log('pas de token');
                response.redirect(303, '/sessions')
            }

        }, json: () => {
            //this.checkJSONAuthentification(request, response, next);
            // todo token header

        }
    });
};


module.exports = {
    checkAuthentification: checkAuthentification
};