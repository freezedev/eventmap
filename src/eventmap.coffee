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
  
checkEventName = (name) ->
  if name is '*' then throw new Error '* is not allowed as an event name'

# Flattens an array
flatten = (arr) -> [].concat.call [], arr

udefine 'eventmap', ['root'], (root) ->
  
  class EventMap
   
    constructor: (options) ->
      options = defaults options,
        shorthandFunctions:
          enabled: true
          separator: '/'
      
      @sender = null
      @events = {}
      @validEvents = []
      
      @options = options

    @alternateNames = true

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

    bind: (eventName, context = @) ->
      return unless @options.shorthandFunctions.enabled
      
      eventName = [eventName] unless Array.isArray eventName
      
      bindSingleEvent = (evName) =>
        unless hasProp.call context, evName
          context[evName] = (args...) ->
            @trigger.apply @, flatten([evName, args])
            
      bindSingleEvent e for e in eventName
      
      @

    on: (eventName, eventFunction) ->
      return unless eventFunction
      
      checkEventName eventName

      if @validEvents.length > 0
        return if @validEvents.indexOf(eventName) is -1
      
      @events[eventName] or=
        id: -1
        type: ''
      
      @events[eventName]['now'] or= []

      @events[eventName]['now'].push eventFunction
      
      @bind eventName
      
      @
      
    off: (eventName) ->
      if eventName and @events[eventName]
        {id, type} = @events[eventName]
  
        if type is 'once' or type is 'repeat'
          root.clearInterval id if type is 'repeat'
          root.clearTimeout id if type is 'once'
  
        delete @events[eventName] if @events[eventName]
      else
        return

      @
    
    one: (eventName, eventFunction) ->
      @on eventName, =>
        eventFunction.apply @, arguments
        @off eventName
    
    before: (eventName, eventFunction) ->
      return unless eventFunction
      
      checkEventName eventName
      
      @events[eventName] or= {}
      
      @events[eventName]['before'] or= []
      
      @events[eventName]['before'].push eventFunction
      
      @
      
    after: (eventName, eventFunction) ->
      return unless eventFunction
      
      checkEventName eventName
      
      @events[eventName] or= {}
      
      @events[eventName]['after'] or= []
      
      @events[eventName]['after'].push eventFunction
      
      @
    
    clear: ->
      @events = {}
      @validEvents = []
      
      @
    
    all: ->
      @trigger '*'
      
      @
    
    trigger: (eventName, args...) ->
      # Break if eventName parameter has been omitted
      return unless eventName?
      
      if eventName is '*'
        @trigger e, args for e in Object.keys @events
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
      return unless @events[name]?['now']?

      # Set default values
      interval = 0 unless interval?
      repeat = false unless repeat?
      context = {} unless context?
      delay = 0 unless delay?
      sender = @sender unless sender?
      
      context.sender = sender unless sender?
      
      # TODO: Add support for asynchronous functions
      triggerFunction = =>
        nowArr = @events[name]['now'] || []
        beforeArr = @events[name]['before'] || []
        afterArr = @events[name]['after'] || []
        
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
      ev = @events[name]
      
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
      
    if @alternateNames
      EventMap::addListener = EventMap::on
      EventMap::emit = EventMap::trigger
      EventMap::once = EventMap::one

# Our current CommonJS workaround
if udefine.env.commonjs
  udefine.require 'eventmap', (EventMap) -> module.exports = EventMap