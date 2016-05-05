"use strict";

/**
 * Managing robot operations.
 * @param {RKConvenienceRobot} robot The robot to manage.
 */
var Robot = function(robot) {
    this.robot = robot;
};

/**
 * Starts a new driving sequence.
 * @param {Number} heading The heading.
 * @param {Number} velocity The velocity.
 */
Robot.prototype.startDrivingWithHeadingAndVelocity = function(heading, velocity) {
    this.robot.startDrivingWithHeadingAndVelocity(heading, velocity);
};

/**
 * Stops an existing driving sequence.
 */
Robot.prototype.stopDriving = function() {
    this.robot.stopDriving();
};

/**
 * Sets the robot LED color.
 * @param {UIColor} color The desired LED color.
 */
Robot.prototype.setLEDColor = function(color) {
    var nativeColor = color.CGColor();

    if (CGColorGetNumberOfComponents(nativeColor) == 4) {
        var components = CGColorGetComponents(nativeColor);
        var red = components[0];
        var green = components[1];
        var blue = components[2];
        var alpha = components[3];

        this.robot.setLEDWithRedGreenBlue(red, green, blue);
    } else {
        Ti.API.error("Invalid color supplied:" + color);
    }
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
    this.robot.disconnect();
};

/**
 * Returns the robot name (e.g. "Sphero").
 * @return {String} name
 */
Robot.prototype.name = function() {
    return this.robot && this.robot.name;
}

/**
 * Returns the robot identifier (e.g. sphero-bb8).
 */
Robot.prototype.identifier = function() {
    return this.robot && this.robot.identifier;
}

/**
 * Returns the robot serial number (e.g. L48-1516-2342).
 * @return {String} serialNumber
 */
Robot.prototype.serialNumber = function() {
    return this.robot && this.robot.serialNumber;
}

/**
 * Returns whether or not the robot is currently online.
 * @return {Boolean} online
 */
Robot.prototype.online  = function() {
    return this.robot && this.robot.isOnline();
}

/**
 * Returns whether or not the robot is currently connected.
 * @return {Boolean} connected
 */
Robot.prototype.connected = function() {
    return this.robot && this.robot.isConnected();
}

/**
 * Returns the current robot heading.
 * @return {Number} currentHeading
 */
Robot.prototype.currentHeading  = function() {
    return this.robot && this.robot.currentHeading;
}

/**
 * Exports the current module as a public interface.
 */
module.exports = Robot;