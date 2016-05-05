
var bluetoothManager,
    CBCentralManager = require('CoreBluetooth/CBCentralManager'),
    CBCentralManagerStateResetting = require('CoreBluetooth/CBCentralManager').CBCentralManagerStateResetting,
    CBCentralManagerStateUnsupported = require('CoreBluetooth/CBCentralManager').CBCentralManagerStateUnsupported,
    CBCentralManagerStateUnauthorized = require('CoreBluetooth/CBCentralManager').CBCentralManagerStateUnauthorized,
    CBCentralManagerStatePoweredOff = require('CoreBluetooth/CBCentralManager').CBCentralManagerStatePoweredOff,
    CBCentralManagerStatePoweredOn = require('CoreBluetooth/CBCentralManager').CBCentralManagerStatePoweredOn;

/**
 * Checks the current bluetooth environment
 * @param {KrollCallback} cb The callback to execute on status changes.
 */
exports.checkEnvironment = function(cb) {
    var MyBluetoothManagerInstance = createBluetoothDelegate();
    var MyBluetoothManager = new MyBluetoothManagerInstance();
    
    // Triggered by the `CBCentralManagerDelegate`
    MyBluetoothManager.didUpdateState = function(central) {
        var message = '';
        
        switch(bluetoothManager.state) {
            case CBCentralManagerStateResetting: 
                message = 'The connection with the system service was momentarily lost, update imminent.'; 
                break;
            case CBCentralManagerStateUnsupported: 
                message = 'The platform doesn\'t support Bluetooth Low Energy.'; 
                break;
            case CBCentralManagerStateUnauthorized: 
                message = 'The app is not authorized to use Bluetooth Low Energy.'; 
                break;
            case CBCentralManagerStatePoweredOff: 
                message = 'Bluetooth is currently powered off.'; 
                break;
            case CBCentralManagerStatePoweredOn: 
                message = 'Bluetooth is currently powered on and available to use.'; 
                break;
            default: 
                message = 'State unknown, update imminent.'; 
                break;
        }
        
        Ti.API.debug("Bluetooth-state changed: " + message);
        
        cb({
            status: bluetoothManager.state,
            message: message
        });
    };
    
    // Initialize the `CBCentralManager`
    bluetoothManager = CBCentralManager.alloc().initWithDelegateQueue(MyBluetoothManager,null);
    
    // Get initial state
    MyBluetoothManager.didUpdateState(bluetoothManager);
};

function createBluetoothDelegate() {
    var MyBluetoothManager = Hyperloop.defineClass('MyBluetoothManager', 'NSObject', ['CBCentralManagerDelegate']);
    
    MyBluetoothManager.addMethod({
        selector: 'centralManagerDidUpdateState:',
        instance: true,
        arguments: ['CBCentralManager'],
        callback: function (central) {
            if (this.didUpdateState) {
                this.didUpdateState(central);
            } else {
                Ti.API.error('didUpdateState not implemented!');
            }
        }
    });
    
    return MyBluetoothManager; 
}