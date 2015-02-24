'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Personal = mongoose.model('Personal'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, personal;

/**
 * Personal routes tests
 */
describe('Personal CRUD tests', function() {
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

		// Save a user to the test db and create new Personal
		user.save(function() {
			personal = {
				name: 'Personal Name'
			};

			done();
		});
	});

	it('should be able to save Personal instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Personal
				agent.post('/personals')
					.send(personal)
					.expect(200)
					.end(function(personalSaveErr, personalSaveRes) {
						// Handle Personal save error
						if (personalSaveErr) done(personalSaveErr);

						// Get a list of Personals
						agent.get('/personals')
							.end(function(personalsGetErr, personalsGetRes) {
								// Handle Personal save error
								if (personalsGetErr) done(personalsGetErr);

								// Get Personals list
								var personals = personalsGetRes.body;

								// Set assertions
								(personals[0].user._id).should.equal(userId);
								(personals[0].name).should.match('Personal Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Personal instance if not logged in', function(done) {
		agent.post('/personals')
			.send(personal)
			.expect(401)
			.end(function(personalSaveErr, personalSaveRes) {
				// Call the assertion callback
				done(personalSaveErr);
			});
	});

	it('should not be able to save Personal instance if no name is provided', function(done) {
		// Invalidate name field
		personal.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Personal
				agent.post('/personals')
					.send(personal)
					.expect(400)
					.end(function(personalSaveErr, personalSaveRes) {
						// Set message assertion
						(personalSaveRes.body.message).should.match('Please fill Personal name');
						
						// Handle Personal save error
						done(personalSaveErr);
					});
			});
	});

	it('should be able to update Personal instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Personal
				agent.post('/personals')
					.send(personal)
					.expect(200)
					.end(function(personalSaveErr, personalSaveRes) {
						// Handle Personal save error
						if (personalSaveErr) done(personalSaveErr);

						// Update Personal name
						personal.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Personal
						agent.put('/personals/' + personalSaveRes.body._id)
							.send(personal)
							.expect(200)
							.end(function(personalUpdateErr, personalUpdateRes) {
								// Handle Personal update error
								if (personalUpdateErr) done(personalUpdateErr);

								// Set assertions
								(personalUpdateRes.body._id).should.equal(personalSaveRes.body._id);
								(personalUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Personals if not signed in', function(done) {
		// Create new Personal model instance
		var personalObj = new Personal(personal);

		// Save the Personal
		personalObj.save(function() {
			// Request Personals
			request(app).get('/personals')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Personal if not signed in', function(done) {
		// Create new Personal model instance
		var personalObj = new Personal(personal);

		// Save the Personal
		personalObj.save(function() {
			request(app).get('/personals/' + personalObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', personal.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Personal instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Personal
				agent.post('/personals')
					.send(personal)
					.expect(200)
					.end(function(personalSaveErr, personalSaveRes) {
						// Handle Personal save error
						if (personalSaveErr) done(personalSaveErr);

						// Delete existing Personal
						agent.delete('/personals/' + personalSaveRes.body._id)
							.send(personal)
							.expect(200)
							.end(function(personalDeleteErr, personalDeleteRes) {
								// Handle Personal error error
								if (personalDeleteErr) done(personalDeleteErr);

								// Set assertions
								(personalDeleteRes.body._id).should.equal(personalSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Personal instance if not signed in', function(done) {
		// Set Personal user 
		personal.user = user;

		// Create new Personal model instance
		var personalObj = new Personal(personal);

		// Save the Personal
		personalObj.save(function() {
			// Try deleting Personal
			request(app).delete('/personals/' + personalObj._id)
			.expect(401)
			.end(function(personalDeleteErr, personalDeleteRes) {
				// Set message assertion
				(personalDeleteRes.body.message).should.match('User is not logged in');

				// Handle Personal error error
				done(personalDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Personal.remove().exec();
		done();
	});
});