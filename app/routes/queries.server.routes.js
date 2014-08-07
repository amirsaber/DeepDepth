'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var queries = require('../../app/controllers/queries');

	// Queries Routes
	app.route('/queries')
		.get(queries.list)
		.post(users.requiresLogin, queries.create);

	app.route('/queries/:queryId')
		.get(queries.read)
		.put(users.requiresLogin, queries.hasAuthorization, queries.update)
		.delete(users.requiresLogin, queries.hasAuthorization, queries.delete);

	// Finish by binding the Query middleware
	app.param('queryId', queries.queryByID);
};