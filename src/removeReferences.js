import * as t from 'babel-types'
import _ from 'lodash'

import isRemovablePath from './isRemovablePath'

const removeReferences = (path, specifier) => {
  const { referencePaths } = path.scope.getBinding(specifier)

  _.forEach(referencePaths, referencePath => {
    const parent = referencePath.findParent(isRemovablePath)

    if (parent.removed) return
    if (t.isArrowFunctionExpression(parent)) {
      parent.get('body').remove()
      return
    }
    if (t.isVariableDeclarator(parent)) removeReferences(parent, _.get(parent, 'node.id.name'))
    parent.remove()
  })
}

export default removeReferences
