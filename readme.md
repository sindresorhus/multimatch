# multimatch

> Extends [`minimatch.match()`](https://github.com/isaacs/minimatch#minimatchmatchlist-pattern-options) with support for multiple patterns

## Install

```sh
npm install multimatch
```

## Usage

```js
import multimatch from 'multimatch';

multimatch(['unicorn', 'cake', 'rainbows'], ['*', '!cake']);
//=> ['unicorn', 'rainbows']
```

See the [tests](test) for more usage examples and expected matches.

## API

### multimatch(paths, patterns, options?)

Returns an array of matching paths in the order of input paths.

#### paths

Type: `string | string[]`

The paths to match against.

#### patterns

Type: `string | string[]`

Globbing patterns to use. For example: `['*', '!cake']`. See supported [`minimatch` patterns](https://github.com/isaacs/minimatch#usage).

- [Pattern examples with expected matches](https://github.com/sindresorhus/multimatch/blob/master/test/test.js)
- [Quick globbing pattern overview](https://github.com/sindresorhus/multimatch#globbing-patterns)

#### options

Type: `object`

See the [`minimatch` options](https://github.com/isaacs/minimatch#options).

## How multiple patterns work

Positive patterns (e.g. `foo` or `*`) add to the results, while negative patterns (e.g. `!foo`) subtract from the results.

Therefore a lone negation (e.g. `['!foo']`) will never match anything. Use `['*', '!foo']` instead.

## Globbing patterns

Just a quick overview.

- `*` matches any number of characters, but not `/`
- `?` matches a single character, but not `/`
- `**` matches any number of characters, including `/`, as long as it's the only thing in a path part
- `{}` allows for a comma-separated list of "or" expressions
- `!` at the beginning of a pattern will negate the match

## Related

- [globby](https://github.com/sindresorhus/globby) - Match against the filesystem instead of a list
- [matcher](https://github.com/sindresorhus/matcher) - Simple wildcard matching
