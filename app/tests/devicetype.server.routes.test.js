'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Devicetype = mongoose.model('Devicetype'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, devicetype;

/**
 * Devicetype routes tests
 */
describe('Devicetype CRUD tests', function() {
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

		// Save a user to the test db and create new Devicetype
		user.save(function() {
			devicetype = {
				name: 'Devicetype Name'
			};

			done();
		});
	});

	it('should be able to save Devicetype instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Devicetype
				agent.post('/devicetypes')
					.send(devicetype)
					.expect(200)
					.end(function(devicetypeSaveErr, devicetypeSaveRes) {
						// Handle Devicetype save error
						if (devicetypeSaveErr) done(devicetypeSaveErr);

						// Get a list of Devicetypes
						agent.get('/devicetypes')
							.end(function(devicetypesGetErr, devicetypesGetRes) {
								// Handle Devicetype save error
								if (devicetypesGetErr) done(devicetypesGetErr);

								// Get Devicetypes list
								var devicetypes = devicetypesGetRes.body;

								// Set assertions
								(devicetypes[0].user._id).should.equal(userId);
								(devicetypes[0].name).should.match('Devicetype Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Devicetype instance if not logged in', function(done) {
		agent.post('/devicetypes')
			.send(devicetype)
			.expect(401)
			.end(function(devicetypeSaveErr, devicetypeSaveRes) {
				// Call the assertion callback
				done(devicetypeSaveErr);
			});
	});

	it('should not be able to save Devicetype instance if no name is provided', function(done) {
		// Invalidate name field
		devicetype.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Devicetype
				agent.post('/devicetypes')
					.send(devicetype)
					.expect(400)
					.end(function(devicetypeSaveErr, devicetypeSaveRes) {
						// Set message assertion
						(devicetypeSaveRes.body.message).should.match('Please fill Devicetype name');
						
						// Handle Devicetype save error
						done(devicetypeSaveErr);
					});
			});
	});

	it('should be able to update Devicetype instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Devicetype
				agent.post('/devicetypes')
					.send(devicetype)
					.expect(200)
					.end(function(devicetypeSaveErr, devicetypeSaveRes) {
						// Handle Devicetype save error
						if (devicetypeSaveErr) done(devicetypeSaveErr);

						// Update Devicetype name
						devicetype.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Devicetype
						agent.put('/devicetypes/' + devicetypeSaveRes.body._id)
							.send(devicetype)
							.expect(200)
							.end(function(devicetypeUpdateErr, devicetypeUpdateRes) {
								// Handle Devicetype update error
								if (devicetypeUpdateErr) done(devicetypeUpdateErr);

								// Set assertions
								(devicetypeUpdateRes.body._id).should.equal(devicetypeSaveRes.body._id);
								(devicetypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Devicetypes if not signed in', function(done) {
		// Create new Devicetype model instance
		var devicetypeObj = new Devicetype(devicetype);

		// Save the Devicetype
		devicetypeObj.save(function() {
			// Request Devicetypes
			request(app).get('/devicetypes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Devicetype if not signed in', function(done) {
		// Create new Devicetype model instance
		var devicetypeObj = new Devicetype(devicetype);

		// Save the Devicetype
		devicetypeObj.save(function() {
			request(app).get('/devicetypes/' + devicetypeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', devicetype.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Devicetype instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Devicetype
				agent.post('/devicetypes')
					.send(devicetype)
					.expect(200)
					.end(function(devicetypeSaveErr, devicetypeSaveRes) {
						// Handle Devicetype save error
						if (devicetypeSaveErr) done(devicetypeSaveErr);

						// Delete existing Devicetype
						agent.delete('/devicetypes/' + devicetypeSaveRes.body._id)
							.send(devicetype)
							.expect(200)
							.end(function(devicetypeDeleteErr, devicetypeDeleteRes) {
								// Handle Devicetype error error
								if (devicetypeDeleteErr) done(devicetypeDeleteErr);

								// Set assertions
								(devicetypeDeleteRes.body._id).should.equal(devicetypeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Devicetype instance if not signed in', function(done) {
		// Set Devicetype user 
		devicetype.user = user;

		// Create new Devicetype model instance
		var devicetypeObj = new Devicetype(devicetype);

		// Save the Devicetype
		devicetypeObj.save(function() {
			// Try deleting Devicetype
			request(app).delete('/devicetypes/' + devicetypeObj._id)
			.expect(401)
			.end(function(devicetypeDeleteErr, devicetypeDeleteRes) {
				// Set message assertion
				(devicetypeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Devicetype error error
				done(devicetypeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Devicetype.remove().exec();
		done();
	});
});