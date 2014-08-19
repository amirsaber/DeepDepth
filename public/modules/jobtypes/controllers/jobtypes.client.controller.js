'use strict';

// Jobtypes controller
angular.module('jobtypes').controller('JobtypesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Jobtypes', 'Fieldtypes', 'Graphtypes',

function($scope, $stateParams, $location, Authentication, Jobtypes, Fieldtypes, Graphtypes) {
	$scope.authentication = Authentication;

	//Get availble Fieldtypes
	$scope.fieldtypes = Fieldtypes.query();
	//Get availble Graphtypes
	$scope.graphtypes = Graphtypes.query();

	//Initialize a temp jobtype
	$scope.init = function() {
		$scope.jobtype = {};
		$scope.jobtype.fields = [];
		$scope.jobtype.graphs = [];
	};

	//remove item from fields
	$scope.removeFromFields = function() {
		$scope.jobtype.fields.splice(this.$index, 1);
	};

	//Add selected Fieldtype to fields
	$scope.addToFields = function() {
		$scope.jobtype.fields.push($scope.myFieldtype);
	};
	
	//remove item from graphs
	$scope.removeFromGraphs = function() {
		$scope.jobtype.graphs.splice(this.$index, 1);
	};

	//Add selected Graphtype to graphs
	$scope.addToGraphs = function() {
		$scope.jobtype.graphs.push($scope.myGraphtype);
	};

	// Create new Jobtype
	$scope.create = function() {
		// Create new Jobtype object
		var jobtype = new Jobtypes({
			name: this.name,
			address: this.address,
			fields: this.jobtype.fields,
			graphs: this.jobtype.graphs
		});

		// Redirect after save
		jobtype.$save(function(response) {
			$location.path('jobtypes/' + response._id);

			// Clear form fields
			$scope.name = '';
			$scope.address = '';
			$scope.jobtype.fields = [];
			$scope.jobtype.graphs = [];
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
		});
	};

	// Remove existing Jobtype
	$scope.remove = function(jobtype) {
		if (jobtype) {
			jobtype.$remove();

			for (var i in $scope.jobtypes) {
				if ($scope.jobtypes[i] === jobtype) {
					$scope.jobtypes.splice(i, 1);
				}
			}
		}
		else {
			$scope.jobtype.$remove(function() {
				$location.path('jobtypes');
			});
		}
	};

	// Update existing Jobtype
	$scope.update = function() {
		var jobtype = $scope.jobtype;

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
}]);