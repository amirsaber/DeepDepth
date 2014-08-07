'use strict';

//Jobtypes service used to communicate Jobtypes REST endpoints
angular.module('jobtypes').factory('Jobtypes', ['$resource',
	function($resource) {
		return $resource('jobtypes/:jobtypeId', { jobtypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);