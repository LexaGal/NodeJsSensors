var http = require('http');
var url = require('url');
var querystring = require('querystring');
var route = require('./routing/router');

var createResponse = function(res ,data) {
    res.writeHead(data.code, {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache'
    });

    res.end(data.text);
};

function accept(req, res) {
    createResponse(res, route.route(req.url));
}

var port = process.argv[2].split('=')[1];

http.createServer(accept).listen(port);
console.log('server is listening ' + port + ' port');