'use strict';
var assert = require('assert')
var mm = require('./multimatch');
var f = ['foo', 'bar', 'baz'];

describe('multimatch', function () {
	it('should match on multiple patterns', function () {
		assert.deepEqual(mm(f, 'foo'), ['foo']);
		assert.deepEqual(mm(f, '!foo'), ['bar', 'baz']);
		assert.deepEqual(mm(f, ['foo', 'bar']), ['foo', 'bar']);
		assert.deepEqual(mm(f, ['foo', '!bar']), ['foo']);
		assert.deepEqual(mm(f, ['!foo', 'bar']), ['bar', 'baz']);
		assert.deepEqual(mm(f, ['!foo', '!bar']), ['baz']);
		assert.deepEqual(mm(f, ['!*{o,r}', 'foo']), ['baz', 'foo']);
	});
});
