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

				for (var i in $scope.users) {
					if ($scope.users[i] === user) {
						$scope.users.splice(i, 1);
					}
				}
			} else {
				$scope.user.$remove(function() {
					$location.path('managmentusers');
				});
			}
		};


		// Update existing Personal
		$scope.adminUpdate = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.managmentuser);

				user.$update(function(response) {
					$scope.success = true;
					$location.path('managmentusers');
					Notification.success({message: 'Registro actualizado!', delay: 3000});

				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};
	}
]);