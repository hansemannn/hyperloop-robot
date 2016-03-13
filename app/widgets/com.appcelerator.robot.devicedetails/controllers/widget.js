var device,
    nav;

/**
 *  Constructor
 **/
(function constructor(args) {
	devices = Alloy.Collections.instance("device");
    devices.fetch();

    device = devices.get(args.id);
    $.window.setTitle(device.get("title"));
    nav = args.nav;
})(arguments[0] || {});

function openFeature(e) {
    nav.openWindow(Widget.createController(e.itemId).getView());
}
