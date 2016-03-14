var TiSphero;

/**
 *  Constructor
 **/
(function constructor(args) {
	TiSphero = require("ti.sphero");
	setUI();
})(arguments[0] || {});

function setUI() {
	var circle = Widget.createController("drive/circle").getView();
	var top = Widget.createController("drive/arrow").getView();
	var right = Widget.createController("drive/arrow").getView();
	var bottom = Widget.createController("drive/arrow").getView();
	var left = Widget.createController("drive/arrow").getView();

	top.animate({
		transform: Ti.UI.create2DMatrix().rotate(-90)
	});

	bottom.animate({
		transform: Ti.UI.create2DMatrix().rotate(90)
	});

	left.animate({
		transform: Ti.UI.create2DMatrix().rotate(180)
	});

	$.circle.add(circle);
	$.arrowTop.add(top);
	$.arrowRight.add(right);
	$.arrowBottom.add(bottom);
	$.arrowLeft.add(left);
}

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
	TiSphero.startDrivingWithHeadingAndVelocity(heading, velocity);
}
