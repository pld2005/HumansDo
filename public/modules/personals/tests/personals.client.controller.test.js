'use strict';

(function() {
	// Personals Controller Spec
	describe('Personals Controller Tests', function() {
		// Initialize global variables
		var PersonalsController,
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

			// Initialize the Personals controller.
			PersonalsController = $controller('PersonalsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Personal object fetched from XHR', inject(function(Personals) {
			// Create sample Personal using the Personals service
			var samplePersonal = new Personals({
				name: 'New Personal'
			});

			// Create a sample Personals array that includes the new Personal
			var samplePersonals = [samplePersonal];

			// Set GET response
			$httpBackend.expectGET('personals').respond(samplePersonals);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.personals).toEqualData(samplePersonals);
		}));

		it('$scope.findOne() should create an array with one Personal object fetched from XHR using a personalId URL parameter', inject(function(Personals) {
			// Define a sample Personal object
			var samplePersonal = new Personals({
				name: 'New Personal'
			});

			// Set the URL parameter
			$stateParams.personalId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/personals\/([0-9a-fA-F]{24})$/).respond(samplePersonal);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.personal).toEqualData(samplePersonal);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Personals) {
			// Create a sample Personal object
			var samplePersonalPostData = new Personals({
				name: 'New Personal'
			});

			// Create a sample Personal response
			var samplePersonalResponse = new Personals({
				_id: '525cf20451979dea2c000001',
				name: 'New Personal'
			});

			// Fixture mock form input values
			scope.name = 'New Personal';

			// Set POST response
			$httpBackend.expectPOST('personals', samplePersonalPostData).respond(samplePersonalResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Personal was created
			expect($location.path()).toBe('/personals/' + samplePersonalResponse._id);
		}));

		it('$scope.update() should update a valid Personal', inject(function(Personals) {
			// Define a sample Personal put data
			var samplePersonalPutData = new Personals({
				_id: '525cf20451979dea2c000001',
				name: 'New Personal'
			});

			// Mock Personal in scope
			scope.personal = samplePersonalPutData;

			// Set PUT response
			$httpBackend.expectPUT(/personals\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/personals/' + samplePersonalPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid personalId and remove the Personal from the scope', inject(function(Personals) {
			// Create new Personal object
			var samplePersonal = new Personals({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Personals array and include the Personal
			scope.personals = [samplePersonal];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/personals\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePersonal);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.personals.length).toBe(0);
		}));
	});
}());