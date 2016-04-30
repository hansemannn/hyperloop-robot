var robot;

/**
 *  Constructor
 **/
(function constructor(args) {
	robot = args.robot;
})(arguments[0] || {});

function driveForward() {
	drive(0, 0.5);
}

function driveRight() {
	drive(90, 0.5);
}

function driveBackward() {
	drive(180, 0.5);
}

function driveLeft() {
	drive(270, 0.5);
}

function drive(heading, velocity) {
	Ti.API.debug("Driving with heading = " + heading + " and velocity = " + velocity);
	robot.startDrivingWithHeadingAndVelocity(heading, velocity);
}

function stopDriving() {
	Ti.API.debug("Stopping ...");
	robot.stopDriving();
}
