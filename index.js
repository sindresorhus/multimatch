'use strict';
var minimatch = require('minimatch');
var union = require('array-union');
var diff = require('array-differ');
var arrify = require('arrify');

module.exports = function (list, patterns, options) {
	list = arrify(list);
	patterns = arrify(patterns);

	if (list.length === 0 || patterns.length === 0) {
		return [];
	}

	options = options || {};

	return patterns.reduce(function (ret, pattern) {
		var process = union;

		if (pattern[0] === '!') {
			pattern = pattern.slice(1);
			process = diff;
		}

		return process(ret, minimatch.match(list, pattern, options));
	}, []);
};
