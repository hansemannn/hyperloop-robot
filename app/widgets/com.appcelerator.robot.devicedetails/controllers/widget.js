var device,
    id,
    nav;

/**
 *  Constructor
 **/
(function constructor(args) {
	nav = args.nav;
	id = args.id;
	devices = Alloy.Collections.instance("device");
	devices.fetch({
		success : setUI
	});
})(arguments[0] || {});

function setUI() {
	device = devices.get(id);
	$.window.setTitle(device.get("title"));	
}

function openFeature(e) {
	nav.openWindow(Widget.createController(e.itemId + "/index").getView());
}
