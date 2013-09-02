do (root = @, name = 'EventMap') ->
  root.udefine.globals[name.toLowerCase()] = root[name]

  root.udefine.inject[name.toLowerCase()] = {name, root}
