//$(function  () {
//    var shoesData = [{name:"Nike", price:199.00 }, {name:"Loafers", price:59.00 }, {name:"Wing Tip", price:259.00 }];
//    //Get the HTML from the template in the script tag
//    var theTemplateScript = $("#shoe-template").html();
//
//    //Compile the template
//    var theTemplate = Handlebars.compile (theTemplateScript);
//    $(".shoesNav").append (theTemplate(shoesData));
//    //We pass the shoesData object to the compiled handleBars function
//    //The function will insert all the values from the objects in their respective places in the HTML and returned HTML as a string. Then we use jQuery to append the resulting HTML string into the page
//});


$(document).ready(function() {
    var context = {title: "My New Post", body: "This is my first post!!!!"};
    var source = $("#entry-template").html();
    //alert(source);
    var template = Handlebars.compile(source);
    var html = template(context);
    //alert(html);
    $(document.body).append(html);
});
