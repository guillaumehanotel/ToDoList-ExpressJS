const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const auth = require('./middlewares/auth.js');

const helper = require('./helpers/helper.js');

const Session = require('./models/Session');

/*** SETTINGS ***/
const app = express();
const PORT = process.PORT || 8080;

// Moteur de Template et vues
app.engine('ejs', require('express-ejs-extend'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Middleware Session
app.use(session({secret: 'secretSessionString'}));

// Middleware message flash
app.use(require('./middlewares/flash.js'));

// Middleware body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Middleware cookie parser
app.use(cookieParser());

// LOGGER
app.use((req, res, next) => {
    next();
    console.log('REQUEST: ' + req.method + ' ' + req.url);
});

// fichiers statiques
app.use('/public', express.static('public'));


// Middleware : use current user data in views
app.use(function (req, res, next) {

    //console.log(req.cookies)
    if (helper.isAccessTokenExist(req)) {
        helper.addCurrentUserToLocals(req, res, next, Session);
    } else {
        next();
    }

});


// Middleware Authentification
app.use(function (req, res, next) {

    console.log("cookie : ")
    console.log(req.cookies)

    if(req.originalUrl !== "/sessions"){
        auth.checkAuthentification(req, res, next);
    } else {
        next();
    }

   // next();

});


// Routes
app.use(require('./controllers'));


// Erreur 404
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    console.log(err);
    next(err);
});

// Gestion des erreurs
app.use(function (err, req, res, next) {
    // Les données de l'erreur
    let data = {
        message: err.message,
        status: err.status || 500
    };

    data.error = err.stack;

    console.log(data.error);

    // On set le status de la réponse
    res.status(data.status);

    // Réponse multi-format
    res.format({
        html: () => {
            res.render('error', data)
        },
        json: () => {
            res.send(data)
        }
    })
});


app.listen(PORT, () => {
    console.log('Serveur démarré sur le port : ', PORT)
});

