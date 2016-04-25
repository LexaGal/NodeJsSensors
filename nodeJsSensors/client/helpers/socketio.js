$(document).ready(function () {
    var socketIo = io();
    var socket = socketIo.connect("http://localhost:3001");
    $("#chat").hide();
    $("#name").focus();
    var ready = false;
    $("form").submit(function (event) {
        event.preventDefault();
    });

    $("#join").click(function () {
        var name = $("#name").val();
        if (name != "") {
            socket.emit("join", name);
            ready = true;
        } else {
            alert("Name cannot be empty!");
        }
    });

    $("#name").keypress(function (e) {
        if (e.which == 13) {
            var name = $("#name").val();
            if (name != "") {
                socket.emit("join", name);
                ready = true;
            } else {
                alert("Name cannot be empty!");
            }
        }
    });

    socket.on("update", function (exists, msg) {
        if (ready) {
            if (!exists) {
                $("#login").detach();
                $("#chat").show();
                $("#msg").focus();
            }
            $("#msgs").append("<li><strong><span class='text-success'>" + msg + "</span></strong></li>");
        }
    });

    socket.on("update-people", function (people) {
        if (ready) {
            $("#people").empty();
            $.each(people, function (clientid, name) {
                $('#people').append("<li><strong><span class='text-success'>" + name + "</span></strong></li>");
            });
        }
    });

    socket.on("chat", function (who, msg) {
        if (ready) {
            $("#msgs").append("<li><strong><span class='text-success'>" + who + "</span></strong> says: " + msg + "</li>");
        }
    });

    socket.on("disconnect", function () {
        $("#msgs").append("The server is not available");
        $("#msg").attr("disabled", "disabled");
        $("#send").attr("disabled", "disabled");
    });


    $("#send").click(function () {
        var msg = $("#msg").val();
        if (msg != "") {
            socket.emit("send", msg);
            $("#msg").val("");
        }
    });

    $("#msg").keypress(function (e) {
        if (e.which == 13) {
            var msg = $("#msg").val();
            if (msg != "") {
                socket.emit("send", msg);
                $("#msg").val("");
            }
        }
    });
});