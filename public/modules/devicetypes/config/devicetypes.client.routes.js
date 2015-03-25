'use strict';

//Setting up route
angular.module('devicetypes').config(['$stateProvider',
	function($stateProvider) {
		// Devicetypes state routing
		$stateProvider.
		state('listDevicetypes', {
			url: '/devicetypes',
			templateUrl: 'modules/devicetypes/views/list-devicetypes.client.view.html'
		}).
		state('createDevicetype', {
			url: '/devicetypes/create',
			templateUrl: 'modules/devicetypes/views/create-devicetype.client.view.html'
		}).
		state('viewDevicetype', {
			url: '/devicetypes/:devicetypeId',
			templateUrl: 'modules/devicetypes/views/view-devicetype.client.view.html'
		}).
		state('editDevicetype', {
			url: '/devicetypes/:devicetypeId/edit',
			templateUrl: 'modules/devicetypes/views/edit-devicetype.client.view.html'
		});
	}
]);