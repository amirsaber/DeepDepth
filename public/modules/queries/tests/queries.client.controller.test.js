'use strict';

(function() {
	// Queries Controller Spec
	describe('Queries Controller Tests', function() {
		// Initialize global variables
		var QueriesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Queries controller.
			QueriesController = $controller('QueriesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Query object fetched from XHR', inject(function(Queries) {
			// Create sample Query using the Queries service
			var sampleQuery = new Queries({
				name: 'New Query'
			});

			// Create a sample Queries array that includes the new Query
			var sampleQueries = [sampleQuery];

			// Set GET response
			$httpBackend.expectGET('queries').respond(sampleQueries);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.queries).toEqualData(sampleQueries);
		}));

		it('$scope.findOne() should create an array with one Query object fetched from XHR using a queryId URL parameter', inject(function(Queries) {
			// Define a sample Query object
			var sampleQuery = new Queries({
				name: 'New Query'
			});

			// Set the URL parameter
			$stateParams.queryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/queries\/([0-9a-fA-F]{24})$/).respond(sampleQuery);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.query).toEqualData(sampleQuery);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Queries) {
			// Create a sample Query object
			var sampleQueryPostData = new Queries({
				name: 'New Query'
			});

			// Create a sample Query response
			var sampleQueryResponse = new Queries({
				_id: '525cf20451979dea2c000001',
				name: 'New Query'
			});

			// Fixture mock form input values
			scope.name = 'New Query';

			// Set POST response
			$httpBackend.expectPOST('queries', sampleQueryPostData).respond(sampleQueryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Query was created
			expect($location.path()).toBe('/queries/' + sampleQueryResponse._id);
		}));

		it('$scope.update() should update a valid Query', inject(function(Queries) {
			// Define a sample Query put data
			var sampleQueryPutData = new Queries({
				_id: '525cf20451979dea2c000001',
				name: 'New Query'
			});

			// Mock Query in scope
			scope.query = sampleQueryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/queries\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/queries/' + sampleQueryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid queryId and remove the Query from the scope', inject(function(Queries) {
			// Create new Query object
			var sampleQuery = new Queries({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Queries array and include the Query
			scope.queries = [sampleQuery];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/queries\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleQuery);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.queries.length).toBe(0);
		}));
	});
}());