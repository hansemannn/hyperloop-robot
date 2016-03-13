var searchTimeout,
    timeoutOffset,
    RKConvenienceRobot,
    RKRobotDiscoveryAgent;

/**
 *  Constructor
 **/
(function constructor() {
	
	RKConvenienceRobot = require("RobotKit/RKConvenienceRobot");
    RKRobotDiscoveryAgent = require("RobotKit/RKRobotDiscoveryAgent");

	timeoutOffset = 5000;
})();

function searchDevices() {

	if (searchTimeout) {
		clearTimeout(searchTimeout);
	}
	showLoader();

	// Todo: Search here and call `openDeviceList()`
	// Ti.API.warn("isDiscovering: " + RKRobotDiscoveryAgent.sharedAgent().isDiscovering());

	searchTimeout = setTimeout(function() {
		hideLoader();
		$.alert.show();
	}, timeoutOffset);
}

function handleDialogClick(e) {
	switch (e.index) {
	case 0:
		searchDevices();
		break;
	case 1:
		openAddManuallyView();
		break;
	default:
		Ti.API.error("Unkwnon action selected");
	}
}

function showLoader() {
	$.loader.show();
	$.content.animate({
		opacity : 1,
		duration : 450
	});
}

function hideLoader() {
	$.content.animate({
		opacity : 0,
		duration : 450
	}, function() {
		$.loader.hide();
	});
}

function openAddManuallyView() {
	var manuallyView = Widget.createController("manualSearch", {
		success : function() {
			// Device found
			openDeviceList();
		},
		cancel : function() {
			// Search cancelled
			$.alert.show();
		}
	});
	manuallyView.open();
}

function openDeviceList() {
	var deviceList = Alloy.createWidget("com.appcelerator.robot.devicelist");
	deviceList.getView().open();
}
