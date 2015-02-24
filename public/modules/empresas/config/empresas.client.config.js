'use strict';

// Configuring the Articles module
angular.module('empresas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Empresas', 'empresas', 'dropdown', '/empresas(/create)?');
		Menus.addSubMenuItem('topbar', 'empresas', 'List Empresas', 'empresas');
		Menus.addSubMenuItem('topbar', 'empresas', 'New Empresa', 'empresas/create');
	}
]);