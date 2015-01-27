'use strict'

# Global reference
root = @

# Factory definition
factory = ->
  # Object.getPrototypeOf shim
  Object.getPrototypeOf ?= (object) ->
    proto = object.__proto__
    if proto or proto is null
      return proto
    else
      if object.constructor
        return object.constructor
       else
        return Object.prototype
  
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
        if typeof value is 'object' and value isnt null
          opts[key] = {}
          defaults opts[key], value
        else
          opts[key] = value
        
    opts
    
  checkEventName = (name) ->
    if name is '*' then throw new Error '* is not allowed as an event name'

  addEventListener = (property, eventName, eventFunction) ->
    checkEventName eventName

    @events.listeners[eventName] or= {}

    (@events.listeners[eventName][property] or= []).push eventFunction

  class EventMap
    constructor: (options) ->
      options = defaults options,
        sender: null,
        shorthandFunctions:
          enabled: true
          separator: '/'
      
      @events =
        listeners: {}
        sender: options.sender
        valid: []
        options:
          shorthandFunctions:
            enabled: options.shorthandFunctions.enabled
            separator: options.shorthandFunctions.separator

    @alternateNames = true
    @maxListeners = -1

    serialize: ->
      try
        result = JSON.stringify @events.listeners, (key, value) ->
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
        
      @events.listeners = events
      true

    bind: (eventName, context = @) ->
      return unless @events.options.shorthandFunctions.enabled
      
      eventName = [eventName] unless Array.isArray eventName
      
      bindSingleEvent = (evName) ->
        unless context[evName]
          context[evName] = (args...) ->
            args.unshift(evName)
            @trigger.apply @, args
            
      bindSingleEvent e for e in eventName
      
      @

    on: (eventName, eventFunction) ->
      return unless eventFunction

      if EventMap.maxListeners > 0
        if EventMap.maxListeners is @events.listeners[eventName]['now'].length
          throw new Error "Event listener #{eventName} already has #{EventMap.maxListeners} events"

      checkEventName eventName

      if @events.valid.length > 0
        return if @events.valid.indexOf(eventName) is -1
      
      @events.listeners[eventName] or=
        id: -1
        type: ''
      
      (@events.listeners[eventName]['now'] or= []).push eventFunction

      @bind eventName
      
      @
      
    off: (eventName) ->
      if eventName and @events.listeners[eventName]
        {id, type} = @events.listeners[eventName]
  
        if type is 'once' or type is 'repeat'
          root.clearInterval id if type is 'repeat'
          root.clearTimeout id if type is 'once'
  
        delete @events.listeners[eventName] if @events.listeners[eventName]
      else
        return

      @
    
    one: (eventName, eventFunction) ->
      @on eventName, =>
        eventFunction.apply @, arguments
        @off eventName
    
    before: (eventName, eventFunction) ->
      return unless eventFunction

      addEventListener.call @, 'before', eventName, eventFunction
      
      @
      
    after: (eventName, eventFunction) ->
      return unless eventFunction

      addEventListener.call @, 'after', eventName, eventFunction
      
      @
    
    clear: ->
      @events.listeners = {}
      @events.valid = []
      
      @
    
    all: ->
      @trigger '*'
      
      @
    
    trigger: (eventName, args...) ->
      # Break if eventName parameter has been omitted
      return unless eventName?
      
      if eventName is '*'
        @trigger e, args for e in Object.keys @events.listeners
        return
      
      # Call multiple events
      @trigger e, args for e in eventName if Array.isArray eventName

      # Differentiate between eventName being an object or a string
      if typeof eventName is 'object'
        {name, interval, repeat, context, delay, sender} = eventName
      else
        name = eventName

      # Break if event doesn't exist
      # Also break if there are events defined in "now"
      return unless @events.listeners[name]?['now']?

      # Set default values
      interval = 0 unless interval?
      repeat = false unless repeat?
      context = {} unless context?
      delay = 0 unless delay?
      sender = @events.sender unless sender?
      
      context.sender = sender unless sender?
      
      # TODO: Add support for asynchronous functions
      triggerFunction = =>
        nowArr = @events.listeners[name]['now'] || []
        beforeArr = @events.listeners[name]['before'] || []
        afterArr = @events.listeners[name]['after'] || []
        
        callEvents = (eventArr) =>
          if eventArr?
            for event in eventArr
              if typeof event is 'string'
                @trigger event, args
              else
                if Array.isArray event
                  for e in event
                    @trigger e, args
                else
                  event.apply context, args
          null
        
        # Call before events
        callEvents beforeArr
        
        # Call actual events
        callEvents nowArr
        
        # Call after events
        callEvents afterArr
      
      # Call event
      ev = @events.listeners[name]
      
      triggerEvent = ->
        if interval
          if repeat
            ev.type = 'repeat'
            ev.id = root.setInterval (-> triggerFunction.call(@)), interval
          else
            ev.type = 'once'
            ev.id = root.setTimeout (-> triggerFunction.call(@)), interval
        else
          ev.type = 'direct'
          triggerFunction.call @
        null
      
      if delay
        timeoutId = root.setTimeout (->
          triggerEvent.call @
          root.clearTimeout timeoutId
        ), delay
      else
        triggerEvent.call @
      
      @
    
    @mixin: (instance, Type) ->
      eventmap = new EventMap()
      
      instance.events = eventmap.events
      
      Object.keys(Object.getPrototypeOf(eventmap)).forEach (methodName) ->
        unless Type
          instance[methodName] = EventMap::[methodName].bind(instance)
        else
          Type::[methodName] = EventMap::[methodName]
        
      @
      
    if @alternateNames
      EventMap::addListener = EventMap::on
      EventMap::removeListener = EventMap::off
      EventMap::emit = EventMap::trigger
      EventMap::once = EventMap::one


  EventMap.maxListeners = -1

  # Return reference
  EventMap
  
  
if typeof define is 'function' and define.amd
  # AMD
  define 'eventmap', [], factory
else
  if typeof exports != null
    # CommonJS
    module.exports = factory()
  else
    # Globals
    window.EventMap = factory()