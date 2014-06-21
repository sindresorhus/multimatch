'use strict';
var minimatch = require('minimatch');
var union = require('array-union');
var diff = require('array-differ');

function arrayify(arr) {
  return !Array.isArray(arr) ? [arr] : arr;
}

module.exports = function(list, patterns, options) {
  patterns = arrayify(patterns);
  list = arrayify(list);

  if (!list.length || !patterns.length) {return [];}

  return patterns.reduce(function(res, pattern) {
    var excluded = [], included = [];
    if (/^!/.test(pattern)) {
      var negated = pattern.replace('!', '');
      excluded = minimatch.match(list, negated, options);
    } else {
      included = minimatch.match(list, pattern, options);
    }
    included = union(res, included);
    return diff(included, excluded);
  }, []);
};