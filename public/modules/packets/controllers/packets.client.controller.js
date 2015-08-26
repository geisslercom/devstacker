'use strict';

// Packets controller
angular.module('packets').controller('PacketsController', ['$http', '$scope', '$stateParams', '$location', 'Authentication', 'Packets',
	function($http , $scope, $stateParams, $location, Authentication, Packets) {
		$scope.authentication = Authentication;
		
		$http.get('./modules/packets/config/statics.json').then(function(data){
			$scope.packets = data.data;
		}, console.err)

		$scope.checked = {
	      'node' : [],
	      'shell' : [],
	      'dpkg' : [],
	      'other' : []
	    };

		$scope.mark = function(childscope, type){
	     console.log(childscope)
	  		if ($scope.checked[type].indexOf(childscope.value) < 0){
	  			$scope.checked[type].push(childscope.value);	
	  		}else{
	  			$scope.checked[type].splice($scope.checked[type].indexOf(childscope.value),1);
	  		} 
	  	};

	  	$scope.checkout = function(){
	      var checkout = {
	        shell :  $scope.checked.shell,
	        node :  $scope.checked.node,
	        other : $scope.checked.other,
	        dpkg : $scope.checked.dpkg
	      }
	      $http.post('/packets/gen', checkout).then(function(response){
	      	$scope.shellscript = response.data;
	      }, console.err)
	      //later http request
	  	};




		// Create new Packet
		$scope.create = function() {
			// Create new Packet object
			var packet = new Packets ({
				name: this.name
			});

			// Redirect after save
			packet.$save(function(response) {
				$location.path('packets/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Packet
		$scope.remove = function(packet) {
			if ( packet ) { 
				packet.$remove();

				for (var i in $scope.packets) {
					if ($scope.packets [i] === packet) {
						$scope.packets.splice(i, 1);
					}
				}
			} else {
				$scope.packet.$remove(function() {
					$location.path('packets');
				});
			}
		};

		// Update existing Packet
		$scope.update = function() {
			var packet = $scope.packet;

			packet.$update(function() {
				$location.path('packets/' + packet._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Packets
		$scope.find = function() {
			$scope.packets = Packets.query();
		};

		// Find existing Packet
		$scope.findOne = function() {
			$scope.packet = Packets.get({ 
				packetId: $stateParams.packetId
			});
		};
	}
]);