var http = require('http');
var url = require('url');
var querystring = require('querystring');

function accept(req, res) {

    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache'
    });

    res.end("OK");
}
var port = process.argv[2].split('=')[1];
http.createServer(accept).listen(port);
console.log('server is listening ' + port + ' port');