var stringify = require('json-stable-stringify');

module.exports = function(filteredImports) {
  function babelPluginFilterImports(babel) {
    // A stack of booleans that determine whether an expression statement
    // should be removed as it is exited. Expression statements are removed
    // when they contain a reference to a filtered imported.
    var shouldRemove;

    return new babel.Transformer('babel-plugin-filter-imports', {
      Program: {
        enter: function() {
          shouldRemove = [];
        },
        exit: function() {
          shouldRemove = undefined;
        }
      },

      ExpressionStatement: {
        enter: function() {
          shouldRemove.push(false);
        },
        exit: function() {
          if (shouldRemove.pop()) {
            this.dangerouslyRemove();
          }
        }
      },

      Identifier: function() {
        // Ensure that we're inside of an expression statement.
        if (shouldRemove.length > 0) {
          if (referencesFilteredImport(this, filteredImports)) {
            shouldRemove[shouldRemove.length - 1] = true;
          }
        }
      }
    });
  };

  babelPluginFilterImports.baseDir = function() {
    return __dirname;
  };

  babelPluginFilterImports.cacheKey = function() {
    return stringify(filteredImports);
  };

  return babelPluginFilterImports;
};

function referencesFilteredImport(identifier, filteredImports) {
  for (var moduleName in filteredImports) {
    var imports = filteredImports[moduleName];
    for (var i = 0; i < imports.length; i++) {
      if (identifier.referencesImport(moduleName, imports[i])) {
        return true;
      }
    }
  }

  return false;
}
