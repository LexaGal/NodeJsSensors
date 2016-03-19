$('#newSensorForm').submit(function (event) {
    event.preventDefault();

    var measurableType = $(event.target).find('[name=measurableType]');
    var measuringTimeout = $(event.target).find('[name=measuringTimeout]');
    var isOn = $(event.target).find('[name=isOn]');

    var sensor = {
        measurableType: measurableType.val().toLowerCase(),
        timespan: measuringTimeout.val(),
        isOn: $('#isOn:checked').val(),
        plantsareaId: this._id,
        dateTime: new Date()
    };

    sensor.isOn = (sensor.isOn == "on").toString();

    $.ajax({
        url: "/sensors/new/",
        type: "post",
        data: {sensor: JSON.stringify(sensor)},
        success: function (lastItem) {
            var $newdiv = $("<div id='" + lastItem._id + "' class='sensor'>" +
                "Name: " + lastItem.measurableType +
                " - Timespan: " + lastItem.timespan +
                " - Is on: " + lastItem.isOn +
                "</div>");
            $('#sensors').append($newdiv);
        },
        error: function (err) {
            alert(err.message);
        }
    });
});

$('.addButton').on('click', function (e) {
    e.preventDefault();
    $('#newSensorForm').attr("visibility", "visible");
    $('#addButton').attr("visibility", "collapse");
});

$('.closeButton').on('click', function (e) {
    e.preventDefault();
    $('#sensorSubmit').attr("visibility", "collapse");
    $('#addButton').attr("visibility", "visible");
});
