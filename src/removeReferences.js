import * as t from 'babel-types'
import _ from 'lodash'

import isRemovablePath from './isRemovablePath'
import removeExportSpecifier from './removeExportSpecifier'

const removeReferences = (path, specifier) => {
  if (!path.scope.getBinding(specifier)) return
  const { referencePaths } = path.scope.getBinding(specifier)

  _.forEach(referencePaths, referencePath => {
    const parent = referencePath.findParent(isRemovablePath)

    if (parent.removed) return
    if (t.isArrowFunctionExpression(parent)) {
      parent.get('body').remove()
      return
    }
    if (t.isExportSpecifier(parent)) {
      removeExportSpecifier(parent)
      return
    }
    if (t.isVariableDeclarator(parent)) removeReferences(parent, _.get(parent, 'node.id.name'))
    parent.remove()
  })
}

export default removeReferences
