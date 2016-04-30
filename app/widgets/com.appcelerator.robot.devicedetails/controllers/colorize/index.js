var robot;

/**
 *  Constructor
 **/
(function constructor(args) {
    robot = args.robot;

    // addColorPicker();
    addColorGrid();
})(arguments[0] || {});

function addColorGrid() {

    function createViewWithColor(color) {
        var width = height = Math.floor(Ti.Platform.displayCaps.platformWidth / 3); // 3 cols per row
        var view = Ti.UI.createView({
            top: 0,
            left: 0,
            width: width,
            height: height,
            backgroundColor: color
        });

        view.addEventListener("click", selectColor);

        return view;
    }

    function selectColor(e) {
        _.each($.container.children, function(view) {
            view.animate({
                opacity: view.backgroundColor != e.source.backgroundColor ? 0.3 : 1.0
            });
        });

        robot.setLEDColor(e.source.backgroundColor);
    }

    var colors = [Alloy.CFG.styles.tintColor, 'aqua', 'blue', 'fuchsia','lime', 'maroon',
                  'navy', 'olive', 'orange', 'purple', 'red', 'silver', 'teal', 'yellow'];

    _.each(colors, function(color) {
        $.container.add(createViewWithColor(color));
    });
}

function addColorPicker() {
    var NKOColorPickerView = require("NKOColorPickerView/NKOColorPickerView"),
        UIView = require('UIKit/UIView'),
        UIColor = require('UIKit/UIColor'),
        CGRectMake = require('CoreGraphics').CGRectMake;

    var frame = CGRectMake(0, 50, Ti.Platform.displayCaps.platformWidth, Ti.Platform.displayCaps.platformHeight - 120);
    var defaultColor = UIColor.greenColor();

    var currentColorView = new UIView();
    currentColorView.setFrame(CGRectMake(0, 0, Ti.Platform.displayCaps.platformWidth, 50));
    currentColorView.setBackgroundColor(defaultColor);

    var colorDidChangeBlock = function(color) {
        currentColorView.setBackgroundColor(color);
    };

    var colorPickerView = NKOColorPickerView.alloc().initWithFrameColorAndDidChangeColorBlock(frame, defaultColor, colorDidChangeBlock);

    $.container.add(colorPickerView);
    $.container.add(currentColorView);
}
