'use strict';
var expect = require('chai').expect;
var mm = require('./');

describe('when an array of additive glob patterns is defined:', function () {
	it('should match on multiple patterns', function () {
		expect(mm(['unicorn', 'cake', 'rainbows'], ['*', '!cake'])).to.eql(['unicorn', 'rainbows']);
		expect(mm(['foo', 'bar', 'baz'], ['foo'])).to.eql(['foo']);
		expect(mm(['foo', 'bar', 'baz'], ['!foo'])).to.eql([]);
		expect(mm(['foo', 'bar', 'baz'], ['foo', 'bar'])).to.eql(['foo', 'bar']);
		expect(mm(['foo', 'bar', 'baz'], ['foo', '!bar'])).to.eql(['foo']);
		expect(mm(['foo', 'bar', 'baz'], ['!foo', 'bar'])).to.eql(['bar']);
		expect(mm(['foo', 'bar', 'baz'], ['!foo', '!bar'])).to.eql([]);
		expect(mm(['foo', 'bar', 'baz'], ['!*{o,r}', 'foo'])).to.eql(['foo']);
	});

	it('should return an array of matches', function () {
		expect(mm(['foo', 'bar', 'baz'], ['f*'])).to.eql(['foo']);
		expect(mm(['foo', 'bar', 'baz'], ['f*', 'bar'])).to.eql(['foo', 'bar']);
	});

	it('should return matches in the order the patterns were defined', function () {
		expect(mm(['foo', 'bar', 'baz'], ['bar', 'f*'])).to.eql(['bar', 'foo']);
		expect(mm(['foo', 'bar', 'baz'], ['f*', '*z'])).to.eql(['foo', 'baz']);
		expect(mm(['foo', 'bar', 'baz'], ['*z', 'f*'])).to.eql(['baz', 'foo']);
	});
});

describe('when additive string patterns are defined and matches are found:', function () {
	it('should return an array of matches', function () {
		expect(mm(['foo', 'bar', 'baz'], 'foo')).to.eql(['foo']);
	});
});

describe('when negation patterns are defined as a string', function () {
	it('should be exclusive by default and return an array of matches with negations omitted:', function () {
		expect(mm(['unicorn', 'cake', 'rainbows'], ['!cake'])).to.eql([]);
		expect(mm(['unicorn', 'cake', 'rainbows'], ['*', '!cake'])).to.eql(['unicorn', 'rainbows']);
	});
});

describe('when negation patterns are defined as an array:', function () {
	it('should be inclusive by default, and return an array of matches with negations omitted', function () {
		expect(mm(['unicorn', 'cake', 'rainbows'], '!cake')).to.eql(['unicorn', 'rainbows']);
	});
});

describe('when an array of additive string patterns is defined and matches are found:', function () {
	it('should return an array of matches', function () {
		expect(mm(['foo', 'bar', 'baz'], ['foo', 'bar'])).to.eql(['foo', 'bar']);
	});

	it('should return an empty array when no matches are found', function () {
		expect(mm(['foo', 'bar', 'baz'], ['quux'])).to.eql([]);
	});
});

describe('when an array of negation glob patterns is defined', function () {
	it('should return an array with negations omitted', function () {
		expect(mm(['foo', 'bar', 'baz'], ['!*z'])).to.eql([]);
	});

	it('should return an array with negations omitted', function () {
		expect(mm(['foo', 'bar', 'baz'], ['!*z', '!*a*'])).to.eql([]);
	});

	it('should return an empty array when no matches are found', function () {
		expect(mm(['foo', 'bar', 'baz'], ['!*'])).to.eql([]);
	});
});

describe('when an array of filepaths is passed, and an array of negation glob patterns is defined', function () {
	var fixtures = ['vendor/js/foo.js', 'vendor/js/bar.js', 'vendor/js/baz.js'];

	it('should return an array with negations omitted', function () {
		expect(mm(fixtures, ['!**/*z.js'])).to.eql([]);
	});

	it('should return an array with negations omitted', function () {
		expect(mm(fixtures, ['!**/*z.js', '**/foo.js'])).to.eql(['vendor/js/foo.js']);
	});

	it('should return an array with negations omitted', function () {
		expect(mm(fixtures, ['!**/*z.js', '!**/*a*.js'])).to.eql([]);
	});

	it('should return an empty array when no matches are found', function () {
		expect(mm(fixtures, ['!**/*.js'])).to.eql([]);
	});
});

