do (name = 'EventMap') ->
  udefine.configure (root) ->
    @inject[name.toLowerCase()] = {name, root}