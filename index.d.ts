import {type MinimatchOptions} from 'minimatch';

export type Options = Readonly<MinimatchOptions>;

/**
Extends [`minimatch.match()`](https://github.com/isaacs/minimatch#minimatchmatchlist-pattern-options) with support for multiple patterns.

Positive patterns (e.g. `foo` or `*`) add to the results, while negative patterns (e.g. `!foo`) subtract from the results.

Therefore a lone negation (e.g. `['!foo']`) will never match anything. Use `['*', '!foo']` instead.

@param paths - The paths to match against.
@param patterns - Globbing patterns to use. For example: `['*', '!cake']`. See supported [`minimatch` patterns](https://github.com/isaacs/minimatch#usage).
@param options - See the [`minimatch` options](https://github.com/isaacs/minimatch#options).
@returns The matching paths in the order of input paths.

@example
```
import multimatch from 'multimatch';

multimatch(['unicorn', 'cake', 'rainbows'], ['*', '!cake']);
//=> ['unicorn', 'rainbows']
```
*/
export default function multimatch(
	paths: string | readonly string[],
	patterns: string | readonly string[],
	options?: Options
): string[];
