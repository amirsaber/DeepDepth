'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var graphtypes = require('../../app/controllers/graphtypes');

	// Graphtypes Routes
	app.route('/graphtypes')
		.get(graphtypes.list)
		.post(users.requiresLogin, graphtypes.create);

	app.route('/graphtypes/:graphtypeId')
		.get(graphtypes.read)
		.put(users.requiresLogin, graphtypes.hasAuthorization, graphtypes.update)
		.delete(users.requiresLogin, graphtypes.hasAuthorization, graphtypes.delete);

	// Finish by binding the Graphtype middleware
	app.param('graphtypeId', graphtypes.graphtypeByID);
};