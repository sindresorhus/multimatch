'use strict';
var minimatch = require('minimatch');
var _ = require('lodash');

function arrayify(arr) {
  return _.flatten(!Array.isArray(arr) ? [arr] : arr);
}

function process(arr, pattern, options) {
  var a = [], b = [];
  if (/^!/.test(pattern)) {
    var negated = pattern.replace('!', '');
    a = minimatch.match(arr, negated, options);
  } else {
    b = minimatch.match(arr, pattern, options);
  }
  return {excluded: a, included: b};
}

module.exports = function(list, patterns, options) {
  patterns = arrayify(patterns);
  list = arrayify(list);

  if (!list.length || !patterns.length) {return [];}

  return _.reduce(patterns, function(res, pattern) {
    var matches = process(list, pattern, options || {});
    var included = _.union(res, matches.included);
    return _.difference(included, matches.excluded);
  }, []);
};