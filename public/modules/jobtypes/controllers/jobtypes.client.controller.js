'use strict';

// Jobtypes controller
angular.module('jobtypes').controller('JobtypesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Jobtypes',
	function($scope, $stateParams, $location, Authentication, Jobtypes ) {
		$scope.authentication = Authentication;

		// Create new Jobtype
		$scope.create = function() {
			// Create new Jobtype object
			var jobtype = new Jobtypes ({
				name: this.name
			});

			// Redirect after save
			jobtype.$save(function(response) {
				$location.path('jobtypes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Jobtype
		$scope.remove = function( jobtype ) {
			if ( jobtype ) { jobtype.$remove();

				for (var i in $scope.jobtypes ) {
					if ($scope.jobtypes [i] === jobtype ) {
						$scope.jobtypes.splice(i, 1);
					}
				}
			} else {
				$scope.jobtype.$remove(function() {
					$location.path('jobtypes');
				});
			}
		};

		// Update existing Jobtype
		$scope.update = function() {
			var jobtype = $scope.jobtype ;

			jobtype.$update(function() {
				$location.path('jobtypes/' + jobtype._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Jobtypes
		$scope.find = function() {
			$scope.jobtypes = Jobtypes.query();
		};

		// Find existing Jobtype
		$scope.findOne = function() {
			$scope.jobtype = Jobtypes.get({ 
				jobtypeId: $stateParams.jobtypeId
			});
		};
	}
]);