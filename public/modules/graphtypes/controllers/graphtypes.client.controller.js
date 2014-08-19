'use strict';

// Graphtypes controller
angular.module('graphtypes').controller('GraphtypesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Graphtypes',
	function($scope, $stateParams, $location, Authentication, Graphtypes ) {
		$scope.authentication = Authentication;

		// Create new Graphtype
		$scope.create = function() {
			// Create new Graphtype object
			var graphtype = new Graphtypes ({
				name: this.name,
				script: this.script
			});

			// Redirect after save
			graphtype.$save(function(response) {
				$location.path('graphtypes/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.script = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Graphtype
		$scope.remove = function( graphtype ) {
			if ( graphtype ) { graphtype.$remove();

				for (var i in $scope.graphtypes ) {
					if ($scope.graphtypes [i] === graphtype ) {
						$scope.graphtypes.splice(i, 1);
					}
				}
			} else {
				$scope.graphtype.$remove(function() {
					$location.path('graphtypes');
				});
			}
		};

		// Update existing Graphtype
		$scope.update = function() {
			var graphtype = $scope.graphtype ;

			graphtype.$update(function() {
				$location.path('graphtypes/' + graphtype._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Graphtypes
		$scope.find = function() {
			$scope.graphtypes = Graphtypes.query();
		};

		// Find existing Graphtype
		$scope.findOne = function() {
			$scope.graphtype = Graphtypes.get({ 
				graphtypeId: $stateParams.graphtypeId
			});
		};
	}
]);