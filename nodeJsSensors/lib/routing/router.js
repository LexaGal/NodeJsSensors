var dataAccess = require('./../../server/dataAccess/access');
var url = require('url');
//var server = require('./../../server/server');
var data = {};

var route = function(pathname, id, resCallback) {

    var callback = function(dataItems) {
        data.items = dataItems;
        if (resCallback) {
            resCallback(data);
        }
    };

    //var urlObj = url.parse(urlString);

    switch (pathname) {
        case '/':
            data = {
                text: 'Plants areas',
                code: 200,
                pathname: 'plantsareas',
                type: 'text/html'
            };
            getItems('plantsareas', id);
            break;
        case '/plantsareas':
            data = {
                text: 'Plants areas',
                code: 200,
                pathname: 'plantsareas',
                type: 'text/html'
            };
            getItems('plantsareas', id);
            break;
        case '/sensors':
            data = {
                text: 'Sensors',
                code: 200,
                pathname: 'sensors',
                type: 'text/html'
            };
            getItems('sensors', id);
            break;
        default:
            data = {
                text: 'No info',
                code: 403
            };
            break;
    }

    function getItems(type, id) {
        switch (type) {
            case 'plantsareas':
                if (id) {
                    return dataAccess.plantsareas(id, callback);
                }
                return dataAccess.plantsareas(null, callback);
            case 'sensors':
                if (id) {
                    return dataAccess.sensors(id, callback); //for  plantsareaId
                }
            return dataAccess.sensors(null, callback);
        }
    }

    //return data;
};

module.exports.route = route;