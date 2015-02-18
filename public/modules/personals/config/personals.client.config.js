'use strict';

// Configuring the Articles module
angular.module('personals').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Personals', 'personals', 'dropdown', '/personals(/create)?');
		Menus.addSubMenuItem('topbar', 'personals', 'List Personals', 'personals');
		Menus.addSubMenuItem('topbar', 'personals', 'New Personal', 'personals/create');
	}
]);