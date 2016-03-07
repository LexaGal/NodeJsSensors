var http = require('http');
var route = require('./../lib/routing/router');

var createResponse = function(res ,data) {
    res.writeHead(data.code, {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache'
    });

    res.end(data.text + '\n' + JSON.stringify(data.items));
};

function accept(req, res) {

    res.w
    createResponse(res, route.route(req.url));
}

var port = process.argv[2].split('=')[1];

http.createServer(accept).listen(port);
console.log('server is listening ' + port + ' port');