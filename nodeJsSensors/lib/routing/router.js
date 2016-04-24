var dataAccess = require('./../../server/dataAccess/access');
var data = {};

var route = function(pathname, id, resCallback, postData) {

    var callback = function(err, dataItems) {
        if (err) {
            callback(err);
            return;
        }
        data.items = dataItems;
        if (resCallback) {
            resCallback(null, data);
        }
    };

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
        case '/plantsareas/new':
            data = {
                text: 'Plants areas',
                code: 200,
                pathname: 'plantsareas',
                type: 'text/html'
            };
            addItem('plantsareas', postData);
            getItems('plantsareas');
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
        case '/sensors/new':
            data = {
                text: 'Sensors',
                code: 200,
                pathname: 'sensors',
                type: 'text/html'
            };
            addItem('sensors', postData);
            getItems('sensors');
            break;
        default:
            data = {
                text: 'No info',
                code: 403
            };
            break;
    }

    function addItem(type, postData) {
        switch (type) {
            case 'plantsareas':
                return dataAccess.insertDocuments(1, 'plantsareas', postData);
            case 'sensors':
                return dataAccess.insertDocuments(1, 'sensors', postData);
        }
    }

    function getItems(type, id) {
        switch (type) {
            case 'plantsareas':
                if (id) {
                    return dataAccess.getPlantsareas(id, callback);
                }
                return dataAccess.getPlantsareas(null, callback);
            case 'sensors':
                if (id) {
                    return dataAccess.getSensors(id, callback); //for  plantsareaId
                }
                return dataAccess.getSensors(null, callback);
        }
    }
};

module.exports.route = route;