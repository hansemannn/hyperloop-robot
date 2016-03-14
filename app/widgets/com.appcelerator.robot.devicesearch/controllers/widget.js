var searchTimeout,
    timeoutOffset,
    cb,
    nav,
    SEARCH_STATE,
    currentSearchState,
    RKConvenienceRobot,
    RKRobotDiscoveryAgent;

/**
 *  Constructor
 **/
(function constructor() {

	RKConvenienceRobot = require("RobotKit/RKConvenienceRobot");
    RKRobotDiscoveryAgent = require("RobotKit/RKRobotDiscoveryAgent");

    SEARCH_STATE = {
        DEFAULT: 0,
        MODAL: 1
    };

    currentSearchState = SEARCH_STATE.DEFAULT;

	timeoutOffset = 5000;
})();

function searchDevices() {

	clearSearchTimeout();
	showLoader();

	// Todo: Search here and call `openDeviceList()` or `invokeCallback`
	// Ti.API.warn("isDiscovering: " + RKRobotDiscoveryAgent.sharedAgent().isDiscovering());

	searchTimeout = setTimeout(function() {
		hideLoader();
		$.alert.show();
	}, timeoutOffset);
}

function clearSearchTimeout() {
    if (searchTimeout) {
		clearTimeout(searchTimeout);
	}
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
            if (currentSearchState == SEARCH_STATE.MODAL) {
                invokeCallbasck();
            } else {
                openDeviceList();
            }
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

function close() {
    nav && nav.close();
}

function invokeCallbasck() {
    cb && cb();
    close();
}

function openNavWindow() {
    nav = Ti.UI.iOS.createNavigationWindow({
        window: $.window
    });

    nav.open({
        modal: true
    });
}

exports.open = function(args) {
    currentSearchState = SEARCH_STATE.MODAL;
    cb = args.onFound;

    openNavWindow();
};
