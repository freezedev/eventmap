require 'udefine/global'
EventMap = require '../dist/eventmap'
{expect} = require 'chai'

describe 'EventMap', ->
  it 'EventMap is a function', ->
    expect(EventMap).to.be.a('function')

  it 'EventMap#serialize exists', ->
    expect(EventMap.prototype.serialize).to.be.a('function')

  it 'EventMap#deserialize exists', ->
    expect(EventMap.prototype.deserialize).to.be.a('function')

  it 'EventMap#bind exists', ->
    expect(EventMap.prototype.bind).to.be.a('function')

  it 'EventMap#on exists', ->
    expect(EventMap.prototype.on).to.be.a('function')

  it 'EventMap#off exists', ->
    expect(EventMap.prototype.on).to.be.a('function')

  it 'EventMap#before exists', ->
    expect(EventMap.prototype.before).to.be.a('function')
    
  it 'EventMap#after exists', ->
    expect(EventMap.prototype.after).to.be.a('function')

  it 'EventMap#clear exists', ->
    expect(EventMap.prototype.clear).to.be.a('function')
    
  it 'EventMap#trigger exists', ->
    expect(EventMap.prototype.trigger).to.be.a('function')
  
  it 'EventMap.alternateNames exists', ->
    expect(EventMap.alternateNames).to.be.a('boolean')