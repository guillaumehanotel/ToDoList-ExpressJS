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
            if (helper.isCookieAccessTokenExist(request)) {

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
                        Session.truncate(function () {
                            response.redirect('/sessions')
                        }, next)
                    }

                }).catch(next)

            } else {
                console.log('pas de token');
                response.redirect(303, '/sessions')
            }

        }, json: () => {

            // comment mettre le header x-access-token ?

            if (helper.isHeaderAccessTokenExist(request)) {

                let accessToken = request.headers['x-access-token'];

                checkToken(accessToken).then((isTokenValid) => {

                    // check si sa date est valide
                    if (isTokenValid) {
                        //valide
                        console.log('token valide');
                        next()

                    } else {
                        response.send({error:"Invalid Token"})
                    }

                }).catch(next)

            } else {
                response.send({error:"You need to authenticate before (doesn't work)"})
            }

        }
    });
};


module.exports = {
    checkAuthentification: checkAuthentification
};