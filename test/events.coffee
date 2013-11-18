require 'udefine/global'
EventMap = require '../dist/eventmap'
{expect} = require 'chai'
Chance = require 'chance'

myEventMap = new EventMap()
chance = new Chance()

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
    randomString = chance.word()
    
    myEventMap.on 'c', (param) ->
      expect(param).to.be.a('string')
      expect(param).to.equal(randomString)
      done()
      
    myEventMap.trigger 'c', randomString

  it 'Calling before and after events', (done) ->
    randomNum = chance.natural()
    
    myEventMap.on 'd', (param) ->
      expect(param).to.be.a('number')
      expect(param).to.equal(randomNum)
    
    myEventMap.before 'd', (param) ->
      expect(param).to.be.a('number')
      expect(param).to.equal(randomNum)
      
    myEventMap.after 'd', (param) ->
      expect(param).to.be.a('number')
      expect(param).to.equal(randomNum)
      done()
      
    myEventMap.trigger 'd', randomNum
    
  it 'Calling an event only once', (done) ->
    randomNum = chance.natural()
    
    calls = 0
    callMax = 2
    checkCalls = ->
      if calls is callMax then done()

    
    myEventMap.one 'e', (param) ->
      expect(param).to.be.a('number')
      expect(param).to.equal(randomNum)
      calls++
      checkCalls()
      
    myEventMap.trigger 'e', randomNum

    expect(myEventMap.trigger('e', randomNum)).to.equal(undefined)
    calls++
    checkCalls()
