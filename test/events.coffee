require 'udefine/global'
EventMap = require '../dist/eventmap'
{expect} = require 'chai'

myEventMap = new EventMap()

describe 'EventMap', ->
  it 'Register an event', (done) ->
    myEventMap.on 'a', -> done()
    
    myEventMap.trigger 'a'
      
  it 'Registering an event has a context', (done) ->
    myEventMap.on 'b', ->
      expect(@).to.be.a('object')
      done()
      
    myEventMap.trigger 'b'

  it 'Calling an event with parameters', (done) ->
    myEventMap.on 'c', (param) ->
      expect(param).to.be.a('string')
      expect(param).to.equal('test')
      done()
      
    myEventMap.trigger 'c', 'test'

  it 'Calling before and after events', (done) ->
    myEventMap.on 'd', (param) ->
      expect(param).to.be.a('number')
      expect(param).to.equal(5)
    
    myEventMap.before 'd', (param) ->
      expect(param).to.be.a('number')
      expect(param).to.equal(5)
      
    myEventMap.after 'd', (param) ->
      expect(param).to.be.a('number')
      expect(param).to.equal(5)
      done()
      
    myEventMap.trigger 'd', 5