var utils;

/**
 *  Constructor
 **/
(function constructor(args) {
	utils = require("utils");
	setUI();
})(arguments[0] || {});

function setUI() {
	var UIView = require('UIKit/UIView'),
	    UIColor = require('UIKit/UIColor'),
	    UIScreen = require('UIKit/UIScreen'),
	    UIBezierPath = require('UIKit/UIBezierPath'),
	    CAShapeLayer = require('QuartzCore/CAShapeLayer'),
	    CABasicAnimation = require('QuartzCore/CABasicAnimation'),
	    CGPointMake = require('CoreGraphics').CGPointMake,
	    CGRectMake = require('CoreGraphics').CGRectMake;

	var view = UIView.cast($.container);

	var centerPoint = CGPointMake(150,150);
	var startAngle = 0;
	var endAngle = 360;
	var radius = 145;
	var color = {
		red : 1,
		green : 1,
		blue : 1,
		alpha : 1
	};

	var path = UIBezierPath.bezierPath();
	path.addArcWithCenterRadiusStartAngleEndAngleClockwise(centerPoint, radius, utils.DEGREES_TO_RADIANS(startAngle), utils.DEGREES_TO_RADIANS(endAngle), true);

	var shapeLayer = CAShapeLayer.layer();
	shapeLayer.path = path.CGPath;
	shapeLayer.strokeColor = UIColor.colorWithRedGreenBlueAlpha(color.red, color.green, color.blue, color.alpha).CGColor;
	shapeLayer.fillColor = UIColor.clearColor().CGColor;
	shapeLayer.lineWidth = 2;
	shapeLayer.strokeStart = 0.0;
	shapeLayer.strokeEnd = 1.0;
	view.layer.addSublayer(shapeLayer);
}
