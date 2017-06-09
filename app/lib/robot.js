"use strict";

var RKRobotLE = require('RobotKit/RKRobotLE');

var isSimulator = Ti.App.getDeployType() == "development";

/**
 * Managing robot operations.
 * @param {RKConvenienceRobot} robot The robot to manage.
 */
var Robot = function(robot) {
    this.robot = robot || {};
};

/**
 * Starts a new driving sequence.
 * @param {Number} heading The heading.
 * @param {Number} velocity The velocity.
 */
Robot.prototype.startDrivingWithHeadingAndVelocity = function(heading, velocity) {
    if (isSimulator) {
        Ti.API.warn("Start driving with heading = " + heading + " and velocity = " + velocity);
    } else {
        this.robot.driveWithHeadingAndVelocity(heading, velocity);
    }
};

/**
 * Stops an existing driving sequence.
 */
Robot.prototype.stopDriving = function() {
    if (isSimulator) {
        Ti.API.warn("Stop driving");
    } else {
        this.robot.stop();
    }
};

/**
 * Sets the robot LED color.
 * @param {UIColor} color The desired LED color.
 */
Robot.prototype.setLEDColor = function(color) {

    if (isSimulator) {
        Ti.API.warn("Set LED Color = " + color);
        return;
    }

    var nativeColor = color.CGColor;

    // GoreGraphics stuff is broken, hack around it for now
    var components = color.toString().split(' ').slice(1);
    var red = components[0];
    var green = components[1];
    var blue = components[2];
    this.robot.setLEDWithRedGreenBlue(red, green, blue);

    /*
    if (CGColorGetNumberOfComponents(nativeColor) === 4) {
        var components = CGColorGetComponents(nativeColor);
        var red = components[0];
        var green = components[1];
        var blue = components[2];
        var alpha = components[3];
        this.robot.setLEDWithRedGreenBlue(red, green, blue);
    } else {
        Ti.API.error("Invalid color supplied:" + color);
    }
    */
};

/**
 * Sets the LED brightness.
 * @param {Number} brightness The brightness.
 */
Robot.prototype.setBackLEDBrightness = function(brightness) {
    this.robot.setBackLEDBrightness(brightness);
};

/**
 * Resets the current heading to 0°
 */
Robot.prototype.resetHeading = function() {
    this.robot.resetHeading();
};

/**
 * Disconnects the robot form the current application context
 * Note: This will trigger a new `connectionchange` event.
 */
Robot.prototype.disconnect = function() {
    if (isSimulator) {
        Ti.API.warn("Disconnect robot");
    } else {
        this.robot.disconnect();
    }
};

/**
 * Returns the robot name (e.g. "Sphero").
 * @return {String} name
 */
Robot.prototype.getName = function() {
    if (isSimulator) {
        return "Sphero Test";
    } else {
        return this.robot.name();
    }
}

/**
 * Returns the robot identifier (e.g. sphero-bb8).
 */
Robot.prototype.getIdentifier = function() {
    if (isSimulator) {
        return "sphero-test-device";
    } else {
        return RKRobotLE.cast(this.robot.robot).identifier();
    }
}

/**
 * Returns the robot serial number (e.g. L48-1516-2342).
 * @return {String} serialNumber
 */
Robot.prototype.getSerialNumber = function() {
    if (isSimulator) {
        return "4815-1623-42";
    } else {
        return RKRobotLE.cast(this.robot.robot).serialNumber();
    }
}

/**
 * Returns whether or not the robot is currently online.
 * @return {Boolean} online
 */
Robot.prototype.isOnline  = function() {
    if (isSimulator) {
        return true;
    } else {
        return this.robot.isOnline();
    }
}

/**
 * Returns whether or not the robot is currently connected.
 * @return {Boolean} connected
 */
Robot.prototype.isConnected = function() {
    if (isSimulator) {
        return true;
    } else {
        return this.robot.isConnected();
    }
}

/**
 * Returns the current robot heading.
 * @return {Number} currentHeading
 */
Robot.prototype.getCurrentHeading  = function() {
    if (isSimulator) {
        return 0;
    } else {
        return this.robot.currentHeading;
    }
}

/**
 * Exports the current module as a public interface.
 */
module.exports = Robot;
