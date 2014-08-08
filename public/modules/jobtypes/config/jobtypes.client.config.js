'use strict';

// Configuring the Articles module
angular.module('jobtypes').run(['Menus',

function(Menus) {
	// Set top bar menu items
	Menus.addMenuItem('topbar', 'Jobtypes', 'jobtypes', 'dropdown', '/jobtypes(/create)?', false, ['admin']);
	Menus.addSubMenuItem('topbar', 'jobtypes', 'List Jobtypes', 'jobtypes');
	Menus.addSubMenuItem('topbar', 'jobtypes', 'New Jobtype', 'jobtypes/create');
}]);