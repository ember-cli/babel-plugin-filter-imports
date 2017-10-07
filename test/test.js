import { transformFileSync } from 'babel-core'
import assert from 'assert'
import fs from 'fs'
import { it, describe } from 'mocha'
import path from 'path'

import filterImports from '../src'

const testFixtureWithPlugins = (name, plugins) => {
  it(name, function() {
    const fixturePath = path.resolve(__dirname, 'fixtures', name, 'fixture.js')
    const expectedPath = path.resolve(__dirname, 'fixtures', name, 'expected.js')

    const expected = fs.readFileSync(expectedPath).toString()
    const result = transformFileSync(fixturePath, {
      babelrc: false,
      plugins: plugins,
    })

    assert.strictEqual(result.code.trim(), expected.trim())
  })
}

const testFixture = (name, imports, keepImports = false) =>
  testFixtureWithPlugins(name, [
    [
      filterImports,
      {
        imports,
        keepImports,
      },
    ],
  ])

describe('babel-plugin-filter-imports', () => {
  testFixture('default', { assert: ['default'] })
  testFixture('named', { assert: ['a'] })
  testFixture('unnamed', { assert: ['assert'] })
  testFixture('namespace', { assert: ['*'] })

  testFixture('callback', { assert: ['default'] })
  testFixture('declaration', { assert: ['default'] })
  testFixture('declaration-multiple', { assert: ['default'] })
  testFixture('decorator', { assert: ['default'], butter: ['default'] })
  testFixture('export', { assert: ['default', 'b', 'd'] })
  testFixture('export-default', { assert: ['default'], butter: ['default'], cloud: ['default'] })
  testFixture('export-leftover', { assert: ['default'] })
  testFixture('nested-calls', { assert: ['a', 'b'] })
  testFixture('nesting', { assert: ['default'] })
  testFixture('mixed', { assert: ['default', 'cloud'] })
  testFixture('return', { assert: ['default'] })
  testFixture('shadowing', { assert: ['default'] })
  testFixture('referencing', { assert: ['default'] })

  testFixture('partial-filter-1', { assert: ['default'], cloud: ['default'] })
  testFixture('partial-filter-2', { assert: ['a', 'c'] })
  testFixture('partial-filter-3', { assert: ['a', 'c'] })

  testFixture('keep-import', { assert: ['default'] }, true)
  testFixtureWithPlugins('multiple-instance', [
    [filterImports, { imports: { assert: ['default'] } }],
    [filterImports, { imports: { cloud: ['default'] } }],
  ])
})
