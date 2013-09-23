'use strict'

# ES5 shims
do -> Array.isArray ?= (a) -> a.push is Array.prototype.push and a.length?

# hasOwnProperty shorthand
hasProp = {}.hasOwnProperty

# Default options, similar to _.defaults, but without the edge cases
# of $.extend
defaults = (opts, defOpts) ->
  opts = {} unless opts?
    
  for key, value of defOpts
    unless hasProp.call opts, key
      if typeof value is 'object'
        opts[key] = {}
        defaults opts[key], value
      else
        opts[key] = value
      
  opts

# Flattens an array
flatten = (arr) -> [].concat.call [], arr

udefine 'eventmap', ['root'], (root) ->
  
  class EventMap
   
    constructor: (options) ->
      options = defaults options,
        shorthandFunctions:
          enabled: true
          context: @
          separator: '/'
      
      @events = {}
      @validEvents = []
      
      @options = options

    serialize: ->
      try
        result = JSON.stringify @events, (key, value) ->
          value = value.toString() if typeof value is 'function'
          value
      catch err
        console.error "Error while serializing eventmap: #{err}"
      result
      
    deserialize: (string) ->
      try
        events = JSON.parse string, (key, value) ->
          if value.indexOf('function') is 0
            value = new Function(value)()
          value
      catch err
        console.error "Error while deserializing eventmap: #{err}"
        return false
        
      @events = events
      true

    bindShorthandFunction: (eventName) ->
      return unless @options.shorthandFunctions.enabled
      
      bindSingleEvent = (evName) =>
        unless hasProp.call @options.shorthandFunctions.context, eventName
          @options.shorthandFunctions.context[eventName] = (args...) =>
            @trigger.apply @, flatten(eventName, args)
        

    on: (eventName, eventFunction) ->
      return unless eventFunction

      if @validEvents.length > 0
        return if @validEvents.indexOf(eventName) is -1
      
      eventDesc =
        event: eventFunction
        id: -1
        type: ''
      
      @events[eventName] or= {}
      
      @events[eventName]['now'] or= []

      @events[eventName]['now'].push eventDesc
      
      @bindShorthandFunction eventName
      
      @
      
    off: (eventName) ->
      return unless eventName
      
      eventType = @events[eventName].type

      if eventType is 'once' or eventType is 'repeat'
        root.clearInterval @events[eventName].id if eventType is 'repeat'
        root.clearTimeout @events[eventName].id if eventType is 'once'

      delete @events[eventName] if @events[eventName]

      @
    
    
    before: (eventName, eventFunction) ->
      return unless eventFunction
      
      @events[eventName] or= {}
      
      @events[eventName]['before'] or= []
      
      @events[eventName]['before'].push eventFunction
      
      @
      
    after: (eventName, eventFunction) ->
      return unless eventFunction
      
      @events[eventName] or= {}
      
      @events[eventName]['after'] or= []
      
      @events[eventName]['after'].push eventFunction
      
      @
    
    clear: ->
      @events = {}
      @validEvents = []
      
      @
    
    trigger: (eventName, args...) ->
      # Break if eventName parameter has been omitted
      return unless eventName?
      
      # Call multiple events
      trigger e, args for e in eventName if Array.isArray eventName

      # Differentiate between eventName being an object or a string
      if typeof eventName is 'object'
        {name, interval, repeat, context, delay, sender} = eventName
      else
        name = eventName

      # Break if event doesn't exist
      return unless @events[name]

      # Set default values
      interval = 0 unless interval?
      repeat = false unless repeat?
      context = {} unless context?
      delay = 0 unless delay?
      
      
      # TODO: Add support for asynchronous functions
      triggerFunction = (item) =>
        argArray = if sender then flatten [[sender], args] else args
        
        beforeArr = @events[name]['before']
        afterArr = @events[name]['after']
        
        retBefore = (b.apply context, argArray for b in beforeArr) if beforeArr
        
        context.before = retBefore
        
        retNow = item.event.apply context, argArray
        
        context.now = retNow
        
        a.apply context, argArray for a in afterArr if afterArr
      
      # Walk through all events and call them
      for i in @events[name]['now']
        triggerEvent = ->
          if interval
            if repeat
              i.type = 'repeat'
              i.id = root.setInterval triggerFunction, interval
            else
              i.type = 'once'
              i.id = root.setTimeout triggerFunction, interval
          else
            i.type = 'direct'
            triggerFunction.call @, i
          null
        
        if delay
          timeoutId = root.setTimeout (->
            triggerEvent.call @, i
            root.clearTimeout timeoutId
          ), delay
        else
          triggerEvent.call @, i

      @
