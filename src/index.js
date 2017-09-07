import _ from 'lodash'

import getSpecifiersForRemoval from './getSpecifierNames'
import removeReferences from './removeReferences'

export default () => ({
  visitor: {
    ImportDeclaration: (path, { opts }) => {
      const { imports, keepImports = false } = opts
      const { source, specifiers } = path.node
      const members = _.get(imports, _.get(source, 'value'))

      /*
       * Heads up! This condition omits processing of non-filtered imports.
       */
      if (!members) return

      const specifiersForRemoval = getSpecifiersForRemoval(members, specifiers)
      const specifierNames = _.map(specifiersForRemoval, 'local.name')

      _.forEach(specifierNames, specifier => removeReferences(path, specifier))

      if (keepImports) return false
      if (specifiers.length === specifierNames.length) {
        path.remove()
        return
      }

      _.set(path, 'node.specifiers', _.without(specifiers, ...specifiersForRemoval))
    },
  },
})
