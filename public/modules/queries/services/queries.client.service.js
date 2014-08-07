'use strict';

//Queries service used to communicate Queries REST endpoints
angular.module('queries').factory('Queries', ['$resource',
	function($resource) {
		return $resource('queries/:queryId', { queryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);