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
    moment = require("alloy/moment");

    SEARCH_STATE = {
        DEFAULT: 0,
        MODAL: 1
    };

    currentSearchState = SEARCH_STATE.DEFAULT;
	timeoutOffset = 20000;
})();

function handleConnectionChange(e) {
    clearSearchTimeout();

    if (e.status == TiSphero.CONNECTION_STATUS_CONNECTING) {
        $.loaderText.setText("Connecting ...");
    } else if (e.status == TiSphero.CONNECTION_STATUS_ONLINE) {
        $.loaderText.setText("Robot connected!");
        setTimeout(function() {
            createRobot(e.robot);
        }, 500);
    } else {
        // hideLoader();
        // $.alert.show();
    }
}

function createRobot(robot) {
    var devices = Alloy.Collections.instance("device");
    var foundDevices = [];

    devices.fetch();

    foundDevices = devices.where({
        identifier: robot.getIdentifier()
    });

    if (foundDevices.length == 1) {
        robot = foundDevices[0];
        robot.set("connected", true);
        robot.save();
    } else {
        var robot = Alloy.createModel("device", {
            identifier: robot.getIdentifier(),
            title: robot.getName(),
            created_at : moment().unix(),
            connected: true
        });
        robot.save();
    }

    if (TiSphero.isDiscovering()) {
        TiSphero.stopDiscovery();
    }

    TiSphero.removeEventListener("connectionchange", handleConnectionChange);
    openDeviceList();
}

function searchDevices() {
    if (Ti.App.getDeployType() == "development") {
    	Ti.API.warn("The Sphero SDK is for devices-only");
		$.alert.show();
    	return;
	}

	clearSearchTimeout();
	showLoader();

    TiSphero.startDiscovery();

	searchTimeout = setTimeout(function() {
        if (TiSphero.isDiscovering()) {
            TiSphero.stopDiscovery();
        }

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
    TiSphero.disconnectAll();

	var deviceList = Alloy.createWidget("com.appcelerator.robot.devicelist");
    deviceList.setSphero(TiSphero);
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

	if (!args) {
		$.window.open();
		return;
	}

    currentSearchState = SEARCH_STATE.MODAL;
    cb = args.onFound;

    openNavWindow();
};

exports.setSphero = function(_TiSphero) {
    TiSphero = _TiSphero;

    if (Ti.App.getDeployType() != "development") {
    	Ti.API.warn(TiSphero);
        TiSphero.removeEventListener("connectionchange", handleConnectionChange);
        TiSphero.addEventListener("connectionchange", handleConnectionChange);
    }
};
