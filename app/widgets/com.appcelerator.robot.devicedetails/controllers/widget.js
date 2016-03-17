var robot,
    nav;

/**
 *  Constructor
 **/
(function constructor(args) {
	nav = args.nav;
    robot = e.robot;

    setUI();
})(arguments[0] || {});

function setUI() {
	$.window.setTitle(device.get("title"));
}

function openFeature(e) {
	nav.openWindow(Widget.createController(e.itemId + "/index", {
        robot: robot
    }).getView());
}
