import test from 'ava';
import m from '..';

const fixtures = ['vendor/js/foo.js', 'vendor/js/bar.js', 'vendor/js/baz.js'];

test('match on multiple patterns', t => {
	t.deepEqual(m(['unicorn', 'cake', 'rainbows'], ['*', '!cake']), ['unicorn', 'rainbows']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['foo']), ['foo']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['!foo']), []);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['foo', 'bar']), ['foo', 'bar']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['foo', '!bar']), ['foo']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['!foo', 'bar']), ['bar']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['!foo', '!bar']), []);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['!*{o,r}', 'foo']), ['foo']);
});

test('return an array of matches', t => {
	t.deepEqual(m(['foo', 'bar', 'baz'], 'foo'), ['foo']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['f*']), ['foo']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['f*', 'bar']), ['foo', 'bar']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['foo', 'bar']), ['foo', 'bar']);
});

test('return matches in the order the patterns were defined', t => {
	t.deepEqual(m(['foo', 'bar', 'baz'], ['bar', 'f*']), ['bar', 'foo']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['f*', '*z']), ['foo', 'baz']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['*z', 'f*']), ['baz', 'foo']);
});

test('return an array with negations omitted', t => {
	t.deepEqual(m(['foo', 'bar', 'baz'], '!foo'), []);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['!foo']), []);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['!foo', '!bar']), []);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['!*z']), []);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['!*z', '!*a*']), []);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['!*']), []);
	t.deepEqual(m(fixtures, ['!**/*z.js']), []);
	t.deepEqual(m(fixtures, ['!**/*z.js', '**/foo.js']), ['vendor/js/foo.js']);
	t.deepEqual(m(fixtures, ['!**/*z.js', '!**/*a*.js']), []);
});

test('return an empty array when no matches are found', t => {
	t.deepEqual(m(['foo', 'bar', 'baz'], ['quux']), []);
	t.deepEqual(m(fixtures, ['!**/*.js']), []);
});

test('patterns be order sensitive', t => {
	t.deepEqual(m(['foo', 'bar', 'baz'], ['!*a*', '*z']), ['baz']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['*z', '!*a*']), []);
	t.deepEqual(m(['foo', 'foam', 'for', 'forum'], ['!*m', 'f*']), ['foo', 'foam', 'for', 'forum']);
	t.deepEqual(m(['foo', 'foam', 'for', 'forum'], ['f*', '!*m']), ['foo', 'for']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['!*{o,r}', 'foo']), ['foo']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['foo', '!*{o,r}']), []);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['!foo', 'bar']), ['bar']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['foo', '!bar']), ['foo']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['bar', '!foo', 'foo']), ['bar', 'foo']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['foo', '!foo', 'bar']), ['bar']);
});

test('override negations and re-include explicitly defined patterns', t => {
	t.deepEqual(m(['foo', 'bar', 'baz'], ['!*']), []);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['!*a*']), []);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['bar', '!*a*']), []);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['!*a*', 'bar']), ['bar']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['!*a*', '*']), ['foo', 'bar', 'baz']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['!*a*', '*z']), ['baz']);
});

test('misc', t => {
	t.deepEqual(m(['foo', 'bar', 'baz'], ['*', '!foo']), ['bar', 'baz']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['*', '!foo', 'bar']), ['bar', 'baz']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['*', '!foo']), ['bar', 'baz']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['!foo', '*']), ['foo', 'bar', 'baz']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['*', '!foo', '!bar']), ['baz']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['!*{o,r}', '*']), ['foo', 'bar', 'baz']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['*', '!*{o,r}']), ['baz']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['foo', '!*{o,r}', '*']), ['foo', 'bar', 'baz']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['*', '!*{o,r}', 'foo']), ['baz', 'foo']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['!*{o,r}', '*', 'foo']), ['foo', 'bar', 'baz']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['foo', '!*{o,r}']), []);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['foo', '!*{o,r}', 'foo']), ['foo']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['!*{o,r}', 'foo']), ['foo']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['*', '!*{o,r}']), ['baz']);
	t.deepEqual(m(['foo', 'bar', 'baz'], 'foo'), ['foo']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['!foo']), []);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['*', '!foo']), ['bar', 'baz']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['foo', 'bar']), ['foo', 'bar']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['foo', '!bar']), ['foo']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['!foo', 'bar']), ['bar']);
	t.deepEqual(m(['foo', 'bar', 'baz'], ['!foo', '!bar']), []);
	t.deepEqual(m(['foo', 'one', 'two', 'four', 'do', 'once', 'only'], ['once', '!o*', 'once']), ['once']);
	t.deepEqual(m(['foo', 'one', 'two', 'four', 'do', 'once', 'only'], ['*', '!o*', 'once']), ['foo', 'two', 'four', 'do', 'once']);
});
