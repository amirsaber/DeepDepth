'use strict';

(function() {
	// Graphtypes Controller Spec
	describe('Graphtypes Controller Tests', function() {
		// Initialize global variables
		var GraphtypesController,
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

			// Initialize the Graphtypes controller.
			GraphtypesController = $controller('GraphtypesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Graphtype object fetched from XHR', inject(function(Graphtypes) {
			// Create sample Graphtype using the Graphtypes service
			var sampleGraphtype = new Graphtypes({
				name: 'New Graphtype'
			});

			// Create a sample Graphtypes array that includes the new Graphtype
			var sampleGraphtypes = [sampleGraphtype];

			// Set GET response
			$httpBackend.expectGET('graphtypes').respond(sampleGraphtypes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.graphtypes).toEqualData(sampleGraphtypes);
		}));

		it('$scope.findOne() should create an array with one Graphtype object fetched from XHR using a graphtypeId URL parameter', inject(function(Graphtypes) {
			// Define a sample Graphtype object
			var sampleGraphtype = new Graphtypes({
				name: 'New Graphtype'
			});

			// Set the URL parameter
			$stateParams.graphtypeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/graphtypes\/([0-9a-fA-F]{24})$/).respond(sampleGraphtype);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.graphtype).toEqualData(sampleGraphtype);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Graphtypes) {
			// Create a sample Graphtype object
			var sampleGraphtypePostData = new Graphtypes({
				name: 'New Graphtype'
			});

			// Create a sample Graphtype response
			var sampleGraphtypeResponse = new Graphtypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Graphtype'
			});

			// Fixture mock form input values
			scope.name = 'New Graphtype';

			// Set POST response
			$httpBackend.expectPOST('graphtypes', sampleGraphtypePostData).respond(sampleGraphtypeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Graphtype was created
			expect($location.path()).toBe('/graphtypes/' + sampleGraphtypeResponse._id);
		}));

		it('$scope.update() should update a valid Graphtype', inject(function(Graphtypes) {
			// Define a sample Graphtype put data
			var sampleGraphtypePutData = new Graphtypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Graphtype'
			});

			// Mock Graphtype in scope
			scope.graphtype = sampleGraphtypePutData;

			// Set PUT response
			$httpBackend.expectPUT(/graphtypes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/graphtypes/' + sampleGraphtypePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid graphtypeId and remove the Graphtype from the scope', inject(function(Graphtypes) {
			// Create new Graphtype object
			var sampleGraphtype = new Graphtypes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Graphtypes array and include the Graphtype
			scope.graphtypes = [sampleGraphtype];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/graphtypes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGraphtype);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.graphtypes.length).toBe(0);
		}));
	});
}());