(function() {
  'use strict';
  var factory, root,
    __slice = [].slice;

  root = this;

  factory = function() {
    var EventMap, checkEventName, defaults, hasProp;
    if (Object.getPrototypeOf == null) {
      Object.getPrototypeOf = function(object) {
        var proto;
        proto = object.__proto__;
        if (proto || proto === null) {
          return proto;
        } else {
          if (object.constructor) {
            return object.constructor;
          } else {
            return Object.prototype;
          }
        }
      };
    }
    (function() {
      return Array.isArray != null ? Array.isArray : Array.isArray = function(a) {
        return a.push === Array.prototype.push && (a.length != null);
      };
    })();
    hasProp = {}.hasOwnProperty;
    defaults = function(opts, defOpts) {
      var key, value;
      if (opts == null) {
        opts = {};
      }
      for (key in defOpts) {
        value = defOpts[key];
        if (!hasProp.call(opts, key)) {
          if (typeof value === 'object' && value !== null) {
            opts[key] = {};
            defaults(opts[key], value);
          } else {
            opts[key] = value;
          }
        }
      }
      return opts;
    };
    checkEventName = function(name) {
      if (name === '*') {
        throw new Error('* is not allowed as an event name');
      }
    };
    EventMap = (function() {
      function EventMap(options) {
        options = defaults(options, {
          sender: null,
          shorthandFunctions: {
            enabled: true,
            separator: '/'
          }
        });
        this.events = {
          listeners: {},
          sender: options.sender,
          valid: [],
          options: {
            shorthandFunctions: {
              enabled: options.shorthandFunctions.enabled,
              separator: options.shorthandFunctions.separator
            }
          }
        };
      }

      EventMap.alternateNames = true;

      EventMap.prototype.serialize = function() {
        var err, result;
        try {
          result = JSON.stringify(this.events.listeners, function(key, value) {
            if (typeof value === 'function') {
              value = value.toString();
            }
            return value;
          });
        } catch (_error) {
          err = _error;
          console.error("Error while serializing eventmap: " + err);
        }
        return result;
      };

      EventMap.prototype.deserialize = function(string) {
        var err, events;
        try {
          events = JSON.parse(string, function(key, value) {
            if (value.indexOf('function') === 0) {
              value = new Function(value)();
            }
            return value;
          });
        } catch (_error) {
          err = _error;
          console.error("Error while deserializing eventmap: " + err);
          return false;
        }
        this.events.listeners = events;
        return true;
      };

      EventMap.prototype.bind = function(eventName, context) {
        var bindSingleEvent, e, _i, _len;
        if (context == null) {
          context = this;
        }
        if (!this.events.options.shorthandFunctions.enabled) {
          return;
        }
        if (!Array.isArray(eventName)) {
          eventName = [eventName];
        }
        bindSingleEvent = function(evName) {
          if (!context[evName]) {
            return context[evName] = function() {
              var args;
              args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              args.unshift(evName);
              return this.trigger.apply(this, args);
            };
          }
        };
        for (_i = 0, _len = eventName.length; _i < _len; _i++) {
          e = eventName[_i];
          bindSingleEvent(e);
        }
        return this;
      };

      EventMap.prototype.on = function(eventName, eventFunction) {
        var _base, _base1;
        if (!eventFunction) {
          return;
        }
        checkEventName(eventName);
        if (this.events.valid.length > 0) {
          if (this.events.valid.indexOf(eventName) === -1) {
            return;
          }
        }
        (_base = this.events.listeners)[eventName] || (_base[eventName] = {
          id: -1,
          type: ''
        });
        ((_base1 = this.events.listeners[eventName])['now'] || (_base1['now'] = [])).push(eventFunction);
        this.bind(eventName);
        return this;
      };

      EventMap.prototype.off = function(eventName) {
        var id, type, _ref;
        if (eventName && this.events.listeners[eventName]) {
          _ref = this.events.listeners[eventName], id = _ref.id, type = _ref.type;
          if (type === 'once' || type === 'repeat') {
            if (type === 'repeat') {
              root.clearInterval(id);
            }
            if (type === 'once') {
              root.clearTimeout(id);
            }
          }
          if (this.events.listeners[eventName]) {
            delete this.events.listeners[eventName];
          }
        } else {
          return;
        }
        return this;
      };

      EventMap.prototype.one = function(eventName, eventFunction) {
        return this.on(eventName, (function(_this) {
          return function() {
            eventFunction.apply(_this, arguments);
            return _this.off(eventName);
          };
        })(this));
      };

      EventMap.prototype.before = function(eventName, eventFunction) {
        var _base, _base1;
        if (!eventFunction) {
          return;
        }
        checkEventName(eventName);
        (_base = this.events.listeners)[eventName] || (_base[eventName] = {});
        ((_base1 = this.events.listeners[eventName])['before'] || (_base1['before'] = [])).push(eventFunction);
        return this;
      };

      EventMap.prototype.after = function(eventName, eventFunction) {
        var _base, _base1;
        if (!eventFunction) {
          return;
        }
        checkEventName(eventName);
        (_base = this.events.listeners)[eventName] || (_base[eventName] = {});
        ((_base1 = this.events.listeners[eventName])['after'] || (_base1['after'] = [])).push(eventFunction);
        return this;
      };

      EventMap.prototype.clear = function() {
        this.events.listeners = {};
        this.events.valid = [];
        return this;
      };

      EventMap.prototype.all = function() {
        this.trigger('*');
        return this;
      };

      EventMap.prototype.trigger = function() {
        var args, context, delay, e, ev, eventName, interval, name, repeat, sender, timeoutId, triggerEvent, triggerFunction, _i, _j, _len, _len1, _ref, _ref1;
        eventName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (eventName == null) {
          return;
        }
        if (eventName === '*') {
          _ref = Object.keys(this.events.listeners);
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            e = _ref[_i];
            this.trigger(e, args);
          }
          return;
        }
        if (Array.isArray(eventName)) {
          for (_j = 0, _len1 = eventName.length; _j < _len1; _j++) {
            e = eventName[_j];
            this.trigger(e, args);
          }
        }
        if (typeof eventName === 'object') {
          name = eventName.name, interval = eventName.interval, repeat = eventName.repeat, context = eventName.context, delay = eventName.delay, sender = eventName.sender;
        } else {
          name = eventName;
        }
        if (((_ref1 = this.events.listeners[name]) != null ? _ref1['now'] : void 0) == null) {
          return;
        }
        if (interval == null) {
          interval = 0;
        }
        if (repeat == null) {
          repeat = false;
        }
        if (context == null) {
          context = {};
        }
        if (delay == null) {
          delay = 0;
        }
        if (sender == null) {
          sender = this.events.sender;
        }
        if (sender == null) {
          context.sender = sender;
        }
        triggerFunction = (function(_this) {
          return function() {
            var afterArr, beforeArr, callEvents, nowArr;
            nowArr = _this.events.listeners[name]['now'] || [];
            beforeArr = _this.events.listeners[name]['before'] || [];
            afterArr = _this.events.listeners[name]['after'] || [];
            callEvents = function(eventArr) {
              var event, _k, _l, _len2, _len3;
              if (eventArr != null) {
                for (_k = 0, _len2 = eventArr.length; _k < _len2; _k++) {
                  event = eventArr[_k];
                  if (typeof event === 'string') {
                    _this.trigger(event, args);
                  } else {
                    if (Array.isArray(event)) {
                      for (_l = 0, _len3 = event.length; _l < _len3; _l++) {
                        e = event[_l];
                        _this.trigger(e, args);
                      }
                    } else {
                      event.apply(context, args);
                    }
                  }
                }
              }
              return null;
            };
            callEvents(beforeArr);
            callEvents(nowArr);
            return callEvents(afterArr);
          };
        })(this);
        ev = this.events.listeners[name];
        triggerEvent = function() {
          if (interval) {
            if (repeat) {
              ev.type = 'repeat';
              ev.id = root.setInterval((function() {
                return triggerFunction.call(this);
              }), interval);
            } else {
              ev.type = 'once';
              ev.id = root.setTimeout((function() {
                return triggerFunction.call(this);
              }), interval);
            }
          } else {
            ev.type = 'direct';
            triggerFunction.call(this);
          }
          return null;
        };
        if (delay) {
          timeoutId = root.setTimeout((function() {
            triggerEvent.call(this);
            return root.clearTimeout(timeoutId);
          }), delay);
        } else {
          triggerEvent.call(this);
        }
        return this;
      };

      EventMap.mixin = function(instance, Type) {
        var eventmap;
        eventmap = new EventMap();
        instance.events = eventmap.events;
        Object.keys(Object.getPrototypeOf(eventmap)).forEach(function(methodName) {
          if (!Type) {
            return instance[methodName] = EventMap.prototype[methodName].bind(instance);
          } else {
            return Type.prototype[methodName] = EventMap.prototype[methodName];
          }
        });
        return this;
      };

      if (EventMap.alternateNames) {
        EventMap.prototype.addListener = EventMap.prototype.on;
        EventMap.prototype.removeListener = EventMap.prototype.off;
        EventMap.prototype.emit = EventMap.prototype.trigger;
        EventMap.prototype.once = EventMap.prototype.one;
      }

      return EventMap;

    })();
    EventMap['default'] = EventMap;
    return EventMap;
  };

  if (typeof define === 'function' && define.amd) {
    define('eventmap', [], factory);
  } else {
    if (typeof exports !== null) {
      module.exports = factory();
    } else {
      window.EventMap = factory();
    }
  }

}).call(this);
