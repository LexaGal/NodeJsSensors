var dataAccess = require('./../../server/dataAccess/access');
var url = require('url');
var querystring = require('querystring');

var route = function(urlString) {
    var data;

    //debugger;

    var urlObj = url.parse(urlString);

    function getItems(type, id) {
        switch (type) {
            case 'plantsareas':
                if (id) {
                    return dataAccess.plantsareas(id);
                }
                return dataAccess.plantsareas();
            case 'sensors':
                if (id) {
                    return dataAccess.sensors(id); //for  plantsareaId
                }
                return dataAccess.sensors();
        }
    }

    switch (urlObj.pathname) {
        case '/':
            data = {
                text: 'Plants areas:',
                items: getItems('plantsareas', urlObj.query),
                code: 200
            };
            break;
        case '/plantsareas':
            data = {
                text: 'Plants areas:',
                items: getItems('plantsareas', urlObj.query),
                code: 200
            };
            break;
        case '/sensors':
            data = {
                text: 'Sensors:',
                items: getItems('sensors', urlObj.query),
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