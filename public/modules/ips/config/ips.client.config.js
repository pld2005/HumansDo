'use strict';

// Configuring the Articles module
angular.module('ips').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Ips', 'ips', 'dropdown', '/ips(/create)?');
		Menus.addSubMenuItem('topbar', 'ips', 'List Ips', 'ips');
		Menus.addSubMenuItem('topbar', 'ips', 'New Ip', 'ips/create');
	}
]);