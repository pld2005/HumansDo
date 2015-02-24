'use strict';

// Personals controller
angular.module('users').controller('UsersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Users','Notification',
	function($scope, $stateParams, $location, Authentication, Users, Notification) {
		$scope.authentication = Authentication;
		// Find a list of Users
		$scope.find = function() {
			$scope.users = Users.query();
			$scope.displayCollection = [].concat($scope.users);
			//paginacion
			$scope.itemsByPage=25;
 			//$scope.authentication.user.firstName;
		};

		// Find existing Personal
		$scope.findOne = function() {
			$scope.managmentuser = Users.get({ 
				userId: $stateParams.userId
			});
		};		

		// Remove existing Personal
		$scope.remove = function(user) {
			if ( user ) { 
				user.$remove();

				for (var i in $scope.personals) {
					if ($scope.personals[i].user === user) {
						$scope.personals.splice(i, 1);
					}
				}
			} else {
				$scope.user.$remove(function() {
					$location.path('managmentusers');
				});
			}
		};

		// Update existing Personal
		$scope.adminUpdate = function() {
			var user = $scope.managmentuser;
			user.$update(function() {
				$location.path('managmentusers');
				Notification.success({message: 'Registro actualizado!', delay: 3000});

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


	}
]);