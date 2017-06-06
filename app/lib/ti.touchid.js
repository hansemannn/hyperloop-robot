/**
 * Ti.TouchID
 *
 * Summary:	Support native Touch ID with Hyperloop in Titanium Mobile.
 * Author: 	Hans Knoechel | Appcelerator, Inc
 * Date: 	03/22/2016
 * Version:	0.1.0
 * Example
 *
 *	var touchID = require("ti.touchid");
 *	if (touchID.isSupported()) {
 *		touchID.authenticate({
 *			reason : "Please verify to reset all devices",
 *			callback : function(e) {
 * 				Ti.API.warn("Success? - " + e.success);
 *				Ti.API.warn("Error? - " + e.error);
 *				Ti.API.warn("Code? - " + e.code);
 *			}
 *		});
 *	}
 */

var UIDevice = require("UIKit/UIDevice");
var NSNumericSearch = require("Foundation").NSNumericSearch;
var NSOrderedAscending = require("Foundation").NSOrderedAscending;
var LAContext = require('LocalAuthentication/LAContext');
var LocalAuthentication = require('LocalAuthentication/LocalAuthentication');
var context = new LAContext();

function isSupported() {
	var currentOSSupported = UIDevice.currentDevice.systemVersion.compareOptions("8.0", NSNumericSearch) != NSOrderedAscending;
	var touchIDSupported = context.canEvaluatePolicyError(LocalAuthentication.LAPolicyDeviceOwnerAuthenticationWithBiometrics);

	return currentOSSupported && touchIDSupported;
}

function authenticate(args) {
	var reason = args.reason || null;
	var callback = args.callback || null;

	if (!reason || !callback) {
		Ti.API.error("Ti.TouchID: Please provide a valid 'reason' and 'callback' parameter.");
		return;
	}

	context.evaluatePolicyLocalizedReasonReply(LocalAuthentication.LAPolicyDeviceOwnerAuthenticationWithBiometrics, reason, function(success, error) {		
		var attrs = {
			success : success
		};

		if (error) {
			attrs["error"] = error.localizedDescription;
			attrs["code"] = error.code;
		}

		callback(attrs);
	});
}

exports.isSupported = isSupported;
exports.authenticate = authenticate;
