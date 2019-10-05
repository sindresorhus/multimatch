'use strict';
const minimatch = require('minimatch');
const arrayUnion = require('array-union');
const arrayDiffer = require('array-differ');
const arrify = require('arrify');

module.exports = (list, patterns, options = {}) => {
	list = arrify(list);
	patterns = arrify(patterns);

	if (list.length === 0 || patterns.length === 0) {
		return [];
	}

	const unsorted = patterns.reduce((result, pattern) => {
		let process = arrayUnion;

		if (pattern[0] === '!') {
			pattern = pattern.slice(1);
			process = arrayDiffer;
		}

		return process(result, minimatch.match(list, pattern, options));
	}, []);
	if (options.ordered) {
		return list.filter(el => unsorted.indexOf(el) > -1);
	}

	return unsorted;
};
