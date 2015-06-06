module.exports = function(filteredModules) {
  if (!Array.isArray(filteredModules)) {
    filteredModules = [filteredModules];
  }

  return function(babel) {
    var importDeclarationsToRemove;
    var shouldRemoveStack;

    return new babel.Transformer('babel-filter-imports', {
      Program: {
        enter: function() {
          importDeclarationsToRemove = [];
          shouldRemoveStack = [];
        },
        exit: function() {
          importDeclarationsToRemove.forEach(function(declaration) {
            declaration.dangerouslyRemove();
          });

          importDeclarationsToRemove = undefined;
          shouldRemoveStack = undefined;
        }
      },

      ExpressionStatement: {
        enter: function() {
          shouldRemoveStack.push(false);
        },
        exit: function() {
          if (shouldRemoveStack.pop()) {
            this.dangerouslyRemove();
          }
        }
      },

      ImportDeclaration: function(node) {
        var name = node.source.value;
        if (filteredModules.indexOf(name) !== -1) {
          importDeclarationsToRemove.push(this);
        }
      },

      Identifier: function(node) {
        if (shouldRemoveStack.length > 0) {
          var identifier = this;
          var referencesImport = filteredModules.some(function(name) {
            return identifier.referencesImport(name);
          });

          if (referencesImport) {
            shouldRemoveStack[shouldRemoveStack.length-1] = true;
          }
        }
      }
    });
  };
};
