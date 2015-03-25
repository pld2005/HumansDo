'use strict';

// Devicetypes controller
angular.module('devicetypes').controller('DevicetypesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Devicetypes',
	function($scope, $stateParams, $location, Authentication, Devicetypes) {
		$scope.authentication = Authentication;

		// Create new Devicetype
		$scope.create = function() {
			// Create new Devicetype object
			var devicetype = new Devicetypes ({
				name: this.name
			});

			// Redirect after save
			devicetype.$save(function(response) {
				$location.path('devicetypes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Devicetype
		$scope.remove = function(devicetype) {
			if ( devicetype ) { 
				devicetype.$remove();

				for (var i in $scope.devicetypes) {
					if ($scope.devicetypes [i] === devicetype) {
						$scope.devicetypes.splice(i, 1);
					}
				}
			} else {
				$scope.devicetype.$remove(function() {
					$location.path('devicetypes');
				});
			}
		};

		// Update existing Devicetype
		$scope.update = function() {
			var devicetype = $scope.devicetype;

			devicetype.$update(function() {
				$location.path('devicetypes/' + devicetype._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Devicetypes
		$scope.find = function() {
			$scope.devicetypes = Devicetypes.query();
		};

		// Find existing Devicetype
		$scope.findOne = function() {
			$scope.devicetype = Devicetypes.get({ 
				devicetypeId: $stateParams.devicetypeId
			});
		};
	}
]);