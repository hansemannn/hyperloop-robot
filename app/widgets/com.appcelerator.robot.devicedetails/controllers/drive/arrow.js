
/**
 *  Constructor
 **/
(function constructor(args) {
	setUI();
})(arguments[0] || {});

function setUI() {
	var UIView = require('UIKit/UIView'),
	    UIColor = require('UIKit/UIColor'),
	    UIBezierPath = require('UIKit/UIBezierPath'),
	    CAShapeLayer = require('QuartzCore/CAShapeLayer'),
	    CGPointMake = require('CoreGraphics').CGPointMake;

	var view = UIView.cast($.container);

	var color = {
		red : 1,
		green : 1,
		blue : 1,
		alpha : 1
	};

	var path = UIBezierPath.bezierPath();
	path.moveToPoint(CGPointMake(0,0));
	path.addLineToPoint(CGPointMake(20,20));
	path.addLineToPoint(CGPointMake(0,40));

	var shapeLayer = CAShapeLayer.layer();
	shapeLayer.path = path.CGPath;
	shapeLayer.strokeColor = UIColor.colorWithRedGreenBlueAlpha(color.red, color.green, color.blue, color.alpha).CGColor;
	shapeLayer.fillColor = UIColor.clearColor().CGColor;
	shapeLayer.lineWidth = 2;
	shapeLayer.strokeStart = 0.0;
	shapeLayer.strokeEnd = 1.0;
	view.layer.addSublayer(shapeLayer);
}

function bubble() {
	// Bubbles to parent view
}
