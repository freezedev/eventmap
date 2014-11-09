(function() {
  var Chance, EventMap, chance, expect;

  EventMap = require('../dist/eventmap');

  expect = require('chai').expect;

  Chance = require('chance');

  chance = new Chance();

  describe('EventMap', function() {
    describe('Mix in to simple object', function() {
      var a;
      a = {};
      EventMap.mixin(a);
      beforeEach(function() {
        return a.clear();
      });
      it('Has EventMap methods and properties', function() {
        expect(a).to.be.a('object');
        expect(a.serialize).to.be.a('function');
        expect(a.deserialize).to.be.a('function');
        expect(a.bind).to.be.a('function');
        expect(a.on).to.be.a('function');
        expect(a.off).to.be.a('function');
        expect(a.one).to.be.a('function');
        expect(a.before).to.be.a('function');
        expect(a.after).to.be.a('function');
        expect(a.clear).to.be.a('function');
        expect(a.trigger).to.be.a('function');
        expect(a.events).to.be.a('object');
        expect(a.events.listeners).to.be.a('object');
        expect(a.events.valid).to.be.a('array');
        expect(a.events.sender).to.not.exist;
        expect(a.events.options).to.be.a('object');
        expect(a.events.options.shorthandFunctions).to.be.a('object');
        expect(a.events.options.shorthandFunctions.enabled).to.be.a('boolean');
        return expect(a.events.options.shorthandFunctions.separator).to.be.a('string');
      });
      it('Registering an event has a context', function(done) {
        a.on('b', function() {
          expect(this).to.be.a('object');
          return done();
        });
        return a.trigger('b');
      });
      it('Calling an event with parameters', function(done) {
        var randomString;
        randomString = chance.word();
        a.on('c', function(param) {
          expect(param).to.be.a('string');
          expect(param).to.equal(randomString);
          return done();
        });
        return a.trigger('c', randomString);
      });
      return it('Calling before and after events', function(done) {
        var randomNum;
        randomNum = chance.natural();
        a.on('d', function(param) {
          expect(param).to.be.a('number');
          return expect(param).to.equal(randomNum);
        });
        a.before('d', function(param) {
          expect(param).to.be.a('number');
          return expect(param).to.equal(randomNum);
        });
        a.after('d', function(param) {
          expect(param).to.be.a('number');
          expect(param).to.equal(randomNum);
          return done();
        });
        return a.trigger('d', randomNum);
      });
    });
    return describe('Mix in to constructed object', function() {
      var MyClass, a;
      MyClass = (function() {
        function MyClass() {
          EventMap.mixin(this, MyClass);
        }

        return MyClass;

      })();
      a = new MyClass();
      beforeEach(function() {
        return a.clear();
      });
      it('Has EventMap methods and properties', function() {
        expect(a).to.be.a('object');
        expect(MyClass.prototype.serialize).to.be.a('function');
        expect(MyClass.prototype.deserialize).to.be.a('function');
        expect(MyClass.prototype.bind).to.be.a('function');
        expect(MyClass.prototype.on).to.be.a('function');
        expect(MyClass.prototype.off).to.be.a('function');
        expect(MyClass.prototype.one).to.be.a('function');
        expect(MyClass.prototype.before).to.be.a('function');
        expect(MyClass.prototype.after).to.be.a('function');
        expect(MyClass.prototype.clear).to.be.a('function');
        expect(MyClass.prototype.trigger).to.be.a('function');
        expect(a.events).to.be.a('object');
        expect(a.events.listeners).to.be.a('object');
        expect(a.events.valid).to.be.a('array');
        expect(a.events.sender).to.not.exist;
        expect(a.events.options).to.be.a('object');
        expect(a.events.options.shorthandFunctions).to.be.a('object');
        expect(a.events.options.shorthandFunctions.enabled).to.be.a('boolean');
        return expect(a.events.options.shorthandFunctions.separator).to.be.a('string');
      });
      it('Registering an event has a context', function(done) {
        a.on('b', function() {
          expect(this).to.be.a('object');
          return done();
        });
        return a.trigger('b');
      });
      it('Calling an event with parameters', function(done) {
        var randomString;
        randomString = chance.word();
        a.on('c', function(param) {
          expect(param).to.be.a('string');
          expect(param).to.equal(randomString);
          return done();
        });
        return a.trigger('c', randomString);
      });
      return it('Calling before and after events', function(done) {
        var randomNum;
        randomNum = chance.natural();
        a.on('d', function(param) {
          expect(param).to.be.a('number');
          return expect(param).to.equal(randomNum);
        });
        a.before('d', function(param) {
          expect(param).to.be.a('number');
          return expect(param).to.equal(randomNum);
        });
        a.after('d', function(param) {
          expect(param).to.be.a('number');
          expect(param).to.equal(randomNum);
          return done();
        });
        return a.trigger('d', randomNum);
      });
    });
  });

}).call(this);
