var fs = require('fs');
var http = require('http');
var route = require('./../lib/routing/router');
var context = require('./../client/plantsareas/plantsareas');
var cheerio = require('cheerio');

var createResponse = function(res ,data) {
    //debugger;

    context.setContext(data.items);

    fs.readFile('client/plantsareas/plantsareas.html', function (err, html) {
        html = context.processHtml(html);

        //debugger;

        $ = cheerio.load(html);
        var sourceHtml = $('#entry-template').html();
        $('#handlebars-entry').append(sourceHtml);

        res.writeHead(data.code, {'Content-Type': 'text/html'});
        res.write($('#handlebars-entry').html());
        res.end();
    });
};

function accept(req, res) {
    createResponse(res, route.route(req.url));
}

var port = process.argv[2].split('=')[1];

http.createServer(accept).listen(port);
console.log('server is listening ' + port + ' port');