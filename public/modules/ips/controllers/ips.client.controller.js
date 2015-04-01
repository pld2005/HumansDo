'use strict';

angular.module('ips').controller('IpsController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Ips', 'Socket', 'Cantreg', 'IpsService', 
	function($scope, $stateParams, $location,$http,  Authentication, Ips, Socket, Cantreg, IpsService) {
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
		    var porc = (total / $scope.ips.length * 100);
		    if (soloporcetanje===1){
		    	return  Math.round(porc, 2) + '%';		    	
		    }else{
		    	return total; // + ' (' + Math.round(porc, 2) + '%)';		    	
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
		};


		$scope.getGroup = function() {
			$http.get('/combogroup').success(function (data){
				data.splice(0, 0, "-- All --");
				$scope.cbogroup = data;
				$scope.selectedCbogroup = "-- All --";
				$scope.updatesites();
				return eval(data);
			}).error(function(){

			});
		};

		$scope.updatesites = function() {
			$http.get('/combosite', {params: { groupname: $scope.selectedCbogroup }}).success(function (data){
				data.splice(0, 0, "-- All --");
				$scope.cbosite = data;
				$scope.selectedCbosite = "-- All --";
				$scope.updatezones();
				return eval(data);
			}).error(function(){

			});
		};

		$scope.updatezones = function() {
			$http.get('/combozone', {params: { groupname: $scope.selectedCbogroup , site: $scope.selectedCbosite }}).success(function (data){
				data.splice(0, 0, "-- All --");
				$scope.cbozone = data;
				$scope.selectedCbozone = "-- All --";
				$scope.findWithParams();
				return eval(data);
			}).error(function(){

			});
		};

		$scope.findWithParams = function() {
    		$scope.ips = IpsService.query({
	        	param1: $scope.selectedCbogroup,
	        	param2: $scope.selectedCbosite,
	        	param3: $scope.selectedCbozone
	    	}, function (){
				var total = 0;
		    	var total_error = 0;
		    	var total_warning = 0;
		    	var total_success = 0;
			    for(var i = 0; i < $scope.ips.length; i++){
			        var ip = $scope.ips[i];
			        if (ip.status === 'error') total_error++;
			        if (ip.status === 'warning') total_warning++;
			        if (ip.status === 'success') total_success++;

			        total += 1;
			    }
			    var resStatus = [];

				var colour_error = '#dd4b39';
				var colour_warning = '#f0ad4e';
				var colour_success = '#00a65a';

			    resStatus.push({key: 'Offline', y: total_error, color: colour_error})
			    resStatus.push({key: 'Warning', y: total_warning, color: colour_warning})
			    resStatus.push({key: 'Online', y: total_success, color: colour_success})
			    $scope.resumenStatus = resStatus;
	    	});
		};


$scope.xFunction = function(){
        return function(d){
            return d.key + ' (' + d.y + ')';
        };
    }

    $scope.yFunction = function(){
        return function(d){
            return d.y;
        };
    }

var colorArray = ['#dd4b39', '#f0ad4e', '#00a65a'];
$scope.colorFunction = function() {
	return function(d, i) {
    	return colorArray[i];
    };
}
		//----
	}
]);