EventMap = require '../dist/eventmap'
{expect} = require 'chai'

describe 'EventMap', ->
  describe 'Mix in to simple object', ->
    
    a = {}
    EventMap.mixin a
    
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