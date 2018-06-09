const router = require('express').Router();
const User = require('../models/User');
const Session = require('../models/Session');
const bcrypt = require('bcrypt');
const helper = require('../helpers/helper');


// GET / => Affiche un formulaire user/pass
router.get('/sessions', function (request, response) {


    response.render('sessions/login.ejs')

});

// POST / => Génère un accessToken et l'enregistre dans la table `sessions`: en HTML on set un cookie `accessToken`, en JSON, on
// retourne simplement `{accessToken: XXXX}`
router.post('/sessions', function (request, response, next) {

    // récup mail /mdp
    // chercher le mec par l'email et vérifier le mdp
    // si tout est bon, choper son id et le passer à la cr"ation de session

    if (!helper.checkEmptyFields(request.body)) {

            let email = request.body.email;
            let plainPassword = request.body.password;

        User.findByEmail(email, function (rowUser) {

            if (rowUser !== undefined) {
                if(bcrypt.compareSync(plainPassword, rowUser.password)){

                    Session.create(rowUser.rowid, () => {

                        Session.find(rowUser.rowid, (rowSession) => {

                            let accessToken = rowSession.accessToken;

                            // session
                            //request.session.user = rowUser;

                            response.format({
                                html: () => {

                                    console.log('cookie créé');
                                    response.cookie('accessToken', accessToken, { maxAge: 1000*60*60*24 });
                                    response.redirect('/todos')
                                },
                                json: () => {
                                    response.send(accessToken);
                                }
                            });


                        }, next);

                    }, next);

                } else {
                    // invalid password
                    response.format({
                        html: () => response.redirect('/sessions'),
                        json: () => response.send({error:"Invalid Password"})
                    });
                }
            } else {
                // invalid email
                response.format({
                    html: () => response.redirect('/sessions'),
                    json: () => response.send({error:"Invalid Email"})
                });
            }
        }, next);
    } else {
        // champs pas remplis

        response.format({
            html: () => response.redirect('/sessions'),
            json: () => response.send({error:"Empty fields"})
        });
    }

});

// DELETE / => Supprime un accessToken
router.delete('/sessions', function (request, response, next) {

    let accessToken = request.cookies['accessToken'];

    Session.delete(accessToken, () => {

        //request.session.destroy();
        response.clearCookie('accessToken');
        response.redirect('/sessions')

    }, next);

});



module.exports = router;