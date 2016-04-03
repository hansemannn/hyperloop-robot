var robot;

/**
 *  Constructor
 **/
(function constructor(args) {
	robot = args.robot;
})(arguments[0] || {});

function executeTestCommand() {
    var file = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), "/commands/dance1.sphero");
    robot.runMacro(file.resolve(), 1337);
}
