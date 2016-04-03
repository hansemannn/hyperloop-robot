var devices,
	TiSphero;

/**
 *  Constructor
 **/
(function constructor() {
	TiSphero = Ti.App.deployType != "development" ? require("ti.sphero") : mockSphero();

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
	search.setSphero(TiSphero);
	search.open();
}

function openDeviceList() {
	var list = Alloy.createWidget("com.appcelerator.robot.devicelist");
	list.setSphero(TiSphero);
	list.open();
}

function disconnectDevices() {
	/*if (ENV_DEV) {
		return;
	}*/

	TiSphero.disconnectAll();
	TiSphero.stopDiscovery();
}

function hasDevices() {
	return devices.models && devices.models.length > 0;
}

function mockSphero() {
	return {
		disconnectAll: function() {
			Ti.API.warn("Ti.Sphero (mocked): disconnectAll()");
		},
		stopDiscovery: function() {
			Ti.API.warn("Ti.Sphero (mocked): stopDiscovery()");
		},
		isDiscovering: function() {
			Ti.API.warn("Ti.Sphero (mocked): isDiscovering()");
			return false;
		}
	};
}
