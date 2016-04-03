'use strict';

var fs = require('fs');
var http = require('http');
var route = require('./../lib/routing/router');
var cheerio = require('cheerio');
var assert = require('assert');
//var response = {};
var Path = require('path');
var Inert = require('inert');
const Hapi = require('hapi');

const server = new Hapi.Server({
    //connections: {
    //    routes: {
    //        files: {
    //            relativeTo: Path.join(__dirname, './../public')
    //        }
    //    }
    //}
});

server.register(Inert, function () {});

var port = process.argv[2].split('=')[1];
server.connection({
    port: port || 3000,
    host: 'localhost'
});

//
//MongoClient = require('mongodb').MongoClient;
//Db = require('mongodb').Db;
//Server = require('mongodb').Server;
//db = new Db('plantsareas', new Server('localhost', 27017));
//var getDb = function() { return db;};
//var url = 'mongodb://localhost:27017/alexmongodb';
//var getDb = function() { return db;};

//var dir = "C:/Users/Alex/WebstormProjects/nodeJsSensors";

server.register(require('vision'), (err) => {
    if (err) {
        console.log(err.message);
    }
    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: './../client/templates/',
        layoutPath: './../client/layout',
        helpersPath: './../client/helpers'
    });
});

//var prepareHtmlAndSend = function (data, html) {
//    var $ = cheerio.load(html);
//    var sourceHtml = $('#entry-template').html();
//    $('#handlebars-entry').append(sourceHtml);
//
//    response.writeHead(data.code, {'Content-Type': data.type, 'Cache-Control': 'no-cache'});
//
//    //var s = $.html();
//    //var buf = new ArrayBuffer(s.length);
//    //var uint8array = new Uint8Array(buf);
//    //for (var i = 0, strLen = s.length; i < strLen; i++) {
//    //    uint8array[i] = s.charCodeAt(i);
//    //}
//    //debugger;
//
//    response.write($.html());
//    response.end(function () {
//        console.log("Response finished");
//    })
//};

//var createResponse = function (data) {
//    var context;
//
//    if (data.code == 200) {
//        switch (data.pathname) {
//
//            case 'plantsareas':
//                context = require('./../client/helpers/plantsareas');
//                context.setContext(data.items);
//                fs.readFile('client/plantsareas/plantsareas.html', function (err, html) {
//                    if (err) {
//                        console.log(500, "Error during reading file: client/plantsareas/plantsareas.html");
//                    }
//                    html = context.processHtml(html);
//                    prepareHtmlAndSend(data, html);
//                });
//                break;
//
//            case 'sensors':
//                context = require('./../client/helpers/sensors');
//                context.setContext(data.items);
//
//                fs.readFile('client/sensors/sensors.html', function (err, html) {
//                    if (err) {
//                        console.log(500, "Error during reading file: client/sensors/sensors.html");
//                    }
//                    html = context.processHtml(html);
//                    prepareHtmlAndSend(data, html);
//                });
//                break;
//        }
//    }
//};

//function accept(req, res) {
//
//    res.on('end', function () {
//        console.log("End received!");
//    });
//
//    res.on('close', function () {
//        console.log("Close received!");
//    });
//
//    if (req.url === '/favicon.ico') {
//        fs.readFile(dir + '/favicon.png', function (err, data) {
//            if (err) console.log(err);
//            res.writeHead(200, {'Content-Type': 'image/x-icon'});
//            res.end(data);
//            console.log('favicon requested');
//        });
//        return;
//    }
//
//    if (req.url.indexOf(".css") != -1) {
//        fs.readFile(dir + req.url, function (err, data) {
//            if (err) console.log(err);
//            res.writeHead(200, {'Content-Type': 'text/css'});
//            res.write(data);
//            res.end();
//        });
//    }
//
//    //response = res;
//
//    route.route(req.url, createResponse);
//}

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        route.route('/', null, function (err, plantsareas) {
            if (err) {
                console.log(err);
                reply(err.message);
            }
            reply.view("plantsareas", { plantsareas: plantsareas.items });
        });
    }
});

server.route({
    method: 'POST',
    path: '/new/{name}',
    handler: function (request, reply) {
        var name = encodeURIComponent(request.params.name);
        route.route('/plantsareas/new', null, function (err, plantsareas) {
            if (err) {
                console.log(err);
                reply(err.message);
            }
            reply(plantsareas.items[plantsareas.items.length - 1]);
        }, {name: name, numberOfSensors: 0});
    }
});

server.route({
    method: 'GET',
    path: '/plantsareas',
    handler: function (request, reply) {
        route.route('/plantsareas', null, function (err, plantsareas) {
            if (err) {
                console.log(err);
                reply(err.message);
            }
            reply.view("plantsareas", { plantsareas: plantsareas.items });
        });
    }
});

server.route({
    method: 'GET',
    path: '/plantsareas/{id}',
    handler: function (request, reply) {
        route.route('/plantsareas', encodeURIComponent(request.params.id), function (err, plantsareas) {
            if (err) {
                console.log(err);
                reply(err.message);
            }
            reply.view("plantsareas", { plantsareas: plantsareas.items });
        });
    }
});

server.route({
    method: 'POST',
    path: '/plantsareas/new/',
    handler: function (request, reply) {
        var name = encodeURIComponent(request.payload.name);
        route.route('/plantsareas/new', null, function (err, plantsareas) {
            if (err) {
                console.log(err);
                reply(err.message);
            }
            reply(plantsareas.items[plantsareas.items.length - 1]);
        }, {name: name, numberOfSensors: 0});
    }
});

server.route({
    method: 'GET',
    path: '/sensors',
    handler: function (request, reply) {
        route.route('/sensors', null, function (err, sensors) {
            if (err) {
                console.log(err);
                reply(err.message);
            }
            reply.view("sensors", { sensors: sensors.items });
        });
    }
});

server.route({
    method: 'GET',
    path: '/sensors/{plantsareaId}',
    handler: function (request, reply) {
        route.route('/sensors', encodeURIComponent(request.params.plantsareaId), function (err, sensors) {
            if (err) {
                console.log(err);
                reply(err.message);
            }
            reply.view("sensors", { sensors: sensors.items });
        });
    }
});

server.route({
    method: 'POST',
    path: '/sensors/new/',
    handler: function (request, reply) {
        var sensor = JSON.parse(request.payload.sensor);
        route.route('/sensors/new', null, function (err, sensors) {
            if (err) {
                console.log(err);
                reply(err.message);
            }
            reply(sensors.items[sensors.items.length - 1]);
        }, sensor);
    }
});

server.route({
    method: "GET",
    path: '/{param*}',
    handler: {
        directory: {
            path: [
                Path.join(__dirname, './../public/css'),
                Path.join(__dirname, './../client/helpers')
            ],
            listing: false,
            index: false
        }
    }
});

server.start((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('Server is running at: ', server.info.uri);
});
