"use strict";

// -- FRAMEWORKS

var RKRobotDiscoveryAgent = require('RobotKit/RKRobotDiscoveryAgent'),
    RKConvenienceRobot = require('RobotKit/RKConvenienceRobot'),
    RKRobotChangedStateNotification = require('RobotKit/RKRobotChangedStateNotification'),
    RKRobotLE = require('RobotKit/RKRobotLE'),
    RobotKit = require('RobotKit'),
    RKRobotConnecting = RobotKit.RKRobotConnecting,
    RKRobotConnected = RobotKit.RKRobotConnected,
    RKRobotOnline = RobotKit.RKRobotOnline,
    RKRobotOffline = RobotKit.RKRobotOffline,
    RKRobotDisconnected = RobotKit.RKRobotDisconnected,
    RKRobotFailedConnect = RobotKit.RKRobotFailedConnect,
    Robot = require('./robot');

// -- Private API's

var events = [];
var isSimulator = Ti.App.getDeployType() == 'development';

/**
 * Robot connection process has started.
 */
var CONNECTION_STATUS_CONNECTING = RKRobotConnecting;

/**
 * Robot is connected, but not online.
 */
var CONNECTION_STATUS_CONNECTED = RKRobotConnected;

/**
 * Robot main processor is online and connected.
 * This state is the one to watch for before sending commands.
 */
var CONNECTION_STATUS_ONLINE = RKRobotOnline;

/**
 * Robot main process is offline, but the radio is still connected.
 * Only available in BLE Robots.
 */
var CONNECTION_STATUS_OFFLINE = RKRobotOffline;

/**
 * Robot radio has disconnected - does not imply that that robot main processor is offline.
 */
var CONNECTION_STATUS_DISCONNECTED = RKRobotDisconnected;

/**
 *  Something went wrong during the connect cycle.
 */
var CONNECTION_STATUS_FAILED_CONNECT = RKRobotFailedConnect;

/**
 * Constructor
 */
(function constructor() {
    if (isSimulator) {
        log('info', 'Initializing module ...');
    } else {
        var RKSubclass = Hyperloop.defineClass('RKSubclass', 'NSObject');
        RKSubclass.addMethod({
            selector: 'onConnectionChange:',
            instance: true,
            arguments: ['NSNotification'],
            callback: function(notification) {
                handleRobotStateChangeNotification(notification);
            }
        });
        var RKSubclassInstance = new RKSubclass();
        RKRobotDiscoveryAgent.sharedAgent().addNotificationObserverSelector(RKSubclassInstance, 'onConnectionChange');
        // FIXME: Without this the notifications end up in Nirvana, why?
        exports.subclass = RKSubclassInstance;
    }
})();

/**
 * Handles a new notification being sent from the `RobotKit` framework
 * and sends out a Javascript event to the client.
 * @param {NSNotification} notification The notification.
 */
function handleRobotStateChangeNotification(notification) {
    Ti.API.info('Received state notification: ', notification);

    switch (notification.type) {
        case RKRobotConnecting:
            Ti.API.info('Connecting to robot ...');
            break;
        case RKRobotOnline:
            var robot = RKConvenienceRobot.cast(RKConvenienceRobot.convenienceWithRobot(notification.robot));
            Ti.API.info('Robot is online (' + robot.name() + ')');
            break;
        case RKRobotDisconnected:
            Ti.API.info('Disconnected from robot');
            break;
        default:
            Ti.API.warn('Unhandled state change: ' + notification.type);
            break;
    }
    fireEvent(notification);
}

// -- Utilities

/**
 * Prints a new log message in the client console.
 * @param {String} level The log level, one of [debug, info, warn, error].
 * @param {String} message The log message.
 */
function log(level, message) {
    Ti.API[level](message);
}

/**
 * Fires a new event to the Javascript client.
 * @param {NSNotification} notification The notification.
 */
function fireEvent(notification) {
    _.each(_.where(events, {
        name: 'connectionchange'
    }), function(event) {
        if (isSimulator) {
            event.cb({
                success: true,
                status: CONNECTION_STATUS_ONLINE,
                robot: new Robot()
            });
        } else {
            event.cb({
                success: notification.type != RKRobotFailedConnect,
                status: notification.type,
                robot: new Robot(RKConvenienceRobot.cast(RKConvenienceRobot.convenienceWithRobot(notification.robot)))
            });
        }
    });
}

// -- Public API's

/**
 * Starts a new discovery and triggers a `connectionchange` event.
 */
exports.startDiscovery = function() {
    log('info', 'Start discovery ...');

    if (isSimulator) {
        setTimeout(function() {
            fireEvent({});
        }, 1000);
    } else {
        var error = null;
        RKRobotDiscoveryAgent.startDiscovery();
    }
};

/**
 * Stops a current discovery and triggers a `connectionchange` event.
 */
exports.stopDiscovery = function() {
    if (isSimulator) {
        log('info', 'Stop discovery ...');
    } else {
        RKRobotDiscoveryAgent.sharedAgent().stopDiscovery();
    }
};

/**
 * Returns whether or not the client is currently discovering robots.
 * @return {Boolean} isDiscovering
 */
exports.isDiscovering = function() {
    if (isSimulator) {
        return false;
    } else {
        return RKRobotDiscoveryAgent.sharedAgent().isDiscovering();
    }
};

/**
 * Disconnects the client from his currently selected robot and triggers a `connectionchange` event.
 */
exports.disconnect = function() {
    if (isSimulator) {
        log('info', 'Disconnecting ...');
    } else {
        RKRobotDiscoveryAgent.sharedAgent().disconnect();
    }
};

/**
 * Disconnects all currently selected robots from its clients and triggers a `connectionchange` event.
 */
exports.disconnectAll = function() {
    if (isSimulator) {
        log('info', 'Disconnecting all devices ...');
    } else {
        RKRobotDiscoveryAgent.sharedAgent().disconnectAll();
    }
};

/**
 * Creates a new event listener to emulate the legacy behavior of the Titanium proxy-system.
 * @param {String} _name The event name.
 * @param {Callback} _name The event callback.
 */
exports.addEventListener = function(_name, _cb) {
    events.push({
        name: _name,
        cb: _cb
    });
};

/**
 * Removes an existing event listener to emulate the legacy behavior of the Titanium proxy-system.
 * @param {String} _name The event name.
 * @param {Callback} _name The event callback.
 */
exports.removeEventListener = function(_name, _cb) {
    events = _.reject(events, function(event) {
        return event.name === _name;
    });
};

// -- Public constants
exports.CONNECTION_STATUS_CONNECTING = CONNECTION_STATUS_CONNECTING;
exports.CONNECTION_STATUS_CONNECTED = CONNECTION_STATUS_CONNECTED;
exports.CONNECTION_STATUS_ONLINE = CONNECTION_STATUS_ONLINE;
exports.CONNECTION_STATUS_OFFLINE = CONNECTION_STATUS_OFFLINE;
exports.CONNECTION_STATUS_DISCONNECTED = CONNECTION_STATUS_DISCONNECTED;
exports.CONNECTION_STATUS_FAILED_CONNECT = CONNECTION_STATUS_FAILED_CONNECT;
