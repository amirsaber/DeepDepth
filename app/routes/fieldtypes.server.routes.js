'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var fieldtypes = require('../../app/controllers/fieldtypes');

	// Fieldtypes Routes
	app.route('/fieldtypes').get(fieldtypes.list).post(users.requiresLogin, users.hasAuthorization(['admin']), fieldtypes.create);

	app.route('/fieldtypes/:fieldtypeId').get(fieldtypes.read).put(users.requiresLogin, users.hasAuthorization(['admin']), fieldtypes.update).delete(users.requiresLogin, users.hasAuthorization(['admin']), fieldtypes.delete);

	// Finish by binding the Fieldtype middleware
	app.param('fieldtypeId', fieldtypes.fieldtypeByID);
};