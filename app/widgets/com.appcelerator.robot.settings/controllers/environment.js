
/**
 *  Constructor
 */
(function constructor(args) {
    
})(arguments[0] || {});

function checkEnvironment() {
    var bluetooth = require("bluetooth");
    bluetooth.checkEnvironment(function(e) {
        $.status.setText(e.message);
    });    
}