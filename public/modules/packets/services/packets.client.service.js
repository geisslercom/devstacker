'use strict';

//Packets service used to communicate Packets REST endpoints
angular.module('packets').factory('Packets', ['$resource',
	function($resource) {
		return $resource('packets/:packetId', { packetId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);