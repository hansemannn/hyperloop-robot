/**
 *  Constructor
 **/
(function constructor() {

})();

function handleAction(e) {
	var action = e.itemId;

	switch(action) {
	case "reset":
		resetDevices();
		break;
	default:
		Ti.API.warn("Unhandled action: " + action);
	}
	
	$.listView.deselectItem(e.sectionIndex, e.itemIndex);
}

function resetDevices() {
	
	function reset() {
		var devices = Alloy.Collections.instance("device");
		devices.destroyAll();
	}
	
	var touchID = require("ti.touchid");
	if (touchID.isSupported()) {
		touchID.authenticate({
			reason : "Please verify to reset all devices",
			callback : function(e) {
				
				!e.error && reset();
				
			//	Ti.API.warn("Success? - " + e.success);
			//	Ti.API.warn("Error? - " + e.error);
			//	Ti.API.warn("Code? - " + e.code);
			}
		});
	} else {
		Ti.API.info("TouchID not supported on device -> Delete directly");
		reset();
	}
}

function close() {
	$.nav.close();
}
