define('admin/plugins/inappropriate-words', ['settings'], function(Settings) {
	'use strict';
	/* globals $, app, socket, require */

	var ACP = {};

	ACP.init = function() {
		Settings.load('inappropriate-words', $('.inappropriate-words-settings'));

		$('#save').on('click', function() {
			Settings.save('inappropriate-words', $('.inappropriate-words-settings'), function() {
				app.alert({
					type: 'success',
					alert_id: 'inappropriate-words-saved',
					title: 'Settings Saved',
					message: 'Please reload your NodeBB to apply these settings',
					clickfn: function() {
						socket.emit('admin.reload');
					}
				});
			});
		});
	};

	return ACP;
});