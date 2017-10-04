import * as t from 'babel-types'

const isRemovablePath = path =>
  t.isArrowFunctionExpression(path) ||
  t.isExpressionStatement(path) ||
  t.isReturnStatement(path) ||
  t.isVariableDeclarator(path) ||
  t.isExportSpecifier(path)

export default isRemovablePath
