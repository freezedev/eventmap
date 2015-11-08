(function() {
  'use strict';
  var factory, root,
    slice1 = [].slice;

  root = this;

  factory = function() {
    var EventMap, addEventListener, checkEventName, defaults, hasProp, slice;
    slice = Array.prototype.slice;
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
    addEventListener = function(property, eventName, eventFunction) {
      var base, base1;
      checkEventName(eventName);
      (base = this.events.listeners)[eventName] || (base[eventName] = {});
      return ((base1 = this.events.listeners[eventName])[property] || (base1[property] = [])).push(eventFunction);
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

      EventMap.maxListeners = -1;

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
        var bindSingleEvent, e, i, len;
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
              args = 1 <= arguments.length ? slice1.call(arguments, 0) : [];
              args.unshift(evName);
              return this.trigger.apply(this, args);
            };
          }
        };
        for (i = 0, len = eventName.length; i < len; i++) {
          e = eventName[i];
          bindSingleEvent(e);
        }
        return this;
      };

      EventMap.prototype.on = function(eventName, eventFunction) {
        var base, base1, base2, errMsg, maxListeners;
        if (!eventFunction) {
          return;
        }
        if (this.events.valid.length > 0) {
          if (this.events.valid.indexOf(eventName) === -1) {
            return;
          }
        }
        (base = this.events.listeners)[eventName] || (base[eventName] = {
          id: -1,
          type: ''
        });
        maxListeners = EventMap.maxListeners;
        if (maxListeners > 0) {
          errMsg = "Event " + eventName + " already has " + maxListeners + " events";
          if (maxListeners === ((base1 = this.events.listeners[eventName])['now'] || (base1['now'] = [])).length) {
            throw new Error(errMsg);
          }
        }
        checkEventName(eventName);
        ((base2 = this.events.listeners[eventName])['now'] || (base2['now'] = [])).push(eventFunction);
        this.bind(eventName);
        return this;
      };

      EventMap.prototype.off = function(eventName) {
        var id, ref, type;
        if (eventName && this.events.listeners[eventName]) {
          ref = this.events.listeners[eventName], id = ref.id, type = ref.type;
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
        if (!eventFunction) {
          return;
        }
        addEventListener.call(this, 'before', eventName, eventFunction);
        return this;
      };

      EventMap.prototype.after = function(eventName, eventFunction) {
        if (!eventFunction) {
          return;
        }
        addEventListener.call(this, 'after', eventName, eventFunction);
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
        var args, context, delay, e, ev, eventName, i, interval, j, len, len1, name, ref, ref1, repeat, sender, timeoutId, triggerEvent, triggerFunction;
        eventName = arguments[0], args = 2 <= arguments.length ? slice1.call(arguments, 1) : [];
        if (eventName == null) {
          return;
        }
        if (eventName === '*') {
          ref = Object.keys(this.events.listeners);
          for (i = 0, len = ref.length; i < len; i++) {
            e = ref[i];
            this.trigger(e, args);
          }
          return;
        }
        if (Array.isArray(eventName)) {
          for (j = 0, len1 = eventName.length; j < len1; j++) {
            e = eventName[j];
            this.trigger(e, args);
          }
        }
        if (typeof eventName === 'object') {
          name = eventName.name, interval = eventName.interval, repeat = eventName.repeat, context = eventName.context, delay = eventName.delay, sender = eventName.sender;
        } else {
          name = eventName;
        }
        if (((ref1 = this.events.listeners[name]) != null ? ref1['now'] : void 0) == null) {
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
              var event, k, l, len2, len3;
              if (eventArr != null) {
                for (k = 0, len2 = eventArr.length; k < len2; k++) {
                  event = eventArr[k];
                  if (typeof event === 'string') {
                    _this.trigger(event, args);
                  } else {
                    if (Array.isArray(event)) {
                      for (l = 0, len3 = event.length; l < len3; l++) {
                        e = event[l];
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
    EventMap.maxListeners = -1;
    return EventMap;
  };

  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    if (typeof exports !== "undefined" && exports !== null) {
      module.exports = factory();
    } else {
      window.EventMap = factory();
    }
  }

}).call(this);
