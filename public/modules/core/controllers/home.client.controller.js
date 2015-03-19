'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
  		/*$.AdminLTE.tree('.sidebar');

  		var o = $.AdminLTE.options;
		//Activate sidebar push menu
		if (o.sidebarPushMenu) {
			$.AdminLTE.pushMenu(o.sidebarToggleSelector);
		}*/
	}
]);