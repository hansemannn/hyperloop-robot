var devices;

/**
 *  Constructor
 **/
(function constructor() {
	devices = Alloy.Collections.instance("device");
	devices.fetch({
		success: bootApplication
	});
})();

function bootApplication() {
	mockDevice();

	if (hasDevices()) {
		Alloy.createWidget("com.appcelerator.robot.devicelist").getView().open();
	} else {
		Alloy.createWidget("com.appcelerator.robot.devicesearch").getView().open();
	}	
}

function mockDevice() {
	if (Ti.App.getDeployType() == "development" && !hasDevices()) {
		var moment = require("alloy/moment");
		var now = moment();

		var model = Alloy.createModel("device", {
			title : "Sphero BB-8",
			identifier : "bb-8",
			created_at : now.unix()
		});
		model.save();
	}
}

function hasDevices() {
	return devices.models && devices.models.length > 0;
}
