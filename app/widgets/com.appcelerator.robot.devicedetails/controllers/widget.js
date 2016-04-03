var robot,
    nav;

/**
 *  Constructor
 **/
(function constructor(args) {
	nav = args.nav;
    robot = args.robot;

    setUI();
})(arguments[0] || {});

function setUI() {
	$.window.setTitle(robot.getName());
}

function disconnectRobot() {
	robot.disconnect();
}

function openFeature(e) {
	nav.openWindow(Widget.createController(e.itemId + "/index", {
        robot: robot
    }).getView());
}
