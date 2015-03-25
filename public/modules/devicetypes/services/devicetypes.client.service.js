'use strict';

//Devicetypes service used to communicate Devicetypes REST endpoints
angular.module('devicetypes').factory('Devicetypes', ['$resource',
	function($resource) {
		return $resource('devicetypes/:devicetypeId', { devicetypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);