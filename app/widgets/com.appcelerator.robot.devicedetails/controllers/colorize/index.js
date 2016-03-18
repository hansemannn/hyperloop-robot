var robot;

/**
 *  Constructor
 **/
(function constructor(args) {
    var NKOColorPickerView = require("NKOColorPickerView/NKOColorPickerView"),
        UIView = require('UIKit/UIView'),
        UIColor = require('UIKit/UIColor'),
        CGRectMake = require('CoreGraphics').CGRectMake;

    var frame = CGRectMake(0, 50, Ti.Platform.displayCaps.platformWidth, Ti.Platform.displayCaps.platformHeight - 120);
    var defaultColor = UIColor.greenColor();

    var currentColorView = new UIView();
    currentColorView.setFrame(CGRectMake(0, 0, Ti.Platform.displayCaps.platformWidth, 50));
    currentColorView.setBackgroundColor(defaultColor);

    robot = args.robot;

    var colorDidChangeBlock = function(color) {
        currentColorView.setBackgroundColor(color);
    };

    var colorPickerView = NKOColorPickerView.alloc().initWithFrameColorAndDidChangeColorBlock(frame, defaultColor, colorDidChangeBlock);

    $.container.add(colorPickerView);
    $.container.add(currentColorView);

    setTimeout(function() {
        robot.setLEDColor("purple");
    },2000);

})(arguments[0] || {});
