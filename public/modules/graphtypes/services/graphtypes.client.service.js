'use strict';

//Graphtypes service used to communicate Graphtypes REST endpoints
angular.module('graphtypes').factory('Graphtypes', ['$resource',
	function($resource) {
		return $resource('graphtypes/:graphtypeId', { graphtypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);