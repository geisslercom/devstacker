'use strict';

//Setting up route
angular.module('packets').config(['$stateProvider',
	function($stateProvider) {
		// Packets state routing
		$stateProvider.
		state('listPackets', {
			url: '/packets',
			templateUrl: 'modules/packets/views/list-packets.client.view.html'
		}).
		state('createPacket', {
			url: '/packets/create',
			templateUrl: 'modules/packets/views/create-packet.client.view.html'
		}).
		state('viewPacket', {
			url: '/packets/:packetId',
			templateUrl: 'modules/packets/views/view-packet.client.view.html'
		}).
		state('editPacket', {
			url: '/packets/:packetId/edit',
			templateUrl: 'modules/packets/views/edit-packet.client.view.html'
		});
	}
]);