//const Handlebars = require('handlebars');
//var server = require('../../server/server');

//Handlebars.registerHelper('user', function(options) {
//    return server.User();
//});

$('#newPlantsareaItemForm').submit(function (event) {
    event.preventDefault();

    var name = $(event.target).find('[name=name_plantsareaItem]').val();

    var doc = {
        name: name,
        numberOfSensors: 0
    };

    $.ajax({
        url: "/plantsareas/new/",
        type: "post",
        data: { name: doc.name },
        success: function(lastItem) {
            var $newdiv = $( "<div id='" + lastItem._id + "' class='plantsarea'>" +
                "Name: " + lastItem.name +
                " - Sensors: " + lastItem.numberOfSensors +
                "</div>");
            $('#plantsareas').append($newdiv);
        },
        error: function(err) {
            alert(err.message);
        }
    });
});
