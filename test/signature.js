(function() {
  var EventMap, expect;

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
      return expect(EventMap.prototype.off).to.be.a('function');
    });
    it('EventMap#one exists', function() {
      return expect(EventMap.prototype.one).to.be.a('function');
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
    it('EventMap#trigger exists', function() {
      return expect(EventMap.prototype.trigger).to.be.a('function');
    });
    it('EventMap.alternateNames exists', function() {
      return expect(EventMap.alternateNames).to.be.a('boolean');
    });
    it('EventMap.mixin exists', function() {
      return expect(EventMap.mixin).to.be.a('function');
    });
    it('EventMap alternative method names for #trigger and #on exist', function() {
      expect(EventMap.prototype.emit).to.be.a('function');
      expect(EventMap.prototype.addListener).to.be.a('function');
      expect(EventMap.prototype.removeListener).to.be.a('function');
      return expect(EventMap.prototype.once).to.be.a('function');
    });
    return it('EventMap instance has all properties', function() {
      var e;
      e = new EventMap();
      expect(e.events).to.be.a('object');
      expect(e.events.listeners).to.be.a('object');
      expect(e.events.valid).to.be.a('array');
      expect(e.events.sender).to.not.exist;
      expect(e.events.options).to.be.a('object');
      expect(e.events.options.shorthandFunctions).to.be.a('object');
      expect(e.events.options.shorthandFunctions.enabled).to.be.a('boolean');
      return expect(e.events.options.shorthandFunctions.separator).to.be.a('string');
    });
  });

}).call(this);
