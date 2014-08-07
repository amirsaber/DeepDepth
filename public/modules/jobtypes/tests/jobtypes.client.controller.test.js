'use strict';

(function() {
	// Jobtypes Controller Spec
	describe('Jobtypes Controller Tests', function() {
		// Initialize global variables
		var JobtypesController,
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

			// Initialize the Jobtypes controller.
			JobtypesController = $controller('JobtypesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Jobtype object fetched from XHR', inject(function(Jobtypes) {
			// Create sample Jobtype using the Jobtypes service
			var sampleJobtype = new Jobtypes({
				name: 'New Jobtype'
			});

			// Create a sample Jobtypes array that includes the new Jobtype
			var sampleJobtypes = [sampleJobtype];

			// Set GET response
			$httpBackend.expectGET('jobtypes').respond(sampleJobtypes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.jobtypes).toEqualData(sampleJobtypes);
		}));

		it('$scope.findOne() should create an array with one Jobtype object fetched from XHR using a jobtypeId URL parameter', inject(function(Jobtypes) {
			// Define a sample Jobtype object
			var sampleJobtype = new Jobtypes({
				name: 'New Jobtype'
			});

			// Set the URL parameter
			$stateParams.jobtypeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/jobtypes\/([0-9a-fA-F]{24})$/).respond(sampleJobtype);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.jobtype).toEqualData(sampleJobtype);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Jobtypes) {
			// Create a sample Jobtype object
			var sampleJobtypePostData = new Jobtypes({
				name: 'New Jobtype'
			});

			// Create a sample Jobtype response
			var sampleJobtypeResponse = new Jobtypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Jobtype'
			});

			// Fixture mock form input values
			scope.name = 'New Jobtype';

			// Set POST response
			$httpBackend.expectPOST('jobtypes', sampleJobtypePostData).respond(sampleJobtypeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Jobtype was created
			expect($location.path()).toBe('/jobtypes/' + sampleJobtypeResponse._id);
		}));

		it('$scope.update() should update a valid Jobtype', inject(function(Jobtypes) {
			// Define a sample Jobtype put data
			var sampleJobtypePutData = new Jobtypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Jobtype'
			});

			// Mock Jobtype in scope
			scope.jobtype = sampleJobtypePutData;

			// Set PUT response
			$httpBackend.expectPUT(/jobtypes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/jobtypes/' + sampleJobtypePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid jobtypeId and remove the Jobtype from the scope', inject(function(Jobtypes) {
			// Create new Jobtype object
			var sampleJobtype = new Jobtypes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Jobtypes array and include the Jobtype
			scope.jobtypes = [sampleJobtype];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/jobtypes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleJobtype);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.jobtypes.length).toBe(0);
		}));
	});
}());