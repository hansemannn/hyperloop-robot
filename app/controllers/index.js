/**
 *  Constructor
 **/
(function constructor() {
    var RKConvenienceRobot = require("RobotKit/RKConvenienceRobot");
    var RKRobotDiscoveryAgent = require("RobotKit/RKRobotDiscoveryAgent");

    Ti.API.warn("isDiscovering: " + RKRobotDiscoveryAgent.sharedAgent().isDiscovering());

    $.index.open();
})();
