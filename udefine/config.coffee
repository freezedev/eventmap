do (root = @) ->
  root.udefine.globals['eventmap'] = root.EventMap
  
  root.udefine.inject['eventmap'] =
    root: root
    name: 'EventMap'