describe('when an array of negation string patterns is defined', function () {
	it('should return an array with negations omitted', function () {
		expect(mm(['foo', 'bar', 'baz'], ['!foo'])).to.eql([]);
		expect(mm(['foo', 'bar', 'baz'], ['!foo', '!bar'])).to.eql([]);
	});
});

describe('when inclusion and negation patterns are defined', function () {
	it('should return an array of matches, sans negations', function () {
		expect(mm(['foo', 'bar', 'baz'], ['!*a*'])).to.eql([]);
	});

	it('should override negations and re-include explicitly defined patterns', function () {
		expect(mm(['foo', 'bar', 'baz'], ['!*a*', '*z'])).to.eql(['baz']);
	});

	it('patterns should be order insensitive', function () {
		expect(mm(['foo', 'bar', 'baz'], ['!*a*', '*z'])).to.eql(['baz']);
		expect(mm(['foo', 'bar', 'baz'], ['*z', '!*a*'])).to.eql([]);
		expect(mm(['foo', 'foam', 'for', 'forum'], ['!*m', 'f*'])).to.eql(['foo', 'foam', 'for', 'forum']);
		expect(mm(['foo', 'foam', 'for', 'forum'], ['f*', '!*m'])).to.eql(['foo', 'for']);
		expect(mm(['foo', 'bar', 'baz'], ['!*{o,r}', 'foo'])).to.eql(['foo']);
		expect(mm(['foo', 'bar', 'baz'], ['foo', '!*{o,r}'])).to.eql([]);
		expect(mm(['foo', 'bar', 'baz'], ['!foo', 'bar'])).to.eql(['bar']);
		expect(mm(['foo', 'bar', 'baz'], ['foo', '!bar'])).to.eql(['foo']);
		expect(mm(['foo', 'bar', 'baz'], ['bar', '!foo', 'foo'])).to.eql(['bar', 'foo']);
		expect(mm(['foo', 'bar', 'baz'], ['foo', '!foo', 'bar'])).to.eql(['bar']);
	});

	it('should override negations and re-include explicitly defined patterns', function () {
		expect(mm(['foo', 'bar', 'baz'], ['!*'])).to.eql([]);
		expect(mm(['foo', 'bar', 'baz'], ['!*a*'])).to.eql([]);
		expect(mm(['foo', 'bar', 'baz'], ['bar', '!*a*'])).to.eql([]);
		expect(mm(['foo', 'bar', 'baz'], ['!*a*', 'bar'])).to.eql(['bar']);
		expect(mm(['foo', 'bar', 'baz'], ['!*a*', '*'])).to.eql(['foo', 'bar', 'baz']);
		expect(mm(['foo', 'bar', 'baz'], ['!*a*', '*z'])).to.eql(['baz']);
	});
});

describe('misc', function () {
	it('misc', function () {
		expect(mm(['foo', 'bar', 'baz'], ['*', '!foo'])).to.eql(['bar', 'baz']);
		expect(mm(['foo', 'bar', 'baz'], ['*', '!foo', 'bar'])).to.eql(['bar', 'baz']);
		expect(mm(['foo', 'bar', 'baz'], ['*', '!foo'])).to.eql(['bar', 'baz']);
		expect(mm(['foo', 'bar', 'baz'], ['!foo', '*'])).to.eql(['foo', 'bar', 'baz']);
		expect(mm(['foo', 'bar', 'baz'], ['*', '!foo', '!bar'])).to.eql(['baz']);
		expect(mm(['foo', 'bar', 'baz'], ['!*{o,r}', '*'])).to.eql(['foo', 'bar', 'baz']);
		expect(mm(['foo', 'bar', 'baz'], ['*', '!*{o,r}'])).to.eql(['baz']);
		expect(mm(['foo', 'bar', 'baz'], ['foo', '!*{o,r}', '*'])).to.eql(['foo', 'bar', 'baz']);
		expect(mm(['foo', 'bar', 'baz'], ['*', '!*{o,r}', 'foo'])).to.eql(['baz', 'foo']);
		expect(mm(['foo', 'bar', 'baz'], ['!*{o,r}', '*', 'foo'])).to.eql(['foo', 'bar', 'baz']);
		expect(mm(['foo', 'bar', 'baz'], ['foo', '!*{o,r}'])).to.eql([]);
		expect(mm(['foo', 'bar', 'baz'], ['foo', '!*{o,r}', 'foo'])).to.eql(['foo']);
		expect(mm(['foo', 'bar', 'baz'], ['!*{o,r}', 'foo'])).to.eql(['foo']);
		expect(mm(['foo', 'bar', 'baz'], ['*', '!*{o,r}'])).to.eql(['baz']);
		expect(mm(['foo', 'bar', 'baz'], 'foo')).to.eql(['foo']);
		expect(mm(['foo', 'bar', 'baz'], ['!foo'])).to.eql([]);
		expect(mm(['foo', 'bar', 'baz'], ['*', '!foo'])).to.eql(['bar', 'baz']);
		expect(mm(['foo', 'bar', 'baz'], ['foo', 'bar'])).to.eql(['foo', 'bar']);
		expect(mm(['foo', 'bar', 'baz'], ['foo', '!bar'])).to.eql(['foo']);
		expect(mm(['foo', 'bar', 'baz'], ['!foo', 'bar'])).to.eql(['bar']);
		expect(mm(['foo', 'bar', 'baz'], ['!foo', '!bar'])).to.eql([]);
		expect(mm(['foo', 'one', 'two', 'four', 'do', 'once', 'only'], ['once', '!o*', 'once'])).to.eql(['once']);
		expect(mm(['foo', 'one', 'two', 'four', 'do', 'once', 'only'], ['*', '!o*', 'once'])).to.eql(['foo', 'two', 'four', 'do', 'once']);
	});
});

