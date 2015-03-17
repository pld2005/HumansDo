'use strict';
// Configuring the Articles module


angular.module('users').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//               (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position, icono)
		Menus.addMenuItem('topbar', 'Config', 'empresas', 'dropdown', '#',false,['superadmin'],0, 'fa fa-gear');
		Menus.addSubMenuItem('topbar', 'empresas', 'Cuentas', 'empresas');

		Menus.addSubMenuItem('topbar', 'empresas', 'Usuarios', 'managmentusers');
	}
]);
// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);