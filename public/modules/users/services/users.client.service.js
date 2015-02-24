'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	/*function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}*/
	function($resource) {
		return $resource('managmentusers/:userId', { userId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);