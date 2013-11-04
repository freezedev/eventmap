(function() {
  var EventMap, expect, myEventMap;

  require('udefine/global');

  EventMap = require('../dist/eventmap');

  expect = require('chai').expect;

  myEventMap = new EventMap();

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
      myEventMap.on('c', function(param) {
        expect(param).to.be.a('string');
        expect(param).to.equal('test');
        return done();
      });
      return myEventMap.trigger('c', 'test');
    });
    return it('Calling before and after events', function(done) {
      myEventMap.on('d', function(param) {
        expect(param).to.be.a('number');
        return expect(param).to.equal(5);
      });
      myEventMap.before('d', function(param) {
        expect(param).to.be.a('number');
        return expect(param).to.equal(5);
      });
      myEventMap.after('d', function(param) {
        expect(param).to.be.a('number');
        expect(param).to.equal(5);
        return done();
      });
      return myEventMap.trigger('d', 5);
    });
  });

}).call(this);
