//var plantsareas = require('./../data/plantsareas.json');
//var sensors = require('./../data/sensors.json');
var assert = require('assert');

var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var db = new Db('plantsareas', new Server('localhost', 27017));
//var url = 'mongodb://localhost:27017/plantsareas';

var insertDocuments = function (number, collection, docs, callback) {

    db.open(function (err, db) {

        assert.equal(null, err);
        assert.ok(db != null);

        collection = db.collection(collection);

        if (!number.isNaN()) {
            if (number > 1) {
                collection.insertMany(
                    docs,
                    function (err, res) {
                        assert.equal(null, err);
                        if (db.serverConfig.isConnected()) {
                            db.close();
                        }
                        if (callback) {
                            if (err) callback(err);
                            else callback(null, res);
                        }
                    }
                );
            } else if (number = 1) {
                collection.insertOne(
                    docs,
                    function (err, res) {
                        assert.equal(null, err);
                        if (db.serverConfig.isConnected()) {
                            db.close();
                        }
                        if (callback) {
                            if (err) callback(err);
                            else callback(null, res);
                        }
                    }
                );
            }
        }
    });
};

var getDocuments = function (collection, selectors, callback) {

    db.open(function (err, db) {

        assert.equal(null, err);
        assert.ok(db != null);

        collection = db.collection(collection);

        collection.find(selectors).toArray(function (err, items) {
            assert.equal(null, err);
            if (db.serverConfig.isConnected()) {
                db.close();
            }
            if (callback) {
                if (err) callback(err);
                else callback(null, items);
            }
        });
    });
};

var getPlantsareas = function (id, callback) {

    getDocuments('plantsareas', {}, function (err, items) {

        if (id) {
            var list = [];
            for (var key in items) {
                if (items[key]._id == id) {
                    list.push(items[key]);
                    callback(list);
                }
            }
        } else {
            callback(items);
        }
    });
};


var getSensors = function (plantsareaId, callback) {

    var sensors = getDocuments('sensors', {}, function (err, items) {

        if (plantsareaId) {
            var list = [];
            for (var key in items) {
                if (items[key].plantsareaId == plantsareaId) {
                    list.push(items[key]);
                }
            }
            callback(list);
        } else {
            callback(items);
        }
    });
}
module.exports.plantsareas = getPlantsareas;
module.exports.sensors = getSensors;