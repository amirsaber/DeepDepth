'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Fieldtype = mongoose.model('Fieldtype'),
	Jobtype = mongoose.model('Jobtype');

/**
 * Globals
 */
var user, jobtype, jobtype2, fieldType, fieldType2;

/**
 * Unit tests
 */
describe('Jobtype Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		fieldType = new Fieldtype({
			name: 'Field1',
			description: 'This is for field1',
			user: user,
			type: 'String'
		});

		fieldType2 = new Fieldtype({
			name: 'Field2',
			description: 'This is for field2',
			user: user,
			type: 'Integer'
		});

		user.save(function() {

			fieldType.save(function() {
				fieldType2.save(function() {
					jobtype = new Jobtype({
						name: 'Job Type Name 1',
						address: 'http://rest.ip',
						fields: [fieldType],
						user: user
					});

					jobtype2 = new Jobtype({
						name: 'Job Type Name 1',
						address: 'http://rest.ip2',
						fields: [fieldType, fieldType2],
						user: user
					});

					done();
				});
			});
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems with one fields', function(done) {
			return jobtype.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to save without problems with two fields', function(done) {
			return jobtype2.save(function(err) {
				should.not.exist(err);
				done();
			});
		});


		it('should be able to show an error when try to save without name', function(done) {
			jobtype.name = '';

			return jobtype.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without address', function(done) {
			jobtype.address = '';

			return jobtype.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without fields', function(done) {
			jobtype.fields = [];

			return jobtype.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save duplicate Jobtype name', function(done) {
			jobtype.save();

			return jobtype2.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		Jobtype.remove().exec();
		User.remove().exec();
		Fieldtype.remove().exec();
		done();
	});
});