/**
 * Tests from [globule](https://github.com/cowboy/node-globule)
 */
describe('globule', function () {
	it('Should return empty set if a required argument is missing or an empty set.', function () {
		expect(mm('', 'foo.js')).to.eql([]);
		expect(mm('*.js', '')).to.eql([]);
		expect(mm([], 'foo.js')).to.eql([]);
		expect(mm('*.js', [])).to.eql([]);
		expect(mm('', ['foo.js'])).to.eql([]);
		expect(mm(['*.js'], '')).to.eql([]);
	});

	it('basic matching should match correctly', function () {
		expect(mm('foo.js', '*.js')).to.eql(['foo.js']);
		expect(mm(['foo.js'], '*.js')).to.eql(['foo.js']);
		expect(mm(['foo.js', 'bar.css'], '*.js')).to.eql(['foo.js']);
		expect(mm('foo.js', ['*.js', '*.css'])).to.eql(['foo.js']);
		expect(mm(['foo.js'], ['*.js', '*.css'])).to.eql(['foo.js']);
		expect(mm(['foo.js', 'bar.css'], ['*.js', '*.css'])).to.eql(['foo.js', 'bar.css']);
	});

	describe('no matches:', function () {
		it('should fail to match', function () {
			expect(mm('foo.css', '*.js')).to.eql([]);
			expect(mm(['foo.css', 'bar.css'], '*.js')).to.eql([]);
		});
	});

	describe('unique:', function () {
		it('should return a uniqued set', function () {
			expect(mm(['foo.js', 'foo.js'], '*.js')).to.eql(['foo.js']);
			expect(mm(['foo.js', 'foo.js'], ['*.js', '*.*'])).to.eql(['foo.js']);
		});
	});

	describe('exclusion:', function () {
		it('solitary exclusion should match nothing', function () {
			expect(mm(['foo.js', 'bar.js'], ['!*.js'])).to.eql([]);
		});
		it('exclusion should cancel match', function () {
			expect(mm(['foo.js', 'bar.js'], ['*.js', '!*.js'])).to.eql([]);
		});
		it('partial exclusion should partially cancel match', function () {
			expect(mm(['foo.js', 'bar.js', 'baz.js'], ['*.js', '!f*.js'])).to.eql(['bar.js', 'baz.js']);
		});
		it('inclusion / exclusion order matters', function () {
			expect(mm(['foo.js', 'bar.js', 'baz.js'], ['*.js', '!*.js', 'b*.js'])).to.eql(['bar.js', 'baz.js']);
		});
		it('inclusion / exclusion order matters', function () {
			expect(mm(['foo.js', 'bar.js', 'baz.js'], ['*.js', '!f*.js', '*.js'])).to.eql(['bar.js', 'baz.js', 'foo.js']);
		});
	});

	describe('options.matchBase:', function () {
		it('should matchBase (minimatch) when specified.', function () {
			expect(mm(['foo.js', 'bar', 'baz/xyz.js'], '*.js', {matchBase: true})).to.eql(['foo.js', 'baz/xyz.js']);
		});

		it('should not matchBase (minimatch) by default.', function () {
			expect(mm(['foo.js', 'bar', 'baz/xyz.js'], '*.js')).to.eql(['foo.js']);
		});
	});
});
