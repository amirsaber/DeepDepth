'use strict';

// Queries controller
angular.module('queries').controller('QueriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Queries', 'Jobtypes',
	function($scope, $stateParams, $location, Authentication, Queries, Jobtypes) {
		$scope.authentication = Authentication;

		//Get availble Jobtype
		$scope.jobtypes = Jobtypes.query();

		//Initialize a temp query
		$scope.init = function() {
			$scope.query = {};
			$scope.query.fields = [];
		};

		// Create new Query
		$scope.create = function() {
			// Create new Query object\
			var query = new Queries({
				name: this.name,
				job: this.myJobtype,
				fields: this.query.fields
			});
			// Redirect after save
			query.$save(function(response) {
				$location.path('queries/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.myJobtype = {};
				$scope.fields = [];
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Query
		$scope.remove = function(query) {
			if (query) {
				query.$remove();

				for (var i in $scope.queries) {
					if ($scope.queries[i] === query) {
						$scope.queries.splice(i, 1);
					}
				}
			}
			else {
				$scope.query.$remove(function() {
					$location.path('queries');
				});
			}
		};

		// Update existing Query
		$scope.update = function() {
			var query = $scope.query;

			query.$update(function() {
				$location.path('queries/' + query._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Queries
		$scope.find = function() {
			$scope.queries = Queries.query();
		};

		// Find existing Query
		$scope.findOne = function() {
			$scope.query = Queries.get({
				queryId: $stateParams.queryId
			});
		};

		// On changing job type
		$scope.jobChange = function() {
			$scope.query.fields = [];
		};
		
		//On changing graph type
		$scope.graphChange = function() {
			$scope.myGraph = this.myGraphType;
		};
	}
]);