var devices,
    moment,
    isSearching,
    TiSphero;

/**
 *  Constructor
 **/
(function constructor() {
	devices = Alloy.Collections.instance("device");
	moment = require("alloy/moment");
    isSearching = false;

	// TODO: Think about start process to update the known device-status on start

	setUI();
})();

function setUI() {

	function configureCells() {
		var cells = [];

		_.each(devices.models, function(device) {
			var isConnected = device.get("connected") == true;

			cells.push({
				properties : {
					itemId : device.get("id"),
					backgroundColor : "transparent",
					selectionStyle : Ti.UI.iPhone.ListViewCellSelectionStyle.NONE,
					canEdit : true,
					height : 140
				},
				title : {
					text : device.get("title") + " [" + device.get("identifier") + "]"
				},
				subtitle : {
					text : "Added " + moment(device.get("created_at") * 1000).format("YYYY/MM/DD")
				},
				statusBadge : {
					tintColor : isConnected ? "#3dcb3d" : "#dbdbdb",
					image : "/images/icons/" + ( isConnected ? "connected" : "disconnected") + ".png"
				},
				statusLabel : {
					text : isConnected ? "Connected" : "Not connected"
				},
			});
		});

		$.listSection.setItems(cells);
	}


	devices.fetch({
		success : configureCells
	});
}

function refreshDevices() {
	var deviceSearch = Alloy.createWidget("com.appcelerator.robot.devicesearch");
	deviceSearch.setSphero(TiSphero);

	deviceSearch.open({
		onFound : setUI
	});
}

function openSettings() {
	Alloy.createWidget("com.appcelerator.robot.settings").getView().open({
		modal : true
	});
}

function deleteDevice(e) {
	var model = devices.get(e.itemId);
	model.destroy();
	delete model;

	devices.fetch();

	if (devices.models && devices.models.length == 0) {
		refreshDevices();
	}
}

function openDetails(e) {

    if (isSearching === true) {
        Ti.UI.createAlertDialog({
            title: "Warning",
            message: "You are currently connectiong to a device, please wait."
        }).show();
        return;
    }

    isSearching = true;

	if (Ti.App.getDeployType() == "development") {
		Ti.API.warn("The Sphero SDK is for devices-only, mocking ...");

		$.nav.openWindow(Alloy.createWidget("com.appcelerator.robot.devicedetails", {
			nav : $.nav,
			robot : {}
		}).getView());

		return;
	}

	var model = devices.get(e.itemId);

    stopDiscovery();
	TiSphero.addEventListener("connectionchange", handleDiscovery);
	TiSphero.startDiscovery();
}

function handleDiscovery(_e) {
    if (_e.status == TiSphero.CONNECTION_STATUS_ONLINE) {

        if (!_e.robot) {
            Ti.API.error("Invalid state - No robot found!");
            return;
        }

        stopDiscovery();
        isSearching = false;

        $.nav.openWindow(Alloy.createWidget("com.appcelerator.robot.devicedetails", {
            nav : $.nav,
            robot : _e.robot
        }).getView());
    } else if (_e.status == TiSphero.CONNECTION_STATUS_OFFLINE) {
        showNotConnectedWarning();
        stopDiscovery();
        isSearching = false;
    }
}

function stopDiscovery() {
    if (TiSphero.isDiscovering()) {
        TiSphero.stopDiscovery();
    }

    TiSphero.removeEventListener("connectionchange", handleDiscovery);
}

function showNotConnectedWarning() {
	$.alert.show();
}

exports.setSphero = function(_TiSphero) {
	TiSphero = _TiSphero;

    if (TiSphero.isDiscovering()) {
        TiSphero.stopDiscovery();
    }
};

exports.open = function() {
	$.nav.open();
};
