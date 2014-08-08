'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Fieldtype = mongoose.model('Fieldtype');

/**
 * Globals
 */
var user, fieldtype, fieldtype2;

/**
 * Unit tests
 */
describe('Fieldtype Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() {
			fieldtype = new Fieldtype({
				name: 'Fieldtype Name',
				description: 'Fieldtype Description',
				type: 'String',
				user: user
			});

			fieldtype2 = new Fieldtype({
				name: 'Fieldtype Name',
				description: 'Fieldtype Description',
				type: 'String',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return fieldtype.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) {
			fieldtype.name = '';

			return fieldtype.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save duplicate Fieldtype Name', function(done) {
			fieldtype.save();
			fieldtype2.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without description', function(done) {
			fieldtype.description = '';

			return fieldtype.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should be able to show an error when try to save without type', function(done) {
			fieldtype.type = '';

			return fieldtype.save(function(err) {
				should.exist(err);
				done();
			});
		});
		
		it('should be able to show an error when try to save without a valid type', function(done) {
			fieldtype.type = 'foo';

			return fieldtype.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		Fieldtype.remove().exec();
		User.remove().exec();

		done();
	});
});