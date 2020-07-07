'use strict';
const minimatch = require('minimatch');
const arrayUnion = require('array-union');
const arrayDiffer = require('array-differ');
const arrify = require('arrify');

module.exports = (list, patterns, options = {}) => {
	list = arrify(list);
	patterns = arrify(patterns);
	let result = [];

	if (list.length === 0 || patterns.length === 0) {
		return [];
	}

	for (const el of list) {
		for (let pattern of patterns) {
			let process = arrayUnion;

			if (pattern[0] === '!') {
				pattern = pattern.slice(1);
				process = arrayDiffer;
			}

			result = process(result, minimatch.match([el], pattern, options));
		}
	}

	return result;
};
