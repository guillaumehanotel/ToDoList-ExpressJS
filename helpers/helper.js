
module.exports = {


    /**
     * Retourne le timestamp actuel si aucun argument,
     * retourne le timestamp actuel + X heures selon le paramètre
     */
    getTimestampWithHours: function (optionalHour) {
        let date;
        if (typeof optionalHour === 'undefined'){
            date = new Date();
        } else {
            date = new Date();
            let hour = date.getHours();
            date.setHours(hour+optionalHour)
        }
        return Math.round(date.getTime() / 1000);
    },


    /**
     * Vérifie que le les valeurs du tableau des champs sont tous remplis
     * @param fields
     * @returns {boolean}
     */
    checkEmptyFields: function(fields) {
        for (let field in fields) {
            if (!fields[field]) {
                return true;
            }
        }
        return false;
    },


};