var devices,
	TiSphero;
	
/**
 *  Constructor
 **/
(function constructor() {
	TiSphero = require("ti.sphero")

	devices = Alloy.Collections.instance("device");
	devices.fetch({
		success : bootApplication
	});
})();

function initializeEventDispatcher() {
	Ti.App.addEventListener("shortcutitemclick", openDeviceSearch);
	Ti.App.addEventListener("pause", disconnectDevices);
}

function bootApplication() {
	initializeEventDispatcher();

	if (hasDevices()) {
		openDeviceList();
	} else {
		openDeviceSearch();
	}
}

function openDeviceSearch() {
	var search = Alloy.createWidget("com.appcelerator.robot.devicesearch");
	search.open();
}

function openDeviceList() {
	var list = Alloy.createWidget("com.appcelerator.robot.devicelist");
	list.open();
}

function disconnectDevices() {
	TiSphero.disconnectAll();
	TiSphero.stopDiscovery();
}

function hasDevices() {
	return devices.models && devices.models.length > 0;
}