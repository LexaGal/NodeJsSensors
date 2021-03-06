var dataAccess = require('./../../server/dataAccess/access');
var url = require('url');
var data = {};

var route = function(urlString, resCallback) {

    var callback = function(dataItems) {

        data.items = dataItems;

        //var urlObj = url.parse(urlString);
        //switch (urlObj.pathname) {
        //    case '/':
        //        data = {
        //            text: 'Plants areas:',
        //            items: dataItems, //getItems('plantsareas', urlObj.query),
        //            code: 200,
        //            pathname: 'plantsareas',
        //            type: 'text/html'
        //        };
        //        break;
        //    case '/plantsareas':
        //        data = {
        //            text: 'Plants areas:',
        //            items: dataItems, //getItems('plantsareas', urlObj.query),
        //            code: 200,
        //            pathname: 'plantsareas',
        //            type: 'text/html'
        //        };
        //        break;
        //    case '/sensors':
        //        data = {
        //            text: 'Sensors:',
        //            items: dataItems, //getItems('sensors', urlObj.query),
        //            code: 200,
        //            pathname: 'sensors',
        //            type: 'text/html'
        //        };
        //        break;
        //    default:
        //        data = {
        //            text: 'No info',
        //            code: 403
        //        };
        //        break;
        //}
        if (resCallback) {
            resCallback(data);
        }
    };

    var urlObj = url.parse(urlString);
    switch (urlObj.pathname) {
        case '/':
            data = {
                text: 'Plants areas:',
                code: 200,
                pathname: 'plantsareas',
                type: 'text/html'
            };
            getItems('plantsareas', urlObj.query);
            break;
        case '/plantsareas':
            data = {
                text: 'Plants areas:',
                code: 200,
                pathname: 'plantsareas',
                type: 'text/html'
            };
            getItems('plantsareas', urlObj.query);
            break;
        case '/sensors':
            data = {
                text: 'Sensors:',
                code: 200,
                pathname: 'sensors',
                type: 'text/html'
            };
            getItems('sensors', urlObj.query);
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