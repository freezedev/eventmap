if exports?
  # Server-side
  EventMap = require '../dist/eventmap'
  {expect} = require 'chai'
  Chance = require 'chance'
else
  # Client-side
  {EventMap, Chance} = window
  {expect} = window.chai

chance = new Chance()

describe 'EventMap', ->
  describe 'Mix in to simple object', ->
    
    a = {}
    EventMap.mixin a
    
    beforeEach -> a.clear()
    
    it 'Has EventMap methods and properties', ->
      expect(a).to.be.a('object')
      
      expect(a.serialize).to.be.a('function')
      expect(a.deserialize).to.be.a('function')
      expect(a.bind).to.be.a('function')
      expect(a.on).to.be.a('function')
      expect(a.off).to.be.a('function')
      expect(a.one).to.be.a('function')
      expect(a.before).to.be.a('function')
      expect(a.after).to.be.a('function')
      expect(a.clear).to.be.a('function')
      expect(a.trigger).to.be.a('function')
      expect(a.events).to.be.a('object')
      expect(a.events.listeners).to.be.a('object')
      expect(a.events.valid).to.be.a('array')
      expect(a.events.sender).to.not.exist
      expect(a.events.options).to.be.a('object')
      expect(a.events.options.shorthandFunctions).to.be.a('object')
      expect(a.events.options.shorthandFunctions.enabled).to.be.a('boolean')
      expect(a.events.options.shorthandFunctions.separator).to.be.a('string')
      
    it 'Registering an event has a context', (done) ->
      a.on 'b', ->
        expect(@).to.be.a('object')
        done()
        
      a.trigger 'b'
  
    it 'Calling an event with parameters', (done) ->
      randomString = chance.word()
      
      a.on 'c', (param) ->
        expect(param).to.be.a('string')
        expect(param).to.equal(randomString)
        done()
        
      a.trigger 'c', randomString
  
    it 'Calling before and after events', (done) ->
      randomNum = chance.natural()
      
      a.on 'd', (param) ->
        expect(param).to.be.a('number')
        expect(param).to.equal(randomNum)
      
      a.before 'd', (param) ->
        expect(param).to.be.a('number')
        expect(param).to.equal(randomNum)
        
      a.after 'd', (param) ->
        expect(param).to.be.a('number')
        expect(param).to.equal(randomNum)
        done()
        
      a.trigger 'd', randomNum
  
      
  describe 'Mix in to constructed object', ->
    
    class MyClass
      constructor: ->
        EventMap.mixin @, MyClass
    
    a = new MyClass()
    
    beforeEach -> a.clear()
    
    it 'Has EventMap methods and properties', ->
      expect(a).to.be.a('object')
      
      expect(MyClass::serialize).to.be.a('function')
      expect(MyClass::deserialize).to.be.a('function')
      expect(MyClass::bind).to.be.a('function')
      expect(MyClass::on).to.be.a('function')
      expect(MyClass::off).to.be.a('function')
      expect(MyClass::one).to.be.a('function')
      expect(MyClass::before).to.be.a('function')
      expect(MyClass::after).to.be.a('function')
      expect(MyClass::clear).to.be.a('function')
      expect(MyClass::trigger).to.be.a('function')
      expect(a.events).to.be.a('object')
      expect(a.events.listeners).to.be.a('object')
      expect(a.events.valid).to.be.a('array')
      expect(a.events.sender).to.not.exist
      expect(a.events.options).to.be.a('object')
      expect(a.events.options.shorthandFunctions).to.be.a('object')
      expect(a.events.options.shorthandFunctions.enabled).to.be.a('boolean')
      expect(a.events.options.shorthandFunctions.separator).to.be.a('string')
      
    it 'Registering an event has a context', (done) ->
      a.on 'b', ->
        expect(@).to.be.a('object')
        done()
        
      a.trigger 'b'
  
    it 'Calling an event with parameters', (done) ->
      randomString = chance.word()
      
      a.on 'c', (param) ->
        expect(param).to.be.a('string')
        expect(param).to.equal(randomString)
        done()
        
      a.trigger 'c', randomString
  
    it 'Calling before and after events', (done) ->
      randomNum = chance.natural()
      
      a.on 'd', (param) ->
        expect(param).to.be.a('number')
        expect(param).to.equal(randomNum)
      
      a.before 'd', (param) ->
        expect(param).to.be.a('number')
        expect(param).to.equal(randomNum)
        
      a.after 'd', (param) ->
        expect(param).to.be.a('number')
        expect(param).to.equal(randomNum)
        done()
        
      a.trigger 'd', randomNum