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
              return this.trigger.apply(this, flatten(evName, args));
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
        var eventDesc, _base, _base1;
        if (!eventFunction) {
          return;
        }
        if (this.validEvents.length > 0) {
          if (this.validEvents.indexOf(eventName) === -1) {
            return;
          }
        }
        eventDesc = {
          event: eventFunction,
          id: -1,
          type: ''
        };
        (_base = this.events)[eventName] || (_base[eventName] = {});
        (_base1 = this.events[eventName])['now'] || (_base1['now'] = []);
        this.events[eventName]['now'].push(eventDesc);
        this.bind(eventName);
        return this;
      };

      EventMap.prototype.off = function(eventName) {
        var e, eventType, _i, _len, _ref;
        if (!(eventName || this.events[eventName] || this.events[eventName]['now'])) {
          return;
        }
        _ref = this.events[eventName]['now'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          e = _ref[_i];
          eventType = e.type;
          if (eventType === 'once' || eventType === 'repeat') {
            if (eventType === 'repeat') {
              root.clearInterval(e.id);
            }
            if (eventType === 'once') {
              root.clearTimeout(e.id);
            }
          }
        }
        if (this.events[eventName]) {
          delete this.events[eventName];
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
        var args, context, delay, e, eventName, i, interval, name, repeat, sender, timeoutId, triggerEvent, triggerFunction, _i, _j, _len, _len1, _ref,
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
        if (!this.events[name]) {
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
        triggerFunction = function(item) {
          var a, afterArr, argArray, b, beforeArr, _j, _k, _len1, _len2, _results;
          argArray = sender ? flatten([[sender], args]) : args;
          beforeArr = _this.events[name]['before'] || [];
          afterArr = _this.events[name]['after'] || [];
          if (beforeArr) {
            for (_j = 0, _len1 = beforeArr.length; _j < _len1; _j++) {
              b = beforeArr[_j];
              b.apply(context, argArray);
            }
          }
          item.event.apply(context, argArray);
          if (afterArr) {
            _results = [];
            for (_k = 0, _len2 = afterArr.length; _k < _len2; _k++) {
              a = afterArr[_k];
              _results.push(a.apply(context, argArray));
            }
            return _results;
          }
        };
        _ref = this.events[name]['now'];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          i = _ref[_j];
          triggerEvent = function() {
            if (interval) {
              if (repeat) {
                i.type = 'repeat';
                i.id = root.setInterval((function() {
                  return triggerFunction.call(this, i);
                }), interval);
              } else {
                i.type = 'once';
                i.id = root.setTimeout((function() {
                  return triggerFunction.call(this, i);
                }), interval);
              }
            } else {
              i.type = 'direct';
              triggerFunction.call(this, i);
            }
            return null;
          };
          if (delay) {
            timeoutId = root.setTimeout((function() {
              triggerEvent.call(this, i);
              return root.clearTimeout(timeoutId);
            }), delay);
          } else {
            triggerEvent.call(this, i);
          }
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
