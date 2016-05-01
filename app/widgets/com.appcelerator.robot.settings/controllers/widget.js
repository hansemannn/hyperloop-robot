var UIScreen = require('UIKit/UIScreen'),
	UIView = require('UIKit/UIView'),
	UIColor = require('UIKit/UIColor'),
	UITableView = require('UIKit/UITableView'),
	UITableViewCell = require('UIKit/UITableViewCell'),
	NSIndexPath = require('Foundation').NSIndexPath,
	UITableViewStyleGrouped = require('UIKit').UITableViewStyleGrouped,
	UITableViewCellStyleDefault = require('UIKit').UITableViewCellStyleDefault,
	UITableViewCellAccessoryDisclosureIndicator = require('UIKit').UITableViewCellAccessoryDisclosureIndicator,
	dataStructure;

/**
 *  Constructor
 **/
(function constructor() {
	$.window.add(createTableView());
	
	dataStructure = [{
		title: 'general',
		items: ['faq', 'license', 'privacy']
	}, {
		title: 'control_center',
		items: ['environment', 'delete_all_devices']
	}];
})();

function createTableView() {
	// Subclass delegate + data source
	var TableViewDataSourceAndDelegate = defineDataSourceAndDelegate();

	// Create + configure tableView
	var tableView = UITableView.alloc().initWithFrameStyle(UIScreen.mainScreen().bounds, UITableViewStyleGrouped);
	tableView.setBackgroundColor(UIColor.clearColor());
	tableView.setSeparatorColor(UIColor.colorWithRedGreenBlueAlpha(63/255, 63/255, 63/255, 1.0));

	var dataSourceDelegate = new TableViewDataSourceAndDelegate();

	dataSourceDelegate.numberOfSections = function(tableView) {
		return dataStructure.length;
	};
	
	dataSourceDelegate.numberOfRows = function(tableView, section) {		
		return dataStructure[section].items.length;
	};
	
	dataSourceDelegate.titleForHeader = function(tableView, section) {
		return L(dataStructure[section].title);
	};
	
	dataSourceDelegate.heightForRow = function(tableView, indexPath) {
		return 44;
	};
	
	dataSourceDelegate.cellForRow = function(tableView, indexPath) {
		var cell = tableView.dequeueReusableCellWithIdentifier('hyperloop_cell');
		if (!cell) {
			cell = UITableViewCell.alloc().initWithStyleReuseIdentifier(UITableViewCellStyleDefault, 'hyperloop_cell');
		}
		
		var selectionView = new UIView();
		selectionView.setBackgroundColor(UIColor.colorWithRedGreenBlueAlpha(201/255, 19/255, 38/255, 1.0));
		
		cell.backgroundColor = UIColor.colorWithRedGreenBlueAlpha(42/255, 42/255, 42/255, 1.0);
		cell.textLabel.text = L(dataStructure[indexPath.section].items[indexPath.row]);
		cell.accessoryType = UITableViewCellAccessoryDisclosureIndicator;
		cell.selectedBackgroundView = selectionView;
		
		if (indexPath.section == 1 && indexPath.row == 1) {
			cell.textLabel.textColor = UIColor.redColor();
		} else {
			cell.textLabel.textColor = UIColor.whiteColor();
		}
		
		return cell;
	};

	dataSourceDelegate.didSelectRow = function(tableView, indexPath) {
		handleAction(dataStructure[indexPath.section].items[indexPath.row]);
		tableView.deselectRowAtIndexPathAnimated(indexPath, true);
	};

	// Assign delegate + data source
	tableView.setDelegate(dataSourceDelegate);
	tableView.setDataSource(dataSourceDelegate);
	
	return tableView;
}

function defineDataSourceAndDelegate() {
	var TableViewDataSourceAndDelegate = Hyperloop.defineClass('TableViewDataSourceAndDelegate', 'NSObject', ['UITableViewDelegate', 'UITableViewDataSource']);

	TableViewDataSourceAndDelegate.addMethod({
		selector: 'numberOfSectionsInTableView:',
		instance: true,
		arguments: ['UITableView'],
		returnType: 'long',
		callback: function (tableView) {
			if (this.numberOfSections) {
				return this.numberOfSections(tableView);
			}
			return 1;
		}
	});

	TableViewDataSourceAndDelegate.addMethod({
		selector: 'tableView:numberOfRowsInSection:',
		instance: true,
		arguments: ['UITableView', 'NSInteger'],
		returnType: 'long',
		callback: function (tableView, section) {
			if (this.numberOfRows) {
				return this.numberOfRows(tableView, section);
			}
			return 1;
		}
	});

	TableViewDataSourceAndDelegate.addMethod({
		selector: 'tableView:titleForHeaderInSection:',
		instance: true,
		arguments: ['UITableView', 'long'],
		returnType: 'NSString',
		callback: function (tableView, section) {
			if (this.titleForHeader) {
				return this.titleForHeader(tableView, section);
			}
			return '';
		}
	});

	TableViewDataSourceAndDelegate.addMethod({
		selector: 'tableView:heightForRowAtIndexPath:',
		instance: true,
		arguments: ['UITableView', 'NSIndexPath'],
		returnType: 'CGFloat',
		callback: function (tableView, indexPath) {
			if (this.heightForRow) {
				return this.heightForRow(tableView, indexPath);
			}
			return 43;
		}
	});

	TableViewDataSourceAndDelegate.addMethod({
		selector: 'tableView:cellForRowAtIndexPath:',
		instance: true,
		arguments: ['UITableView', 'NSIndexPath'],
		returnType: 'UITableViewCell',
		callback: function (tableView, indexPath) {
			if (this.cellForRow) {
				return this.cellForRow(tableView, indexPath);
			}
			throw new Exception('TableViewDataSourceAndDelegate cellForRow(tableView, indexPath) missing');
		}
	});

	TableViewDataSourceAndDelegate.addMethod({
		selector: 'tableView:didSelectRowAtIndexPath:',
		instance: true,
		arguments: ['UITableView', 'NSIndexPath'],
		callback: function (tableView, indexPath) {
			if (this.didSelectRow) {
				this.didSelectRow(tableView, indexPath);
			}
		}
	});
	
	return TableViewDataSourceAndDelegate;
}

function handleAction(action) {
	switch(action) {
	case "faq":
	case "license":
	case "privacy":
		openWebView(action);
		break;
	case "delete all devices":
		resetDevices();
		break;
	default:
		Ti.API.warn("Unhandled action: " + action);
	}	
}

function openWebView(identifier) {
	var controller = Widget.createController("webview", {identifier: identifier});
	$.nav.openWindow(controller.getView());
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
