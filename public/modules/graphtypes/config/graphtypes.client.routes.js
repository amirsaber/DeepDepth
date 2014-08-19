'use strict';

//Setting up route
angular.module('graphtypes').config(['$stateProvider',
	function($stateProvider) {
		// Graphtypes state routing
		$stateProvider.
		state('listGraphtypes', {
			url: '/graphtypes',
			templateUrl: 'modules/graphtypes/views/list-graphtypes.client.view.html'
		}).
		state('createGraphtype', {
			url: '/graphtypes/create',
			templateUrl: 'modules/graphtypes/views/create-graphtype.client.view.html'
		}).
		state('viewGraphtype', {
			url: '/graphtypes/:graphtypeId',
			templateUrl: 'modules/graphtypes/views/view-graphtype.client.view.html'
		}).
		state('editGraphtype', {
			url: '/graphtypes/:graphtypeId/edit',
			templateUrl: 'modules/graphtypes/views/edit-graphtype.client.view.html'
		});
	}
]);