'use strict';

// Configuring the Articles module
angular.module('personals').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Personal', 'personals', 'dropdown', '/personals(/create)?');
		Menus.addSubMenuItem('topbar', 'personals', 'Listado', 'personals');
		Menus.addSubMenuItem('topbar', 'personals', 'Agregar', 'personals/create');
	}
]);