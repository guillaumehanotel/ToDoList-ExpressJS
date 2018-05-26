$(document).ready(function () {


    $('a.delete').click(requestAPIDeleteUser);
    $('button#btnUpdateUser').on("click", requestAPIUpdateUser);


    /**
     * Test si le formulaire a une méthode,
     * si oui : c'est un POST donc create et on ignore
     * si non : c'est un update et on fait la requete PUT ici
     */
    function checkIfUpdate(btn){
        let method_attr = btn.parent().attr('method');
        return (typeof method_attr === typeof undefined || method_attr === false)
    }


    function requestAPIUpdateUser(event) {
        let btn = $(this);

        if(checkIfUpdate(btn)){
            event.preventDefault();

            let form_data_array = $('form').serializeArray();
            let userId = form_data_array.shift()['value'];
            let form_data = objectifyForm(form_data_array);

            $.ajax({
                url: '/users/'+ userId,
                type: 'PUT',
                data: form_data,
                success : function (result, status) {
                    window.location.replace('/users');
                },
                error: function (result, status, error) {
                    console.log(error);
                }
            })
        }
    }


    function objectifyForm(formArray) {//serialize data function
        let returnArray = {};
        for (let i = 0; i < formArray.length; i++){
            returnArray[formArray[i]['name']] = formArray[i]['value'];
        }
        return returnArray;
    }


    function getUserId(deleteLink) {
        return $(deleteLink).data('user_id');
    }


    function requestAPIDeleteUser() {

        let userId = getUserId(this);

        $.ajax({
            url: '/users/' + userId,
            type: 'DELETE',
            success: function (result, status) {
                window.location.replace('/users');
            },
            error: function (result, status, error) {
                console.log(error)
            }

        });
    }


});