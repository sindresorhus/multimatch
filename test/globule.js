// Tests from [globule](https://github.com/cowboy/node-globule)
import test from 'ava';
import multimatch from '..';

test('Should return empty set if a required argument is missing or an empty set.', t => {
	t.deepEqual(multimatch('', 'foo.js'), []);
	t.deepEqual(multimatch('*.js', ''), []);
	t.deepEqual(multimatch([], 'foo.js'), []);
	t.deepEqual(multimatch('*.js', []), []);
	t.deepEqual(multimatch('', ['foo.js']), []);
	t.deepEqual(multimatch(['*.js'], ''), []);
});

test('basic matching should match correctly', t => {
	t.deepEqual(multimatch('foo.js', '*.js'), ['foo.js']);
	t.deepEqual(multimatch(['foo.js'], '*.js'), ['foo.js']);
	t.deepEqual(multimatch(['foo.js', 'bar.css'], '*.js'), ['foo.js']);
	t.deepEqual(multimatch('foo.js', ['*.js', '*.css']), ['foo.js']);
	t.deepEqual(multimatch(['foo.js'], ['*.js', '*.css']), ['foo.js']);
	t.deepEqual(multimatch(['foo.js', 'bar.css'], ['*.js', '*.css']), ['foo.js', 'bar.css']);
});

test('should fail to match', t => {
	t.deepEqual(multimatch('foo.css', '*.js'), []);
	t.deepEqual(multimatch(['foo.css', 'bar.css'], '*.js'), []);
});

test('should return a uniqued set', t => {
	t.deepEqual(multimatch(['foo.js', 'foo.js'], '*.js'), ['foo.js']);
	t.deepEqual(multimatch(['foo.js', 'foo.js'], ['*.js', '*.*']), ['foo.js']);
});

test('solitary exclusion should match nothing', t => {
	t.deepEqual(multimatch(['foo.js', 'bar.js'], ['!*.js']), []);
});

test('exclusion should cancel match', t => {
	t.deepEqual(multimatch(['foo.js', 'bar.js'], ['*.js', '!*.js']), []);
});

test('partial exclusion should partially cancel match', t => {
	t.deepEqual(multimatch(['foo.js', 'bar.js', 'baz.js'], ['*.js', '!f*.js']), ['bar.js', 'baz.js']);
});

test('inclusion / exclusion order matters', t => {
	t.deepEqual(multimatch(['foo.js', 'bar.js', 'baz.js'], ['*.js', '!*.js', 'b*.js']), ['bar.js', 'baz.js']);
	t.deepEqual(multimatch(['foo.js', 'bar.js', 'baz.js'], ['*.js', '!f*.js', '*.js']), ['foo.js', 'bar.js', 'baz.js']);
});

test('should matchBase (minimatch) when specified.', t => {
	t.deepEqual(multimatch(['foo.js', 'bar', 'baz/xyz.js'], '*.js', {matchBase: true}), ['foo.js', 'baz/xyz.js']);
});

test('should not matchBase (minimatch) by default.', t => {
	t.deepEqual(multimatch(['foo.js', 'bar', 'baz/xyz.js'], '*.js'), ['foo.js']);
});
