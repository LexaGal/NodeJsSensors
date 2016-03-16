var fs = require('fs');
var http = require('http');
var route = require('./../lib/routing/router');
var cheerio = require('cheerio');
var assert = require('assert');
var response = {};

//
//MongoClient = require('mongodb').MongoClient;
//Db = require('mongodb').Db;
//Server = require('mongodb').Server;
//db = new Db('plantsareas', new Server('localhost', 27017));
//var getDb = function() { return db;};
//var url = 'mongodb://localhost:27017/alexmongodb';
//var getDb = function() { return db;};

var dir = "C:/Users/Alex/WebstormProjects/nodeJsSensors";

var prepareHtmlAndSend = function (data, html) {
    $ = cheerio.load(html);
    var sourceHtml = $('#entry-template').html();
    $('#handlebars-entry').append(sourceHtml);

    response.writeHead(data.code, {'Content-Type': data.type, 'Cache-Control': 'no-cache'});

    //var s = $.html();
    //var buf = new ArrayBuffer(s.length);
    //var uint8array = new Uint8Array(buf);
    //for (var i = 0, strLen = s.length; i < strLen; i++) {
    //    uint8array[i] = s.charCodeAt(i);
    //}
    //debugger;

    response.write($.html());
    response.end(function () {
        console.log("Response finished");
    })
};

var createResponse = function (data) {
    var context;

    if (data.code == 200) {
        switch (data.pathname) {

            case 'plantsareas':
                context = require('./../client/plantsareas/plantsareas');
                context.setContext(data.items);
                fs.readFile('client/plantsareas/plantsareas.html', function (err, html) {
                    if (err) {
                        response.writeHead(500, "Error during reading file: client/plantsareas/plantsareas.html");
                        response.end();
                    }
                    html = context.processHtml(html);
                    prepareHtmlAndSend(data, html);
                });
                break;

            case 'sensors':
                context = require('./../client/sensors/sensors');
                context.setContext(data.items);

                fs.readFile('client/sensors/sensors.html', function (err, html) {
                    if (err) {
                        response.writeHead(500, "Error during reading file: client/sensors/sensors.html");
                        response.end();
                    }
                    html = context.processHtml(html);
                    prepareHtmlAndSend(data, html);
                });
                break;
        }
    }
};

function accept(req, res) {

    res.on('end', function () {
        console.log("End received!");
    });

    res.on('close', function () {
        console.log("Close received!");
    });

    if (req.url === '/favicon.ico') {
        fs.readFile(dir + '/favicon.png', function (err, data) {
            if (err) console.log(err);
            res.writeHead(200, {'Content-Type': 'image/x-icon'});
            res.end(data);
            console.log('favicon requested');
        });
        return;
    }

    if (req.url.indexOf(".css") != -1) {
        fs.readFile(dir + req.url, function (err, data) {
            if (err) console.log(err);
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(data);
            res.end();
        });
    }

    response = res;

    route.route(req.url, createResponse);
}

var port = process.argv[2].split('=')[1];

http.createServer(accept).listen(port);
console.log('server is listening ' + port + ' port');

