var onCancel,
    onSuccess,
    utils,
    moment;

/**
 *  Constructor
 **/
(function constructor(args) {
	utils = require("utils");
	moment = require("alloy/moment");
	
	onCancel = args.cancel;
	onSuccess = args.success;
})(arguments[0] || {});

function focusNameField() {
	$.name.focus();
}

function cancel() {
	close();
	onCancel && onCancel();
}

function close() {
	$.nav.close();
}

function submit() {
	var model = Alloy.createModel("device", {
		title : $.name.getValue(),
		identifier : utils.slugify($.name.getValue()),
		created_at : moment().unix(),
		connected: true
	});
	model.save();

	close();
	onSuccess && onSuccess();
}

exports = {
	open : function() {
		$.nav.open({
			modal : true
		});
	}
};
