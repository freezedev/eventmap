(function() {
  var Chance, EventMap, chance, expect, myEventMap;

  require('udefine/global');

  EventMap = require('../dist/eventmap');

  expect = require('chai').expect;

  Chance = require('chance');

  myEventMap = new EventMap();

  chance = new Chance();

  describe('EventMap', function() {
    it('Register an event', function(done) {
      myEventMap.on('a', function() {
        return done();
      });
      return myEventMap.trigger('a');
    });
    it('Registering an event has a context', function(done) {
      myEventMap.on('b', function() {
        expect(this).to.be.a('object');
        return done();
      });
      return myEventMap.trigger('b');
    });
    it('Calling an event with parameters', function(done) {
      var randomString;
      randomString = chance.word();
      myEventMap.on('c', function(param) {
        expect(param).to.be.a('string');
        expect(param).to.equal(randomString);
        return done();
      });
      return myEventMap.trigger('c', randomString);
    });
    return it('Calling before and after events', function(done) {
      var randomNum;
      randomNum = chance.natural();
      myEventMap.on('d', function(param) {
        expect(param).to.be.a('number');
        return expect(param).to.equal(randomNum);
      });
      myEventMap.before('d', function(param) {
        expect(param).to.be.a('number');
        return expect(param).to.equal(randomNum);
      });
      myEventMap.after('d', function(param) {
        expect(param).to.be.a('number');
        expect(param).to.equal(randomNum);
        return done();
      });
      return myEventMap.trigger('d', randomNum);
    });
  });

}).call(this);
