var searchTimeout,
    timeoutOffset,
    cb,
    nav,
    moment,
    SEARCH_STATE,
    currentSearchState,
    RKConvenienceRobot,
    RKRobotDiscoveryAgent,
    TiSphero;

/**
 *  Constructor
 **/
(function constructor() {

	RKConvenienceRobot = require("RobotKit/RKConvenienceRobot");
    RKRobotDiscoveryAgent = require("RobotKit/RKRobotDiscoveryAgent");
    TiSphero = require("ti.sphero");
    moment = require("alloy/moment");

    SEARCH_STATE = {
        DEFAULT: 0,
        MODAL: 1
    };

    currentSearchState = SEARCH_STATE.DEFAULT;
	timeoutOffset = 20000;

    TiSphero.addEventListener("connectionchange", handleConnectionChange);
})();

function handleConnectionChange(e) {
    clearSearchTimeout();

    if (e.status == TiSphero.CONNECTION_STATUS_CONNECTING) {
        $.loaderText.setText("Connecting ...");
    } else if (e.status == TiSphero.CONNECTION_STATUS_CONNECTED) {
        $.loaderText.setText("Robot connected!");
        TiSphero.stopDiscovery();
        setTimeout(function() {
            createRobot();
        }, 500);
    } else {
        // hideLoader();
        // $.alert.show();
    }
}

function createRobot() {
    var devices = Alloy.Collections.instance("device");
    var foundDevices = [];
    var robot;

    devices.fetch();
    foundDevices = devices.where({
        title: TiSphero.getRobotName()
    });

    if (foundDevices.length == 1) {
        robot = foundDevices[0];
        robot.set("connected", true);
        robot.save();
    } else {
        var robot = Alloy.createModel("device", {
            identifier: require("utils").slugify(TiSphero.getRobotName()),
            title: TiSphero.getRobotName(),
            created_at : moment().unix(),
            connected: true
        });
        robot.save();
    }

    openDeviceList();
}

function searchDevices() {

	clearSearchTimeout();
	showLoader();

    TiSphero.startDiscovery();

	searchTimeout = setTimeout(function() {
        TiSphero.stopDiscovery();

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
