'use strict';

// Configuring the Articles module
angular.module('personals').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//               (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position, icono)
 
		Menus.addMenuItem('topbar', 'Personal', 'personals', 'item', 'personals',false,['user','admin','superadmin'],1,'fa fa-users');
	}
]);