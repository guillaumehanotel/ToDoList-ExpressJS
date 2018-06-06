module.exports = function (request, response, next) {

    // Si un attribut flash dans la session a été défini, on l'ajoute dans
    // les variables locals, puis on la supprime de la session
    if(request.session.flash){
        response.locals.flash = request.session.flash;
        request.session.flash = undefined
    }

    // si l'attribut flash de la session n'est pas défini, on l'initialise à vide
    // on ajoute le type et le contenu de l'erreur dans l'attribut flash de la session
    request.flash = function (type, content){
        if(request.session.flash === undefined){
            request.session.flash = {}
        }
        request.session.flash[type] = content
    };

    next()
};