describe('PersistenceTest', function() {

    var devices = null;
    var initialTitle = 'Sphero #1';
    var updatedTitle = 'Sphero #2';
    var identifier = 'mocha-test';
    var should = require('tests/should');

    before(function() {
        devices = Alloy.Collections.instance('device');
    });

    it('#addDevice', function() {
        var device = Alloy.createModel('device', {
            title: initialTitle,
            identifier: identifier
        });
        device.save();
        devices.fetch();

        var foundDevices = devices.where({
            identifier: identifier
        });

        should(foundDevices).not.be.undefined;
        should(foundDevices[0].get('title')).eql(initialTitle);
    });

    it('#updateDevice', function() {
        var testModel = devices.where({
            identifier: identifier
        })[0];
        testModel.set('title', updatedTitle);
        testModel.save();

        should(testModel.get('title')).eql(updatedTitle);
    });

    it('#removeDevice', function() {
        var testModel = devices.where({
            identifier: identifier
        })[0];
        testModel.destroy();
    });

    after(function() {
        // Check something afterwards?
    });
});