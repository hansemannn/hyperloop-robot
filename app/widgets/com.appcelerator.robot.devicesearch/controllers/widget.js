var searchTimeout,
    timeoutOffset;

/**
 *  Constructor
 **/
(function constructor() {
	timeoutOffset = 5000;
})();

function searchDevices() {

	if (searchTimeout) {
		clearTimeout(searchTimeout);
	}
	showLoader();

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
		success: function() {
			// Device found
			// TODO: Open com.appcelerator.robot.devicelist
		},
		cancel: function() {
			// Search cancelled
			$.alert.show();
		}
	});
	manuallyView.open();
}
