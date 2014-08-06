'use strict';

//Fieldtype service used to communicate Fieldtype REST endpoints
angular.module('fieldtypes').factory('Fieldtypes', ['$resource',

function($resource) {
    return $resource('fieldtypes/:fieldtypeId', {
        fieldtypeId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);