'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var jobtypes = require('../../app/controllers/jobtypes');

	// Jobtypes Routes
	app.route('/jobtypes')
		.get(jobtypes.list)
		.post(users.requiresLogin, jobtypes.create);

	app.route('/jobtypes/:jobtypeId')
		.get(jobtypes.read)
		.put(users.requiresLogin, jobtypes.hasAuthorization, jobtypes.update)
		.delete(users.requiresLogin, jobtypes.hasAuthorization, jobtypes.delete);

	// Finish by binding the Jobtype middleware
	app.param('jobtypeId', jobtypes.jobtypeByID);
};