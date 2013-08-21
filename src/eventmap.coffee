udefine 'eventmap', ['root'], (root) ->
  'use strict'
  
  class EventMap
   
    constructor: ->
      @events = {}
      @validEvents = []

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

    on: (eventName, eventFunction) ->
      return unless eventFunction

      if @validEvents.length > 0
        return if @validEvents.indexOf(eventName) is -1
      
      eventDesc =
        event: eventFunction
        id: -1
        type: ''
      
      unless @events[eventName]
        @events[eventName] = [eventDesc]
      else
        @events[eventName].push eventDesc
      
      @
      
    off: (eventName) ->
      return unless eventName
      
      eventType = @events[eventName].type

      if eventType is 'once' or eventType is 'repeat'
        root.clearInterval @events[eventName].id if eventType is 'repeat'
        root.clearTimeout @events[eventName].id if eventType is 'once'

      delete @events[eventName] if @events[eventName]

      @
    
    clear: ->
      @events = {}
      @validEvents = []
      
      @
    
    trigger: (eventName, args...) ->
      # Break if eventName parameter has been omitted
      return unless eventName?

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
      context = @ unless context?
      delay = 0 unless delay?
      
      
      triggerFunction = (item) ->
        if sender
          item.event.apply context, [].concat.apply [], [[sender], args]
        else
          item.event.apply context, args
      
      # Walk through all events and call them
      for i in @events[name]
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
          timeoutId = root.setTimeout ->
            triggerEvent.call @, i
            root.clearTimeout timeoutId
        else
          triggerEvent.call @, i

      @

      
  if udefine.env.browser then root.EventMap = EventMap else EventMap