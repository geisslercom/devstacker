'use strict';

(function() {
	// Packets Controller Spec
	describe('Packets Controller Tests', function() {
		// Initialize global variables
		var PacketsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Packets controller.
			PacketsController = $controller('PacketsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Packet object fetched from XHR', inject(function(Packets) {
			// Create sample Packet using the Packets service
			var samplePacket = new Packets({
				name: 'New Packet'
			});

			// Create a sample Packets array that includes the new Packet
			var samplePackets = [samplePacket];

			// Set GET response
			$httpBackend.expectGET('packets').respond(samplePackets);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.packets).toEqualData(samplePackets);
		}));

		it('$scope.findOne() should create an array with one Packet object fetched from XHR using a packetId URL parameter', inject(function(Packets) {
			// Define a sample Packet object
			var samplePacket = new Packets({
				name: 'New Packet'
			});

			// Set the URL parameter
			$stateParams.packetId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/packets\/([0-9a-fA-F]{24})$/).respond(samplePacket);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.packet).toEqualData(samplePacket);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Packets) {
			// Create a sample Packet object
			var samplePacketPostData = new Packets({
				name: 'New Packet'
			});

			// Create a sample Packet response
			var samplePacketResponse = new Packets({
				_id: '525cf20451979dea2c000001',
				name: 'New Packet'
			});

			// Fixture mock form input values
			scope.name = 'New Packet';

			// Set POST response
			$httpBackend.expectPOST('packets', samplePacketPostData).respond(samplePacketResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Packet was created
			expect($location.path()).toBe('/packets/' + samplePacketResponse._id);
		}));

		it('$scope.update() should update a valid Packet', inject(function(Packets) {
			// Define a sample Packet put data
			var samplePacketPutData = new Packets({
				_id: '525cf20451979dea2c000001',
				name: 'New Packet'
			});

			// Mock Packet in scope
			scope.packet = samplePacketPutData;

			// Set PUT response
			$httpBackend.expectPUT(/packets\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/packets/' + samplePacketPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid packetId and remove the Packet from the scope', inject(function(Packets) {
			// Create new Packet object
			var samplePacket = new Packets({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Packets array and include the Packet
			scope.packets = [samplePacket];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/packets\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePacket);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.packets.length).toBe(0);
		}));
	});
}());