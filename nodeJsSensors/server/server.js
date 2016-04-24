'use strict';

//requirements
var User = {};
var auth = require('./auth');
var router = require('./../lib/routing/router');
const crypto = require('crypto');
const hapiAuthBasic = require('hapi-auth-basic');
var fs = require('fs');
var path = require('path');
var inert = require('inert');
var _ = require('lodash');
const Hapi = require('hapi');

const Handlebars = require('handlebars');
Handlebars.registerHelper('user', function(options) {
    return User;
});


//Hapi server
const server = new Hapi.Server();
server.register(inert, function () {
});
var frontend = server.connection({
    port: 3000,
    host: 'localhost',
    labels: 'frontend'
});
var backend = server.connection({
    port: 3001,
    host: 'localhost',
    labels: 'backend'
});
//

//for cookies
server.state('data', {
    ttl: 60 * 1000,
    isSecure: false,
    isHttpOnly: true,
    encoding: 'base64json',
    clearInvalid: false, // remove invalid cookies
    strictHeader: true // don't allow violations of RFC 6265
});
//

//users
const users = {
    john: {
        username: 'john',
        password: crypto.createHash('md5').update('johnSecret').digest("hex"),
        name: 'John Doe',
        id: '2133d32a'
    },
    mike: {
        username: 'mike',
        password: crypto.createHash('md5').update('mikeSecret').digest("hex"),
        name: 'Mike Vipor',
        id: '2133d32b'
    }
};
//

//auth. validation users
const validate = function (request, username, password, callback) {
    const user = users[username];
    if (!user) {
        return callback(null, false);
    }

    var hash = crypto.createHash('md5').update(password).digest("hex");
    if (user.password === hash) {
        callback(null, true, {
            id: user.id, name: user.name
        });
    } else {
        callback(new Error('Wrong password'), false);
    }
};

frontend.register(hapiAuthBasic, (err) => {
    if (err) {
        console.log(err);
        reply(err);
    }
    frontend.auth.strategy('simple', 'basic', {validateFunc: validate});
});

frontend.route({
    method: 'GET',
    path: '/',
    config: {
        auth: 'simple',
        handler: function (request, reply) {
            User = request.auth.credentials.name;
            reply.view("hello").state('data', {name: request.auth.credentials.name});
        },
        state: {
            parse: true, // parse and store in request.state
            failAction: 'error' // may also be 'ignore' or 'log'
        }
    }
});
//

//main server routes handlers
backend.register(require('vision'), (err) => {
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

backend.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        User = auth.authUser(request, reply, frontend.info.uri);
        if (!User) {
            return;
        }
        router.route('/', null, function (err, plantsareas) {
            if (err) {
                console.log(err);
                reply(err.message);
                reply.end();
            }
            reply.view("plantsareas", {plantsareas: plantsareas.items});
        });
    }
});

//backend.route({
//    method: 'POST',
//    path: '/new/{name}',
//    handler: function (request, reply) {
//        User = auth.authUser(request, reply, frontend.info.uri);
//        if (!User) {
//            return;
//        }
//        var name = encodeURIComponent(request.params.name);
//        router.route('/plantsareas/new', null, function (err, plantsareas) {
//            if (err) {
//                console.log(err);
//                reply(err.message);
//                reply.end();
//            }
//            reply(plantsareas.items[plantsareas.items.length - 1]);
//        }, {name: name, numberOfSensors: 0});
//    }
//});

backend.route({
    method: 'GET',
    path: '/plantsareas',
    handler: function (request, reply) {
        User = auth.authUser(request, reply, frontend.info.uri);
        if (!User) {
            return;
        }
        router.route('/plantsareas', null, function (err, plantsareas) {
            if (err) {
                console.log(err);
                reply(err.message);
                reply.end();
            }
            reply.view("plantsareas", {plantsareas: plantsareas.items});
        });
    }
});

backend.route({
    method: 'POST',
    path: '/plantsareas/new/{name}',
    handler: function (request, reply) {
        User = auth.authUser(request, reply, frontend.info.uri);
        if (!User) {
            return;
        }
        var name = encodeURIComponent(request.params.name);
        router.route('/plantsareas/new', null, function (err, plantsareas) {
            if (err) {
                console.log(err);
                reply(err.message);
                reply.end();
            }
            reply(plantsareas.items[plantsareas.items.length - 1]);
        }, {name: name, numberOfSensors: 0});
    }
});

backend.route({
    method: 'GET',
    path: '/plantsareas/{id}',
    handler: function (request, reply) {
        User = auth.authUser(request, reply, frontend.info.uri);
        if (!User) {
            return;
        }
        router.route('/plantsareas', encodeURIComponent(request.params.id), function (err, plantsareas) {
            if (err) {
                console.log(err);
                reply(err.message);
                reply.end();
            }
            reply.view("plantsareas", {plantsareas: plantsareas.items});
        });
    }
});



backend.route({
    method: 'GET',
    path: '/sensors',
    handler: function (request, reply) {
        User = auth.authUser(request, reply, frontend.info.uri);
        if (!User) {
            return;
        }
        router.route('/sensors', null, function (err, sensors) {
            if (err) {
                console.log(err);
                reply(err.message);
                reply.end();
            }
            reply.view("sensors", {sensors: sensors.items});
        });
    }
});

backend.route({
    method: 'GET',
    path: '/sensors/{plantsareaId}',
    handler: function (request, reply) {
        User = auth.authUser(request, reply, frontend.info.uri);
        if (!User) {
            return;
        }
        router.route('/sensors', encodeURIComponent(request.params.plantsareaId), function (err, sensors) {
            if (err) {
                console.log(err);
                reply(err.message);
                reply.end();
            }
            reply.view("sensors", {sensors: sensors.items});
        });
    }
});

backend.route({
    method: 'POST',
    path: '/sensors/new/',
    handler: function (request, reply) {
        User = auth.authUser(request, reply, frontend.info.uri);
        if (!User) {
            return;
        }
        var sensor = JSON.parse(request.payload.sensor);
        router.route('/sensors/new', null, function (err, sensors) {
            if (err) {
                console.log(err);
                reply(err.message);
                reply.end();
            }
            reply(sensors.items[sensors.items.length - 1]);
        }, sensor);
    }
});

backend.route({
    method: "GET",
    path: '/{param*}',
    handler: {
        directory: {
            path: [
                path.join(__dirname, './../public/css'),
                path.join(__dirname, './../client/helpers')
            ],
            listing: false,
            index: false
        }
    }
});
//

//socket for main server
var io = require('socket.io')(server.select('backend').listener);
io.on('connection', function (socket) {
    console.log('A user connected');
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
});
//

//starting servers
server.start(function () {
    _.forEach(server.connections, function (connection) {
        console.log('Server started at: ' + connection.info.uri);
    });
});
//

module.exports.User = function () {
    if (User) {
        return User;
    }
};