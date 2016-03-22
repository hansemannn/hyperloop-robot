var devices;

/**
 *  Constructor
 **/
(function constructor() {
	devices = Alloy.Collections.instance("device");
	devices.fetch({
		success : bootApplication
	});
})();

function initializeEventDispatcher() {
	Ti.App.addEventListener("shortcutitemclick", openDeviceSearch);
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
	Alloy.createWidget("com.appcelerator.robot.devicesearch").getView().open();
}

function openDeviceList() {
	Alloy.createWidget("com.appcelerator.robot.devicelist").getView().open();
}

function hasDevices() {
	return devices.models && devices.models.length > 0;
}
