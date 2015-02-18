'use strict';

// Personals controller
angular.module('personals').controller('PersonalsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Personals', 'Notification',
	function($scope, $stateParams, $location, Authentication, Personals, Notification) {
		$scope.authentication = Authentication;

		// Create new Personal
		$scope.create = function() {
			// Create new Personal object
			var personal = new Personals ({
				legajo: this.legajo,
				nombre: this.nombre,
				dni: this.dni,

			});

			// Redirect after save
			personal.$save(function(response) {
				$location.path('personals');
				
				Notification.info({message: 'Registro agregado!', delay: 3000});
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Personal
		$scope.remove = function(personal) {
			if ( personal ) { 
				personal.$remove();

				for (var i in $scope.personals) {
					if ($scope.personals [i] === personal) {
						$scope.personals.splice(i, 1);
					}
				}
			} else {
				$scope.personal.$remove(function() {
					$location.path('personals');
				});
			}
		};

		// Update existing Personal
		$scope.update = function() {
			var personal = $scope.personal;

			personal.$update(function() {
				$location.path('personals');
				Notification.success({message: 'Registro actualizado!', delay: 3000});

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Personals
		$scope.find = function() {
			$scope.personals = Personals.query();
			$scope.displayCollection = [].concat($scope.personals);
			//paginacion
			$scope.itemsByPage=3;
 			//$scope.authentication.user.firstName;
		};

		// Find existing Personal
		$scope.findOne = function() {
			$scope.personal = Personals.get({ 
				personalId: $stateParams.personalId
			});
		};
	}
]);