'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Packet = mongoose.model('Packet'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, packet;

/**
 * Packet routes tests
 */
describe('Packet CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Packet
		user.save(function() {
			packet = {
				name: 'Packet Name'
			};

			done();
		});
	});

	it('should be able to save Packet instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Packet
				agent.post('/packets')
					.send(packet)
					.expect(200)
					.end(function(packetSaveErr, packetSaveRes) {
						// Handle Packet save error
						if (packetSaveErr) done(packetSaveErr);

						// Get a list of Packets
						agent.get('/packets')
							.end(function(packetsGetErr, packetsGetRes) {
								// Handle Packet save error
								if (packetsGetErr) done(packetsGetErr);

								// Get Packets list
								var packets = packetsGetRes.body;

								// Set assertions
								(packets[0].user._id).should.equal(userId);
								(packets[0].name).should.match('Packet Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Packet instance if not logged in', function(done) {
		agent.post('/packets')
			.send(packet)
			.expect(401)
			.end(function(packetSaveErr, packetSaveRes) {
				// Call the assertion callback
				done(packetSaveErr);
			});
	});

	it('should not be able to save Packet instance if no name is provided', function(done) {
		// Invalidate name field
		packet.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Packet
				agent.post('/packets')
					.send(packet)
					.expect(400)
					.end(function(packetSaveErr, packetSaveRes) {
						// Set message assertion
						(packetSaveRes.body.message).should.match('Please fill Packet name');
						
						// Handle Packet save error
						done(packetSaveErr);
					});
			});
	});

	it('should be able to update Packet instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Packet
				agent.post('/packets')
					.send(packet)
					.expect(200)
					.end(function(packetSaveErr, packetSaveRes) {
						// Handle Packet save error
						if (packetSaveErr) done(packetSaveErr);

						// Update Packet name
						packet.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Packet
						agent.put('/packets/' + packetSaveRes.body._id)
							.send(packet)
							.expect(200)
							.end(function(packetUpdateErr, packetUpdateRes) {
								// Handle Packet update error
								if (packetUpdateErr) done(packetUpdateErr);

								// Set assertions
								(packetUpdateRes.body._id).should.equal(packetSaveRes.body._id);
								(packetUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Packets if not signed in', function(done) {
		// Create new Packet model instance
		var packetObj = new Packet(packet);

		// Save the Packet
		packetObj.save(function() {
			// Request Packets
			request(app).get('/packets')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Packet if not signed in', function(done) {
		// Create new Packet model instance
		var packetObj = new Packet(packet);

		// Save the Packet
		packetObj.save(function() {
			request(app).get('/packets/' + packetObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', packet.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Packet instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Packet
				agent.post('/packets')
					.send(packet)
					.expect(200)
					.end(function(packetSaveErr, packetSaveRes) {
						// Handle Packet save error
						if (packetSaveErr) done(packetSaveErr);

						// Delete existing Packet
						agent.delete('/packets/' + packetSaveRes.body._id)
							.send(packet)
							.expect(200)
							.end(function(packetDeleteErr, packetDeleteRes) {
								// Handle Packet error error
								if (packetDeleteErr) done(packetDeleteErr);

								// Set assertions
								(packetDeleteRes.body._id).should.equal(packetSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Packet instance if not signed in', function(done) {
		// Set Packet user 
		packet.user = user;

		// Create new Packet model instance
		var packetObj = new Packet(packet);

		// Save the Packet
		packetObj.save(function() {
			// Try deleting Packet
			request(app).delete('/packets/' + packetObj._id)
			.expect(401)
			.end(function(packetDeleteErr, packetDeleteRes) {
				// Set message assertion
				(packetDeleteRes.body.message).should.match('User is not logged in');

				// Handle Packet error error
				done(packetDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Packet.remove().exec();
		done();
	});
});