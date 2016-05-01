var RKRobotDiscoveryAgent = require("RobotKit/RKRobotDiscoveryAgent");

/** 
 *  Private
 **/
 
var events = [];
var isDiscovering = false;

var CONNECTION_STATUS_CONNECTING = 10;
var CONNECTION_STATUS_CONNECTED = 20;
var CONNECTION_STATUS_ONLINE = 30;
var CONNECTION_STATUS_OFFLINE = 40;
var CONNECTION_STATUS_DISCONNECTED = 50;
var CONNECTION_STATUS_FAILED_CONNECT = 90;

var log = function(level, message) {
    Ti.API[level](message);
};

var createRobot = function(args) {
    var Robot = function(options) {
        this.name = options.name;
        this.identifier = options.identifier;
    };
    
    Robot.prototype.startDrivingWithHeadingAndVelocity = function(heading, velocity) {
        log("info", "Start driving with heading = " + heading + ", velocity = " + velocity);
    };
    
    Robot.prototype.stopDriving = function() {
        log("info", "Stop driving");
    };
    
    Robot.prototype.setLEDColor = function(color) {
        log("info", "Set LED color = " + color);
    };
    
    Robot.prototype.setBackLEDBrightness = function(brightness) {
        log("info", "Set LED brightness = " + brightness);
    };
    
    Robot.prototype.resetHeading = function() {
        log("info", "Reset heading");
    };
    
    Robot.prototype.disconnect = function() {
        log("info", "Disconnect");
    };
    
    Robot.prototype.runMacro = function(macro) {
        log("info", "Run macro");
    };   
    
    return new Robot(args);
};

/**
 *  Public
 **/
exports.startDiscovery = function() {
    log("info", "Start discovery");
    isDiscovering = true;

    setTimeout(function() {
        _.each(_.where(events, {name: "connectionchange"}), function(event) {
            log("info", "Found devices, firing events ...");
            
            event.cb({
                success: true,
                status: CONNECTION_STATUS_ONLINE,
                robot: createRobot({
                    name: "Test", 
                    identifier: "demo-device",
                    serialNumber: "1111-1111",
                    online: true,
                    connected: true,
                    currentHeading: 90
                })
            });
        })
        isDiscovering = false;
    }, 50);
};

exports.stopDiscovery = function() {
    log("info", "Stop discovery");
    isDiscovering = false;
};

exports.isDiscovering = function() {
    log("info", "Is discovering = " + isDiscovering);
    return RKRobotDiscoveryAgent.sharedAgent().isDiscovering();
};

exports.disconnect = function() {
    log("info", "Disconnect");
};

exports.disconnectAll = function() {
    log("info", "Disconnect all");    
};

exports.addEventListener = function(_name, _cb) {
    log("info", "Adding event listener = " + _name);
    events.push({
        name: _name, 
        cb: _cb
    });
};

exports.removeEventListener = function(_name, _cb) {
    log("info", "Removing event listener = " + _name);
    events = _.reject(events, function(event) { 
        return event.name === _name; 
    });
};

exports.CONNECTION_STATUS_CONNECTING = CONNECTION_STATUS_CONNECTING;
exports.CONNECTION_STATUS_CONNECTED = CONNECTION_STATUS_CONNECTED;
exports.CONNECTION_STATUS_ONLINE = CONNECTION_STATUS_ONLINE;
exports.CONNECTION_STATUS_OFFLINE = CONNECTION_STATUS_OFFLINE;
exports.CONNECTION_STATUS_DISCONNECTED = CONNECTION_STATUS_DISCONNECTED;
exports.CONNECTION_STATUS_FAILED_CONNECT = CONNECTION_STATUS_FAILED_CONNECT;
