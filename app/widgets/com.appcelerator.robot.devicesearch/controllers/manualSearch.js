var onCancel,
    onSuccess;

/**
 *  Constructor
 **/
(function constructor(args) {
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
		identifier : require("utils").slugify($.name.getValue()),
		created_at : require("alloy/moment")().unix()
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
