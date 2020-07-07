import test from 'ava';
import multimatch from '..';

const fixtures = ['vendor/js/foo.js', 'vendor/js/bar.js', 'vendor/js/baz.js'];

test('match on multiple patterns', t => {
	t.deepEqual(multimatch(['unicorn', 'cake', 'rainbows'], ['*', '!cake']), ['unicorn', 'rainbows']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['foo']), ['foo']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['!foo']), []);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['foo', 'bar']), ['foo', 'bar']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['foo', '!bar']), ['foo']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['!foo', 'bar']), ['bar']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['!foo', '!bar']), []);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['!*{o,r}', 'foo']), ['foo']);
});

test('return an array of matches', t => {
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], 'foo'), ['foo']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['f*']), ['foo']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['f*', 'bar']), ['foo', 'bar']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['foo', 'bar']), ['foo', 'bar']);
});

test('return matches in the order the list were defined', t => {
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['bar', 'f*']), ['foo', 'bar']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['f*', '*z']), ['foo', 'baz']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['*z', 'f*']), ['foo', 'baz']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['!*z', '*r', 'f*']), ['foo', 'bar']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['*a*', '!f*']), ['bar', 'baz']);
});

test('return an array with negations omitted', t => {
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], '!foo'), []);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['!foo']), []);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['!foo', '!bar']), []);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['!*z']), []);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['!*z', '!*a*']), []);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['!*']), []);
	t.deepEqual(multimatch(fixtures, ['!**/*z.js']), []);
	t.deepEqual(multimatch(fixtures, ['!**/*z.js', '**/foo.js']), ['vendor/js/foo.js']);
	t.deepEqual(multimatch(fixtures, ['!**/*z.js', '!**/*a*.js']), []);
});

test('return an empty array when no matches are found', t => {
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['quux']), []);
	t.deepEqual(multimatch(fixtures, ['!**/*.js']), []);
});

test('patterns be order sensitive', t => {
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['!*a*', '*z']), ['baz']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['*z', '!*a*']), []);
	t.deepEqual(multimatch(['foo', 'foam', 'for', 'forum'], ['!*m', 'f*']), ['foo', 'foam', 'for', 'forum']);
	t.deepEqual(multimatch(['foo', 'foam', 'for', 'forum'], ['f*', '!*m']), ['foo', 'for']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['!*{o,r}', 'foo']), ['foo']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['foo', '!*{o,r}']), []);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['!foo', 'bar']), ['bar']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['foo', '!bar']), ['foo']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['bar', '!foo', 'foo']), ['foo', 'bar']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['foo', '!foo', 'bar']), ['bar']);
});

test('override negations and re-include explicitly defined patterns', t => {
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['!*']), []);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['!*a*']), []);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['bar', '!*a*']), []);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['!*a*', 'bar']), ['bar']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['!*a*', '*']), ['foo', 'bar', 'baz']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['!*a*', '*z']), ['baz']);
});

test('misc', t => {
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['*', '!foo']), ['bar', 'baz']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['*', '!foo', 'bar']), ['bar', 'baz']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['*', '!foo']), ['bar', 'baz']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['!foo', '*']), ['foo', 'bar', 'baz']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['*', '!foo', '!bar']), ['baz']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['!*{o,r}', '*']), ['foo', 'bar', 'baz']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['*', '!*{o,r}']), ['baz']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['foo', '!*{o,r}', '*']), ['foo', 'bar', 'baz']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['*', '!*{o,r}', 'foo']), ['foo', 'baz']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['!*{o,r}', '*', 'foo']), ['foo', 'bar', 'baz']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['foo', '!*{o,r}']), []);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['foo', '!*{o,r}', 'foo']), ['foo']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['!*{o,r}', 'foo']), ['foo']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['*', '!*{o,r}']), ['baz']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], 'foo'), ['foo']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['!foo']), []);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['*', '!foo']), ['bar', 'baz']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['foo', 'bar']), ['foo', 'bar']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['foo', '!bar']), ['foo']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['!foo', 'bar']), ['bar']);
	t.deepEqual(multimatch(['foo', 'bar', 'baz'], ['!foo', '!bar']), []);
	t.deepEqual(multimatch(['foo', 'one', 'two', 'four', 'do', 'once', 'only'], ['once', '!o*', 'once']), ['once']);
	t.deepEqual(multimatch(['foo', 'one', 'two', 'four', 'do', 'once', 'only'], ['*', '!o*', 'once']), ['foo', 'two', 'four', 'do', 'once']);
});
