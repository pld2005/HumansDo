'use strict';


//Ips service used to communicate Ips REST endpoints
angular.module('ips').factory('Ips', ['$resource',
	function($resource) {
		return $resource('ips/:ipId', { ipId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

//Ips service used to communicate Ips REST endpoints
angular.module('ips').factory('Cantreg', ['$resource',
	function($resource) {
		return $resource('cantreg');
	}
]);

angular.module('ips').factory('IpsService', ['$resource',
    function($resource) {
        return $resource('ips/:param1/:param2/:param3', {
            param1: '',
            param2: '',
            param3: ''
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
