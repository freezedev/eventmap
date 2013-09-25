do (name = 'EventMap') ->
  udefine.configure (root) ->
    @globals -> udefine.inject.add name.toLowerCase(), {name, root}