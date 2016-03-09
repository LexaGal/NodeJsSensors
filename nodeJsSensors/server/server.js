var fs = require('fs');
var http = require('http');
var route = require('./../lib/routing/router');
var cheerio = require('cheerio');

var dir = "C:/Users/Alex/WebstormProjects/nodeJsSensors";

var prepareHtmlAndSend = function (res, data, html) {
    $ = cheerio.load(html);
    //debugger;
    var sourceHtml = $('#entry-template').html();
    $('#handlebars-entry').append(sourceHtml);

    res.writeHead(data.code, {'Content-Type': data.type, 'Cache-Control': 'no-cache' });

    //var s = $.html();
    //var buf = new ArrayBuffer(s.length);
    //var uint8array = new Uint8Array(buf);
    //for (var i = 0, strLen = s.length; i < strLen; i++) {
    //    uint8array[i] = s.charCodeAt(i);
    //}
    //debugger;

    res.write($.html());
    res.end(function() {
        console.log("Response finished");
    })
};

var createResponse = function (res, data) {
    //debugger;

    var context;

    if (data.code == 200) {
        //debugger;

        switch (data.pathname) {
            case 'plantsareas':

                context = require('./../client/plantsareas/plantsareas');
                context.setContext(data.items);

                fs.readFile('client/plantsareas/plantsareas.html', function (err, html) {
                    if (err) {
                        res.writeHead(500, "Error during reading file: client/plantsareas/plantsareas.html");
                        res.end();
                    }
                    //debugger;
                    //res.write(html);
                    html = context.processHtml(html);
                    prepareHtmlAndSend(res, data, html);
                    //res.end();
                });
                break;
            case 'sensors':

                context = require('./../client/sensors/sensors');
                context.setContext(data.items);

                fs.readFile('client/sensors/sensors.html', function (err, html) {
                    if (err) {
                        res.writeHead(500, "Error during reading file: client/sensors/sensors.html");
                        res.end();
                    }
                    html = context.processHtml(html);
                    prepareHtmlAndSend(res, data, html);
                    //res.end();
                });
                break;
        }
    }
};

function accept(req, res) {

    res.on('end', function(){
        console.log("End received!");
    });

    res.on('close', function(){
        console.log("Close received!");
    });

    debugger;

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

    var routeData = route.route(req.url);

    createResponse(res, routeData);
    //res.end();
}

var port = process.argv[2].split('=')[1];

http.createServer(accept).listen(port);
console.log('server is listening ' + port + ' port');