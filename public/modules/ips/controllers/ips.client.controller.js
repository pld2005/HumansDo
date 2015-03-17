'use strict';

// Ips controller
angular.module('ips').controller('IpsController', ['$scope', '$stateParams', '$location','Authentication', 'Ips',
	function($scope, $stateParams, $location, Authentication, Ips) {
		$scope.authentication = Authentication;

		// Create new Ip
		$scope.create = function() {
			// Create new Ip object
			var ip = new Ips ({
				name: this.name
			});

			// Redirect after save
			ip.$save(function(response) {
				$location.path('ips/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Ip
		$scope.remove = function(ip) {
			if ( ip ) { 
				ip.$remove();

				for (var i in $scope.ips) {
					if ($scope.ips [i] === ip) {
						$scope.ips.splice(i, 1);
					}
				}
			} else {
				$scope.ip.$remove(function() {
					$location.path('ips');
				});
			}
		};

		// Update existing Ip
		$scope.update = function() {
			var ip = $scope.ip;

			ip.$update(function() {
				$location.path('ips/' + ip._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Ips
		$scope.find = function() {
			$scope.ips = Ips.query();
		};

		// Find existing Ip
		$scope.findOne = function() {
			$scope.ip = Ips.get({ 
				ipId: $stateParams.ipId
			});
		};
	}
]);