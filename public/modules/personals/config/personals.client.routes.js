'use strict';

//Setting up route
angular.module('personals').config(['$stateProvider',
	function($stateProvider) {
		// Personals state routing
		$stateProvider.
		state('listPersonals', {
			url: '/personals',
			templateUrl: 'modules/personals/views/list-personals.client.view.html'
		}).
		state('createPersonal', {
			url: '/personals/create',
			templateUrl: 'modules/personals/views/create-personal.client.view.html'
		}).
		state('viewPersonal', {
			url: '/personals/:personalId',
			templateUrl: 'modules/personals/views/view-personal.client.view.html'
		}).
		state('editPersonal', {
			url: '/personals/:personalId/edit',
			templateUrl: 'modules/personals/views/edit-personal.client.view.html'
		});
	}
]);