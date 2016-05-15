var devices,
	TiSphero;
	
/**
 *  Constructor
 **/
(function constructor() {
	TiSphero = require("ti.sphero")

	if (Ti.App.getDeployType() == "development") {
		runTests();
	} else {
		initializeApplication();
	}
})();

function initializeEventDispatcher() {
	Ti.App.addEventListener("shortcutitemclick", openDeviceSearch);
	Ti.App.addEventListener("pause", disconnectDevices);
}

function initializeApplication() {
	devices = Alloy.Collections.instance("device");
	devices.fetch({
		success : bootApplication
	});
}

function bootApplication() {
	initializeEventDispatcher();

	if (hasDevices()) {
		openDeviceList();
	} else {
		openDeviceSearch();
	}
}

function runTests() {
	describe('HL-Robot Tests', function() {
		require("tests/suites");
	});

	var runner = mocha.run(function() {
		// console.log('***** TEST RESULTS *****');
		// verify(runner.results.stats, 'runner.results');
		// verify(JSON.parse(outputFile.read().text).stats, 'outputFile');
		
		initializeApplication();
	});
}

function verify(o, prefix) {
	if (o.passes === 5 && o.failures === 1 && o.pending === 2) {
		Ti.API.info('[' + prefix + '] Ti-Mocha tests ran successfully.');
	} else {
		Ti.API.error('[' + prefix + '] Ti-Mocha tests failed.');
		Ti.API.error('Expected: ' + JSON.stringify({passes:5,pending:2,failures:1}));
		Ti.API.error('Actual:   ' + JSON.stringify(o));
	}
}

function openDeviceSearch() {
	var search = Alloy.createWidget("com.appcelerator.robot.devicesearch");
	search.open();
}

function openDeviceList() {
	var list = Alloy.createWidget("com.appcelerator.robot.devicelist");
	list.open();
}

function disconnectDevices() {
	TiSphero.disconnectAll();
	TiSphero.stopDiscovery();
}

function hasDevices() {
	return devices.models && devices.models.length > 0;
}