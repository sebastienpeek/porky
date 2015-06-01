
'use strict';

var assert = require('assert');

describe('#MainTests', function () {

	var sandbox;
	beforeEach(function () {
		sandbox = sinon.sandbox.create();
	});

	afterEach(function () {
		sandbox.restore();
	});

	it('test', function (done) {
		expect(true).to.be.(true);
	});
});