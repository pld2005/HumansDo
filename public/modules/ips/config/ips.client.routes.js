'use strict';

//Setting up route
angular.module('ips').config(['$stateProvider',
	function($stateProvider) {
		// Ips state routing
		$stateProvider.
		state('listIps', {
			url: '/ips',
			templateUrl: 'modules/ips/views/list-ips.client.view.html'
		}).
		state('createIp', {
			url: '/ips/create',
			templateUrl: 'modules/ips/views/create-ip.client.view.html'
		}).
		state('viewIp', {
			url: '/ips/:ipId',
			templateUrl: 'modules/ips/views/view-ip.client.view.html'
		}).
		state('editIp', {
			url: '/ips/:ipId/edit',
			templateUrl: 'modules/ips/views/edit-ip.client.view.html'
		});
	}
]);