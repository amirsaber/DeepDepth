'use strict';

//Setting up route
angular.module('jobtypes').config(['$stateProvider',
	function($stateProvider) {
		// Jobtypes state routing
		$stateProvider.
		state('listJobtypes', {
			url: '/jobtypes',
			templateUrl: 'modules/jobtypes/views/list-jobtypes.client.view.html'
		}).
		state('createJobtype', {
			url: '/jobtypes/create',
			templateUrl: 'modules/jobtypes/views/create-jobtype.client.view.html'
		}).
		state('viewJobtype', {
			url: '/jobtypes/:jobtypeId',
			templateUrl: 'modules/jobtypes/views/view-jobtype.client.view.html'
		}).
		state('editJobtype', {
			url: '/jobtypes/:jobtypeId/edit',
			templateUrl: 'modules/jobtypes/views/edit-jobtype.client.view.html'
		});
	}
]);