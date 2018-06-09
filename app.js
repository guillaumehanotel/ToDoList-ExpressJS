// Packages
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override')

//
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

app.locals.timestampToDate =  function(timestamp) {

    let objectDate = new Date(timestamp * 1000);
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let month = months[objectDate.getMonth()];
    let date = objectDate.getDate();
    let hour = objectDate.getHours();
    let min = objectDate.getMinutes();

    return date + " " + month + " à " + hour + "h" + min;
};

// Middleware override HTTP methods
app.use(methodOverride('_method'));

// Middleware Session
app.set('trust proxy', 1);
app.use(session({
    secret: 'secretSessionString',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60,
        httpOnly:true
    }
}));

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


// Middleware Authentification
app.use(function (req, res, next) {

    console.log(req.headers)

    console.log("cookies présents : ");
    console.log(req.cookies);

    if(helper.isRequestBelongToWhiteList(req.originalUrl, req.method)){
        next();
    } else {
        auth.checkAuthentification(req, res, next);
    }

});


// Middleware : use current user data in views
app.use(function (req, res, next) {

    if (helper.isCookieAccessTokenExist(req)) {
        helper.addCurrentUserToLocals(req, res, next, Session);
    } else {
        next();
    }

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

