var plantsareas = require('./../data/plantsareas.json');
var sensors = require('./../data/sensors.json');

var getPlantsareas = function(id) {

    if (id) {
        //debugger;
        for (var key in plantsareas) {
            if (plantsareas[key]._id == id) {
                return plantsareas[key];
            }
        }
    }
    else {
        return plantsareas;
    }
};


var getSensors = function(plantsareaId) {
  if (plantsareaId) {
      var list = [];
      for (var key in sensors) {
          if (sensors[key].plantsareaId == plantsareaId) {
              //debugger;
              list.push(sensors[key]);
          }
      }
      return list;
  }
  else {
      return sensors;
  }
};

module.exports.plantsareas = getPlantsareas;
module.exports.sensors = getSensors;