var devices;

/**
 *  Constructor
 **/
(function constructor() {

	if (Ti.App.getDeployType() == "development") {
		Ti.UI.createAlertDialog({
			title: "Warning",
			message: "This application requires a Bluetooth-capable device. Please run this application on a device and try again."
		}).show();
		return;
	}

	devices = Alloy.Collections.instance("device");
	devices.fetch({
		success: bootApplication
	});
})();

function bootApplication() {
	if (hasDevices()) {
		Alloy.createWidget("com.appcelerator.robot.devicelist").getView().open();
	} else {
		Alloy.createWidget("com.appcelerator.robot.devicesearch").getView().open();
	}
}

function hasDevices() {
	return devices.models && devices.models.length > 0;
}
