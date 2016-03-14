var devices,
    moment;

/**
 *  Constructor
 **/
(function constructor() {
	devices = Alloy.Collections.instance("device");
	moment = require("alloy/moment");

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
					text : device.get("title")
				},
				subtitle : {
					text : "Added " + moment(device.get("created_at") * 1000).format("YYYY/MM/DD")
				},
				statusBadge : {
					tintColor : isConnected ? "green" : "gray",
					image : "/images/icons/disconnected.png"
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
	// TODO: Open settings widget com.appcelerator.robot.settings
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
	var model = devices.get(e.itemId);

	if (!model.get("connected")) {
		showNotConnectedWarning();
		return;
	}

	$.nav.openWindow(Alloy.createWidget("com.appcelerator.robot.devicedetails", {
		nav : $.nav,
		id : e.itemId
	}).getView());
}

function showNotConnectedWarning() {
	$.alert.show();
}
