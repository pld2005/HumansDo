'use strict';

angular.module('ips').controller('IpsController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Ips', 'Socket', 'Cantreg',
	function($scope, $stateParams, $location,$http,  Authentication, Ips, Socket, Cantreg) {
		$scope.authentication = Authentication;

		       
		Socket.on('message', function(msg, id) {
		    $scope.ips = Ips.query();
		    console.log(msg);
		});

		$scope.countEvent = function(status, soloporcetanje){
		    var total = 0;
		    for(var i = 0; i < $scope.ips.length; i++){
		        var ip = $scope.ips[i];
		        if (ip.status === status)
		        total += 1;
		    }
		    if (soloporcetanje==1){
		    	return  total / $scope.ips.length * 100 + '%';		    	
		    }else{
		    	return total + ' (' + total / $scope.ips.length * 100 + '%)';		    	
		    }
		};

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

		$scope.resumen = function() {
			$http.get('/Cantreg').success(function (data){
				var xx = data;
			}).error(function(){

			});
			//var r = Ips.cantreg();



			debugger;
		};
	}
]);