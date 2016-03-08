var handlebars = require('handlebars');

var Context = {
    title: "My plantsareas",
    body: "Here is information about plantsareas"
};

var setContext = function(context){
    //Context = context;
};

var processHtml = function(sourceHtml){
    //debugger;
    var template = handlebars.compile(sourceHtml.toString());
    return template(Context).toString();
};

/*
$(document).ready(function () {
     var sourceHtml = $("#entry-template").html();
    $('#handlebars-entry').append(processHtml(sourceHtml, Context));
});
*/

module.exports.setContext = setContext;
module.exports.processHtml = processHtml;