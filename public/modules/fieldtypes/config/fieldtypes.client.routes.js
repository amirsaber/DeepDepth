'use strict';

//Setting up route
angular.module('fieldtypes').config(['$stateProvider',

function($stateProvider) {
    // Queries state routing
    $stateProvider.
    state('listFieldtypes', {
        url: '/fieldtypes',
        templateUrl: 'modules/fieldtypes/views/list-fieldtypes.client.view.html'
    }).
    state('createFieldType', {
        url: '/fieldtypes/create',
        templateUrl: 'modules/fieldtypes/views/create-fieldtype.client.view.html'
    }).
    state('viewFieldtype', {
        url: '/fieldtypes/:fieldtypeId',
        templateUrl: 'modules/fieldtypes/views/view-fieldtype.client.view.html'
    }).
    state('editFieldtype', {
        url: '/fieldtypes/:fieldtypeId/edit',
        templateUrl: 'modules/fieldtypes/views/edit-fieldtype.client.view.html'
    });
}]);