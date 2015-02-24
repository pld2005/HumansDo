'use strict';

//Setting up route
angular.module('empresas').config(['$stateProvider',
	function($stateProvider) {
		// Empresas state routing
		$stateProvider.
		state('listEmpresas', {
			url: '/empresas',
			templateUrl: 'modules/empresas/views/list-empresas.client.view.html'
		}).
		state('createEmpresa', {
			url: '/empresas/create',
			templateUrl: 'modules/empresas/views/create-empresa.client.view.html'
		}).
		state('viewEmpresa', {
			url: '/empresas/:empresaId',
			templateUrl: 'modules/empresas/views/view-empresa.client.view.html'
		}).
		state('editEmpresa', {
			url: '/empresas/:empresaId/edit',
			templateUrl: 'modules/empresas/views/edit-empresa.client.view.html'
		});
	}
]);