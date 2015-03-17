'use strict';

(function() {
	// Ips Controller Spec
	describe('Ips Controller Tests', function() {
		// Initialize global variables
		var IpsController,
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

			// Initialize the Ips controller.
			IpsController = $controller('IpsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Ip object fetched from XHR', inject(function(Ips) {
			// Create sample Ip using the Ips service
			var sampleIp = new Ips({
				name: 'New Ip'
			});

			// Create a sample Ips array that includes the new Ip
			var sampleIps = [sampleIp];

			// Set GET response
			$httpBackend.expectGET('ips').respond(sampleIps);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ips).toEqualData(sampleIps);
		}));

		it('$scope.findOne() should create an array with one Ip object fetched from XHR using a ipId URL parameter', inject(function(Ips) {
			// Define a sample Ip object
			var sampleIp = new Ips({
				name: 'New Ip'
			});

			// Set the URL parameter
			$stateParams.ipId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/ips\/([0-9a-fA-F]{24})$/).respond(sampleIp);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ip).toEqualData(sampleIp);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Ips) {
			// Create a sample Ip object
			var sampleIpPostData = new Ips({
				name: 'New Ip'
			});

			// Create a sample Ip response
			var sampleIpResponse = new Ips({
				_id: '525cf20451979dea2c000001',
				name: 'New Ip'
			});

			// Fixture mock form input values
			scope.name = 'New Ip';

			// Set POST response
			$httpBackend.expectPOST('ips', sampleIpPostData).respond(sampleIpResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Ip was created
			expect($location.path()).toBe('/ips/' + sampleIpResponse._id);
		}));

		it('$scope.update() should update a valid Ip', inject(function(Ips) {
			// Define a sample Ip put data
			var sampleIpPutData = new Ips({
				_id: '525cf20451979dea2c000001',
				name: 'New Ip'
			});

			// Mock Ip in scope
			scope.ip = sampleIpPutData;

			// Set PUT response
			$httpBackend.expectPUT(/ips\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/ips/' + sampleIpPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid ipId and remove the Ip from the scope', inject(function(Ips) {
			// Create new Ip object
			var sampleIp = new Ips({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Ips array and include the Ip
			scope.ips = [sampleIp];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/ips\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleIp);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.ips.length).toBe(0);
		}));
	});
}());