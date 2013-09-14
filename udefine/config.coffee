do (name = 'EventMap') ->
  udefine.configure (root) ->
    @globals[name.toLowerCase()] = root[name]
  
    @inject[name.toLowerCase()] = {name, root}