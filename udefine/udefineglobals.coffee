do (root = @) ->
  root.udefine.globals.root = root;
  
  define('root', -> root) if root.define?