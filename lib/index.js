'use strict';

const es6Exports = require('@std/esm')(module)('./index.mjs');

module.exports = es6Exports.default;

for (const key of Object.keys(es6Exports)) {
  module.exports[key] = es6Exports[key];
}
