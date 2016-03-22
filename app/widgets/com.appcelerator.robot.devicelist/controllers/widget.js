var devices,
    moment;

/**
 *  Constructor
 **/
(function constructor() {
	devices = Alloy.Collections.instance("device");
	moment = require("alloy/moment");

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
		// TODO: Find out why the app crashes without timeout. Main thread issue?
		setTimeout(function() {
			$.nav.close();
			Alloy.createWidget("com.appcelerator.robot.devicesearch").getView().open();
		}, 250);
	}
}

function openDetails(e) {
    if (Ti.App.getDeployType() == "development") {
    	Ti.API.warn("The Sphero SDK is for devices-only, mocking ...");

        $.nav.openWindow(Alloy.createWidget("com.appcelerator.robot.devicedetails", {
            nav : $.nav,
            robot: {
                getName: function() {
                    return "test"
                }
            }
        }).getView());

    	return;
    }

    var model = devices.get(e.itemId);
    var TiSphero = require("ti.sphero");

	if (!model.get("connected")) {
        TiSphero = null;
        delete TiSphero;
		showNotConnectedWarning();
		return;
	}

    function handleDiscovery(_e) {
        if (_e.status == TiSphero.CONNECTION_STATUS_ONLINE) {

            if (!_e.robot) {
                Ti.API.error("Invalid state - No robot found!");
                return;
            }

        	$.nav.openWindow(Alloy.createWidget("com.appcelerator.robot.devicedetails", {
        		nav : $.nav,
                robot: _e.robot
        	}).getView());

            stopDiscovery()
        } else if (_e.status == TiSphero.CONNECTION_STATUS_OFFLINE) {
            showNotConnectedWarning();
            stopDiscovery()
        }
    }

    function stopDiscovery() {
        TiSphero.stopDiscovery();
        TiSphero.removeEventListener("connectionchange", handleDiscovery);

        TiSphero = null;
        delete TiSphero;
    }

    TiSphero.addEventListener("connectionchange", handleDiscovery);
    TiSphero.startDiscovery();
}

function showNotConnectedWarning() {
	$.alert.show();
}
