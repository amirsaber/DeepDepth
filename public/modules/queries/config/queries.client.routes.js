'use strict';

//Setting up route
angular.module('queries').config(['$stateProvider',

function($stateProvider) {
	// Queries state routing
	$stateProvider.
	state('listQueries', {
		url: '/queries',
		templateUrl: 'modules/queries/views/list-queries.client.view.html'
	}).
	state('createQuery', {
		url: '/queries/create',
		templateUrl: 'modules/queries/views/create-query.client.view.html'
	}).
	state('viewQuery', {
		url: '/queries/:queryId',
		templateUrl: 'modules/queries/views/view-query.client.view.html'
	}).
	state('editQuery', {
		url: '/queries/:queryId/edit',
		templateUrl: 'modules/queries/views/edit-query.client.view.html'
	});
}]);