(function() {
  var EventMap, expect;

  require('udefine/global');

  EventMap = require('../dist/eventmap');

  expect = require('chai').expect;

  describe('EventMap', function() {
    it('EventMap is a function', function() {
      return expect(EventMap).to.be.a('function');
    });
    it('EventMap#serialize exists', function() {
      return expect(EventMap.prototype.serialize).to.be.a('function');
    });
    it('EventMap#deserialize exists', function() {
      return expect(EventMap.prototype.deserialize).to.be.a('function');
    });
    it('EventMap#bind exists', function() {
      return expect(EventMap.prototype.bind).to.be.a('function');
    });
    it('EventMap#on exists', function() {
      return expect(EventMap.prototype.on).to.be.a('function');
    });
    it('EventMap#off exists', function() {
      return expect(EventMap.prototype.on).to.be.a('function');
    });
    it('EventMap#before exists', function() {
      return expect(EventMap.prototype.before).to.be.a('function');
    });
    it('EventMap#after exists', function() {
      return expect(EventMap.prototype.after).to.be.a('function');
    });
    it('EventMap#clear exists', function() {
      return expect(EventMap.prototype.clear).to.be.a('function');
    });
    return it('EventMap#trigger exists', function() {
      return expect(EventMap.prototype.trigger).to.be.a('function');
    });
  });

}).call(this);
