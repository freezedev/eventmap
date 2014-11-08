EventMap = require '../dist/eventmap'
{expect} = require 'chai'

describe 'EventMap', ->
  it 'EventMap is a function', ->
    expect(EventMap).to.be.a('function')

  it 'EventMap#serialize exists', ->
    expect(EventMap::serialize).to.be.a('function')

  it 'EventMap#deserialize exists', ->
    expect(EventMap::deserialize).to.be.a('function')

  it 'EventMap#bind exists', ->
    expect(EventMap::bind).to.be.a('function')

  it 'EventMap#on exists', ->
    expect(EventMap::on).to.be.a('function')

  it 'EventMap#off exists', ->
    expect(EventMap::on).to.be.a('function')
    
  it 'EventMap#one exists', ->
    expect(EventMap::one).to.be.a('function')

  it 'EventMap#before exists', ->
    expect(EventMap::before).to.be.a('function')
    
  it 'EventMap#after exists', ->
    expect(EventMap::after).to.be.a('function')

  it 'EventMap#clear exists', ->
    expect(EventMap::clear).to.be.a('function')
    
  it 'EventMap#trigger exists', ->
    expect(EventMap::trigger).to.be.a('function')
  
  it 'EventMap.alternateNames exists', ->
    expect(EventMap.alternateNames).to.be.a('boolean')
    
  it 'EventMap.mixin exists', ->
    expect(EventMap.mixin).to.be.a('function')
    
  it 'EventMap alternative method names for #trigger and #on exist', ->
    expect(EventMap::emit).to.be.a('function')
    expect(EventMap::addListener).to.be.a('function')
    expect(EventMap::removeListener).to.be.a('function')
    expect(EventMap::once).to.be.a('function')
    
  it 'EventMap instance has all properties', ->
    e = new EventMap()
    
    expect(e.events).to.be.a('object')
    expect(e.events.listeners).to.be.a('object')
    expect(e.events.valid).to.be.a('array')
    expect(e.events.sender).to.exist
    expect(e.events.options).to.be.a('object')
    expect(e.events.options.shorthandFunctions).to.be.a('object')
    expect(e.events.options.shorthandFunctions.enabled).to.be.a('boolean')
    expect(e.events.options.shorthandFunctions.separator).to.be.a('string')