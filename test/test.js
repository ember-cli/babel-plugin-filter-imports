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
      blacklist: ['strict'],
      modules: 'commonStrict',
      plugins: [filterImports(options)]
    });

    assert.strictEqual(result.code, expected);
  });
}

describe('babel-plugin-filter-imports', function() {
  testFixture('default',   { assert: ['default'] });
  testFixture('named',     { assert: ['a'] });
  testFixture('namespace', { assert: ['*'] });

  testFixture('shadowing', { assert: ['default'] });
  testFixture('nesting',   { assert: ['default'] });

  testFixture('partial-filter-1', { assert: ['default'], cloud: ['default'] });
  testFixture('partial-filter-2', { assert: ['a', 'c'] });
  testFixture('partial-filter-3', { assert: ['a', 'c'] });

  it('provides a baseDir', function() {
    var expectedPath = path.join(__dirname, '..');

    var instance = filterImports({ assert: ['default'] });

    assert.equal(instance.baseDir(), expectedPath);
  });

  it('includes options in `cacheKey`', function() {
    var first = filterImports({ assert: ['default'] });
    var second = filterImports({ assert: ['assert'] });

    assert.notEqual(first.cacheKey(), second.cacheKey());
  });
});
