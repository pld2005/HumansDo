'use strict';


// Empresas controller
angular.module('empresas').controller('EmpresasController', ['$scope', '$stateParams', '$location', 'Authentication','Empresas',  'Notification',
	function($scope, $stateParams, $location, Authentication, Empresas, Notification ) {
		$scope.authentication = Authentication;

     	$scope.today = function() {
	    	$scope.dt = new Date();
	 	};
	  	$scope.today();

	  	$scope.clear = function () {
	    	$scope.dt = null;
	  	};

	  	// Disable weekend selection
	  	$scope.disabled = function(date, mode) {
	    	return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
	  	};

	  	$scope.toggleMin = function() {
	    	$scope.minDate = $scope.minDate ? null : new Date();
	  	};
	  	$scope.toggleMin();

	  	$scope.open = function($event) {
	    	$event.preventDefault();
	    	$event.stopPropagation();

	    	$scope.opened = true;
	  	};

	  	$scope.dateOptions = {
	    	formatYear: 'yy',
	    	startingDay: 1
	  	};

	  	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	  	$scope.format = $scope.formats[0];
	  	
  		// Create new Empresa
		$scope.create = function() {
			// Create new Empresa object
			var empresa = new Empresas ({
				nombre: this.nombre,
				cuit: this.cuit,
				domicilio: this.domicilio,
				email: this.email,
				activo: this.activo,
				vigencia: this.vigencia
			});

			// Redirect after save
			empresa.$save(function(response) {
				$location.path('empresas');
				Notification.info({message: 'Registro agregado!', delay: 3000});

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Empresa
		$scope.remove = function(empresa) {
			if ( empresa ) { 
				empresa.$remove();

				for (var i in $scope.empresas) {
					if ($scope.empresas [i] === empresa) {
						$scope.empresas.splice(i, 1);
					}
				}
			} else {
				$scope.empresa.$remove(function() {
					$location.path('empresas');
				});
			}
		};

		// Update existing Empresa
		$scope.update = function() {
			var empresa = $scope.empresa;

			empresa.$update(function() {
				$location.path('empresas');
				Notification.success({message: 'Registro actualizado!', delay: 3000});

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Empresas
		$scope.find = function() {
			$scope.empresas = Empresas.query();
		};

		// Find existing Empresa
		$scope.findOne = function() {
			$scope.empresa = Empresas.get({ 
				empresaId: $stateParams.empresaId
			});
		};


	}
]);