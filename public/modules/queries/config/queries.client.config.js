'use strict';

// Configuring the Queries module
angular.module('queries').run(['Menus',

function(Menus) {
	// Set top bar menu items
	Menus.addMenuItem('topbar', 'Queries', 'queries', 'dropdown', '/queries(/create)?');
	Menus.addSubMenuItem('topbar', 'queries', 'List Queries', 'queries');
	Menus.addSubMenuItem('topbar', 'queries', 'New Query', 'queries/create');
}]);