(function() {
  (function(name) {
    return udefine.configure(function(root) {
      return this.globals(function() {
        return udefine.inject.add(name.toLowerCase(), {
          name: name,
          root: root
        });
      });
    });
  })('EventMap');

}).call(this);

(function() {
  'use strict';
  var defaults, flatten, hasProp,
    __slice = [].slice;

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
        if (typeof value === 'object') {
          opts[key] = {};
          defaults(opts[key], value);
        } else {
          opts[key] = value;
        }
      }
    }
    return opts;
  };

  flatten = function(arr) {
    return [].concat.call([], arr);
  };

  udefine('eventmap', ['root'], function(root) {
    var EventMap;
    return EventMap = (function() {
      function EventMap(options) {
        options = defaults(options, {
          shorthandFunctions: {
            enabled: true,
            separator: '/'
          }
        });
        this.sender = null;
        this.events = {};
        this.validEvents = [];
        this.options = options;
      }

      EventMap.prototype.serialize = function() {
        var err, result;
        try {
          result = JSON.stringify(this.events, function(key, value) {
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
        this.events = events;
        return true;
      };

      EventMap.prototype.bind = function(eventName, context) {
        var bindSingleEvent, e, _i, _len,
          _this = this;
        if (context == null) {
          context = this;
        }
        if (!this.options.shorthandFunctions.enabled) {
          return;
        }
        if (!Array.isArray(eventName)) {
          eventName = [eventName];
        }
        bindSingleEvent = function(evName) {
          if (!hasProp.call(context, evName)) {
            return context[evName] = function() {
              var args;
              args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              return this.trigger.apply(this, flatten([evName, args]));
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
        if (this.validEvents.length > 0) {
          if (this.validEvents.indexOf(eventName) === -1) {
            return;
          }
        }
        (_base = this.events)[eventName] || (_base[eventName] = {
          id: -1,
          type: ''
        });
        (_base1 = this.events[eventName])['now'] || (_base1['now'] = []);
        this.events[eventName]['now'].push(eventFunction);
        this.bind(eventName);
        return this;
      };

      EventMap.prototype.off = function(eventName) {
        var id, type, _ref;
        if (eventName && this.events[eventName]) {
          _ref = this.events[eventName], id = _ref.id, type = _ref.type;
          if (type === 'once' || type === 'repeat') {
            if (type === 'repeat') {
              root.clearInterval(id);
            }
            if (type === 'once') {
              root.clearTimeout(id);
            }
          }
          if (this.events[eventName]) {
            delete this.events[eventName];
          }
        } else {
          return;
        }
        return this;
      };

      EventMap.prototype.before = function(eventName, eventFunction) {
        var _base, _base1;
        if (!eventFunction) {
          return;
        }
        (_base = this.events)[eventName] || (_base[eventName] = {});
        (_base1 = this.events[eventName])['before'] || (_base1['before'] = []);
        this.events[eventName]['before'].push(eventFunction);
        return this;
      };

      EventMap.prototype.after = function(eventName, eventFunction) {
        var _base, _base1;
        if (!eventFunction) {
          return;
        }
        (_base = this.events)[eventName] || (_base[eventName] = {});
        (_base1 = this.events[eventName])['after'] || (_base1['after'] = []);
        this.events[eventName]['after'].push(eventFunction);
        return this;
      };

      EventMap.prototype.clear = function() {
        this.events = {};
        this.validEvents = [];
        return this;
      };

      EventMap.prototype.trigger = function() {
        var args, context, delay, e, ev, eventName, interval, name, repeat, sender, timeoutId, triggerEvent, triggerFunction, _i, _len, _ref,
          _this = this;
        eventName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (eventName == null) {
          return;
        }
        if (Array.isArray(eventName)) {
          for (_i = 0, _len = eventName.length; _i < _len; _i++) {
            e = eventName[_i];
            this.trigger(e, args);
          }
        }
        if (typeof eventName === 'object') {
          name = eventName.name, interval = eventName.interval, repeat = eventName.repeat, context = eventName.context, delay = eventName.delay, sender = eventName.sender;
        } else {
          name = eventName;
        }
        if (((_ref = this.events[name]) != null ? _ref['now'] : void 0) == null) {
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
          sender = this.sender;
        }
        if (sender == null) {
          context.sender = sender;
        }
        triggerFunction = function() {
          var afterArr, beforeArr, callEvents, nowArr;
          nowArr = _this.events[name]['now'] || [];
          beforeArr = _this.events[name]['before'] || [];
          afterArr = _this.events[name]['after'] || [];
          callEvents = function(eventArr) {
            var _j, _len1;
            if (eventArr != null) {
              for (_j = 0, _len1 = eventArr.length; _j < _len1; _j++) {
                e = eventArr[_j];
                e.apply(context, args);
              }
            }
            return null;
          };
          callEvents(beforeArr);
          callEvents(nowArr);
          return callEvents(afterArr);
        };
        ev = this.events[name];
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

      return EventMap;

    })();
  });

  if (udefine.env.commonjs) {
    udefine.require('eventmap', function(EventMap) {
      return module.exports = EventMap;
    });
  }

}).call(this);
