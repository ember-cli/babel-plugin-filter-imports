var assert = require('assert');
var fs = require('fs');
var path = require('path');
var babel = require('babel-core');
var filterImports = require('../index');

function testFixture(name, options) {
  it(name, function () {
    var fixturePath = path.resolve(__dirname, 'fixtures', name, 'fixture.js');
    var expectedPath = path.resolve(__dirname, 'fixtures', name, 'expected.js');

    var expected = fs.readFileSync(expectedPath).toString();
    var result = babel.transformFileSync(fixturePath, {
      plugins: [ filterImports(options) ]
    });

    assert.strictEqual(result.code, expected);
  });
}

describe('babel-plugin-filter-imports', function() {
  testFixture('default', 'assert');
  testFixture('named', 'assert');
  testFixture('namespace', 'assert');
  testFixture('shadowing', 'assert');
  testFixture('multiple-filters', ['assert', 'cloud']);
  testFixture('nesting', ['assert']);
});
