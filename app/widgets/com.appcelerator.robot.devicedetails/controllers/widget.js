var device,
    nav;

/**
 *  Constructor
 **/
(function constructor(args) {
    nav = args.nav;
	devices = Alloy.Collections.instance("device");
    devices.fetch({
    	success: setUI
    });
})(arguments[0] || {});

function setUI() {	
    device = devices.get(args.id);
    $.window.setTitle(device.get("title"));
}

function openFeature(e) {
    nav.openWindow(Widget.createController(e.itemId).getView());
}
