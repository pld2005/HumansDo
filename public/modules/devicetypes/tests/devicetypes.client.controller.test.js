'use strict';

(function() {
	// Devicetypes Controller Spec
	describe('Devicetypes Controller Tests', function() {
		// Initialize global variables
		var DevicetypesController,
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

			// Initialize the Devicetypes controller.
			DevicetypesController = $controller('DevicetypesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Devicetype object fetched from XHR', inject(function(Devicetypes) {
			// Create sample Devicetype using the Devicetypes service
			var sampleDevicetype = new Devicetypes({
				name: 'New Devicetype'
			});

			// Create a sample Devicetypes array that includes the new Devicetype
			var sampleDevicetypes = [sampleDevicetype];

			// Set GET response
			$httpBackend.expectGET('devicetypes').respond(sampleDevicetypes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.devicetypes).toEqualData(sampleDevicetypes);
		}));

		it('$scope.findOne() should create an array with one Devicetype object fetched from XHR using a devicetypeId URL parameter', inject(function(Devicetypes) {
			// Define a sample Devicetype object
			var sampleDevicetype = new Devicetypes({
				name: 'New Devicetype'
			});

			// Set the URL parameter
			$stateParams.devicetypeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/devicetypes\/([0-9a-fA-F]{24})$/).respond(sampleDevicetype);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.devicetype).toEqualData(sampleDevicetype);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Devicetypes) {
			// Create a sample Devicetype object
			var sampleDevicetypePostData = new Devicetypes({
				name: 'New Devicetype'
			});

			// Create a sample Devicetype response
			var sampleDevicetypeResponse = new Devicetypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Devicetype'
			});

			// Fixture mock form input values
			scope.name = 'New Devicetype';

			// Set POST response
			$httpBackend.expectPOST('devicetypes', sampleDevicetypePostData).respond(sampleDevicetypeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Devicetype was created
			expect($location.path()).toBe('/devicetypes/' + sampleDevicetypeResponse._id);
		}));

		it('$scope.update() should update a valid Devicetype', inject(function(Devicetypes) {
			// Define a sample Devicetype put data
			var sampleDevicetypePutData = new Devicetypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Devicetype'
			});

			// Mock Devicetype in scope
			scope.devicetype = sampleDevicetypePutData;

			// Set PUT response
			$httpBackend.expectPUT(/devicetypes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/devicetypes/' + sampleDevicetypePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid devicetypeId and remove the Devicetype from the scope', inject(function(Devicetypes) {
			// Create new Devicetype object
			var sampleDevicetype = new Devicetypes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Devicetypes array and include the Devicetype
			scope.devicetypes = [sampleDevicetype];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/devicetypes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDevicetype);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.devicetypes.length).toBe(0);
		}));
	});
}());