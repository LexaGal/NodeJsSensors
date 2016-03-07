var dataAccess = require('./../dataAccess/access');

var route = function(url) {
    var data;

    function getItems(type) {
        switch (type) {
            case 'plantsareas':
                return dataAccess.plantsareas("7d82030f-ecb8-4f48-b668-54a31e8425dd");
            case 'sensors':
                return dataAccess.sensors();
        }
    }

    switch (url) {
        case '/':
            data = {
                text: 'Plants areas are here:',
                items: getItems('plantsareas'),
                code: 200
            };
            break;
        case '/plantsareas':
            data = {
                text: 'Plants areas are here',
                items: getItems('plantsareas'),
                code: 200
            };
            break;
        case '/sensors':
            data = {
                text: 'Sensors are here',
                items: getItems('sensors'),
                code: 200
            };
            break;
        default:
            data = {
                text: 'No info',
                code: 403
            };
            break;
    }
    return data;
};

module.exports.route = route;