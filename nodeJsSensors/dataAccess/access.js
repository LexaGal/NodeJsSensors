var plantsareas = require('./../data/plantsareas.json');
var sensors = require('./../data/sensors.json');

var getPlantsareas = function(id) {

    if (id) {
        //debugger;
        for (var key in plantsareas) {
            if (plantsareas[key]._id == id) {
                console.log(plantsareas[key]);
            }
        }
    }
    else {
        console.log(plantsareas);
    }
};


var getSensors = function(id) {
  if (id) {
      for (var key in sensors) {
          if (sensors[key]._id == id) {
              console.log(sensors[key]);
          }
      }
  }
  else {
      console.log(sensors);
  }
};

module.exports.plantsareas = getPlantsareas;
module.exports.sensors = getSensors;