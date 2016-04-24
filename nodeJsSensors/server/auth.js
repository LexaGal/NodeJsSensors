module.exports.authUser = function (request, reply, route) {
    if (request.state['data']) {
        return request.state['data'].name;
    } else {
        reply.redirect(route);
        return null;
    }
};