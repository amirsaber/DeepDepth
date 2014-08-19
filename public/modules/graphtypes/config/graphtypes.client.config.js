'use strict';

// Configuring the Articles module
angular.module('graphtypes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Graphtypes', 'graphtypes', 'dropdown', '/graphtypes(/create)?', false, ['admin']);
		Menus.addSubMenuItem('topbar', 'graphtypes', 'List Graphtypes', 'graphtypes');
		Menus.addSubMenuItem('topbar', 'graphtypes', 'New Graphtype', 'graphtypes/create');
	}
]);