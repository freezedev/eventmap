EventMap = require '../dist/eventmap'
{expect} = require 'chai'

describe 'EventMap', ->
  describe 'Mix in to simple object', ->
    
    a = {}
    EventMap.mixin a
    
    it 'Has EventMap methods and properties', ->
      expect(a).to.be.a('object')