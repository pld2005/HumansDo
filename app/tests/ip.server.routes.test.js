'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Ip = mongoose.model('Ip'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, ip;

/**
 * Ip routes tests
 */
describe('Ip CRUD tests', function() {
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

		// Save a user to the test db and create new Ip
		user.save(function() {
			ip = {
				name: 'Ip Name'
			};

			done();
		});
	});

	it('should be able to save Ip instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ip
				agent.post('/ips')
					.send(ip)
					.expect(200)
					.end(function(ipSaveErr, ipSaveRes) {
						// Handle Ip save error
						if (ipSaveErr) done(ipSaveErr);

						// Get a list of Ips
						agent.get('/ips')
							.end(function(ipsGetErr, ipsGetRes) {
								// Handle Ip save error
								if (ipsGetErr) done(ipsGetErr);

								// Get Ips list
								var ips = ipsGetRes.body;

								// Set assertions
								(ips[0].user._id).should.equal(userId);
								(ips[0].name).should.match('Ip Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Ip instance if not logged in', function(done) {
		agent.post('/ips')
			.send(ip)
			.expect(401)
			.end(function(ipSaveErr, ipSaveRes) {
				// Call the assertion callback
				done(ipSaveErr);
			});
	});

	it('should not be able to save Ip instance if no name is provided', function(done) {
		// Invalidate name field
		ip.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ip
				agent.post('/ips')
					.send(ip)
					.expect(400)
					.end(function(ipSaveErr, ipSaveRes) {
						// Set message assertion
						(ipSaveRes.body.message).should.match('Please fill Ip name');
						
						// Handle Ip save error
						done(ipSaveErr);
					});
			});
	});

	it('should be able to update Ip instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ip
				agent.post('/ips')
					.send(ip)
					.expect(200)
					.end(function(ipSaveErr, ipSaveRes) {
						// Handle Ip save error
						if (ipSaveErr) done(ipSaveErr);

						// Update Ip name
						ip.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Ip
						agent.put('/ips/' + ipSaveRes.body._id)
							.send(ip)
							.expect(200)
							.end(function(ipUpdateErr, ipUpdateRes) {
								// Handle Ip update error
								if (ipUpdateErr) done(ipUpdateErr);

								// Set assertions
								(ipUpdateRes.body._id).should.equal(ipSaveRes.body._id);
								(ipUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Ips if not signed in', function(done) {
		// Create new Ip model instance
		var ipObj = new Ip(ip);

		// Save the Ip
		ipObj.save(function() {
			// Request Ips
			request(app).get('/ips')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Ip if not signed in', function(done) {
		// Create new Ip model instance
		var ipObj = new Ip(ip);

		// Save the Ip
		ipObj.save(function() {
			request(app).get('/ips/' + ipObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', ip.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Ip instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ip
				agent.post('/ips')
					.send(ip)
					.expect(200)
					.end(function(ipSaveErr, ipSaveRes) {
						// Handle Ip save error
						if (ipSaveErr) done(ipSaveErr);

						// Delete existing Ip
						agent.delete('/ips/' + ipSaveRes.body._id)
							.send(ip)
							.expect(200)
							.end(function(ipDeleteErr, ipDeleteRes) {
								// Handle Ip error error
								if (ipDeleteErr) done(ipDeleteErr);

								// Set assertions
								(ipDeleteRes.body._id).should.equal(ipSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Ip instance if not signed in', function(done) {
		// Set Ip user 
		ip.user = user;

		// Create new Ip model instance
		var ipObj = new Ip(ip);

		// Save the Ip
		ipObj.save(function() {
			// Try deleting Ip
			request(app).delete('/ips/' + ipObj._id)
			.expect(401)
			.end(function(ipDeleteErr, ipDeleteRes) {
				// Set message assertion
				(ipDeleteRes.body.message).should.match('User is not logged in');

				// Handle Ip error error
				done(ipDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Ip.remove().exec();
		done();
	});
});