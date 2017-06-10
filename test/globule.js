// Tests from [globule](https://github.com/cowboy/node-globule)
import test from 'ava';
import m from '..';

test('Should return empty set if a required argument is missing or an empty set.', t => {
	t.deepEqual(m('', 'foo.js'), []);
	t.deepEqual(m('*.js', ''), []);
	t.deepEqual(m([], 'foo.js'), []);
	t.deepEqual(m('*.js', []), []);
	t.deepEqual(m('', ['foo.js']), []);
	t.deepEqual(m(['*.js'], ''), []);
});

test('basic matching should match correctly', t => {
	t.deepEqual(m('foo.js', '*.js'), ['foo.js']);
	t.deepEqual(m(['foo.js'], '*.js'), ['foo.js']);
	t.deepEqual(m(['foo.js', 'bar.css'], '*.js'), ['foo.js']);
	t.deepEqual(m('foo.js', ['*.js', '*.css']), ['foo.js']);
	t.deepEqual(m(['foo.js'], ['*.js', '*.css']), ['foo.js']);
	t.deepEqual(m(['foo.js', 'bar.css'], ['*.js', '*.css']), ['foo.js', 'bar.css']);
});

test('should fail to match', t => {
	t.deepEqual(m('foo.css', '*.js'), []);
	t.deepEqual(m(['foo.css', 'bar.css'], '*.js'), []);
});

test('should return a uniqued set', t => {
	t.deepEqual(m(['foo.js', 'foo.js'], '*.js'), ['foo.js']);
	t.deepEqual(m(['foo.js', 'foo.js'], ['*.js', '*.*']), ['foo.js']);
});

test('solitary exclusion should match nothing', t => {
	t.deepEqual(m(['foo.js', 'bar.js'], ['!*.js']), []);
});

test('exclusion should cancel match', t => {
	t.deepEqual(m(['foo.js', 'bar.js'], ['*.js', '!*.js']), []);
});

test('partial exclusion should partially cancel match', t => {
	t.deepEqual(m(['foo.js', 'bar.js', 'baz.js'], ['*.js', '!f*.js']), ['bar.js', 'baz.js']);
});

test('inclusion / exclusion order matters', t => {
	t.deepEqual(m(['foo.js', 'bar.js', 'baz.js'], ['*.js', '!*.js', 'b*.js']), ['bar.js', 'baz.js']);
	t.deepEqual(m(['foo.js', 'bar.js', 'baz.js'], ['*.js', '!f*.js', '*.js']), ['bar.js', 'baz.js', 'foo.js']);
});

test('should matchBase (minimatch) when specified.', t => {
	t.deepEqual(m(['foo.js', 'bar', 'baz/xyz.js'], '*.js', {matchBase: true}), ['foo.js', 'baz/xyz.js']);
});

test('should not matchBase (minimatch) by default.', t => {
	t.deepEqual(m(['foo.js', 'bar', 'baz/xyz.js'], '*.js'), ['foo.js']);
});
