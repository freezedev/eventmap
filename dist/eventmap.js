(function() {
  'use strict';
  var hasModule;

  hasModule = (typeof module !== "undefined" && module !== null) && module.exports;

  (function(root) {
    var _base, _base1, _base2;
    root.udefine || (root.udefine = function(name, deps, factory) {
      var dep, globalsArr, requireArr, result, _ref;
      if (name == null) {
        throw new Error('A udefine module needs to have a name');
      }
      if (typeof deps === 'function') {
        _ref = [name, [], deps], name = _ref[0], deps = _ref[1], factory = _ref[2];
      }
      if (typeof define !== "undefined" && define !== null) {
        if (define.amd || define.umd) {
          result = define.apply(this, arguments);
        }
      } else {
        if (hasModule) {
          requireArr = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = deps.length; _i < _len; _i++) {
              dep = deps[_i];
              _results.push(require(root.udefine.node[dep]));
            }
            return _results;
          })();
          result = module.exports = factory.apply(this);
        } else {
          globalsArr = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = deps.length; _i < _len; _i++) {
              dep = deps[_i];
              _results.push(root.udefine.globals[dep]);
            }
            return _results;
          })();
          result = factory.apply(this, globalsArr);
        }
      }
      return result;
    });
    (_base = root.udefine).globals || (_base.globals = {});
    (_base1 = root.udefine).commonjs || (_base1.commonjs = {});
    (_base2 = root.udefine).env || (_base2.env = {
      amd: (function() {
        return (typeof define !== "undefined" && define !== null) && (define.amd || define.umd);
      })(),
      commonjs: (function() {
        return hasModule;
      })(),
      browser: (function() {
        return !hasModule;
      })()
    });
    return null;
  })(hasModule ? global : this);

}).call(this);

(function() {
  (function(root) {
    root.udefine.globals.root = root;
    if (root.define != null) {
      return define('root', function() {
        return root;
      });
    }
  })(this);

}).call(this);

(function() {
  var __slice = [].slice;

  udefine('eventmap', ['root'], function(root) {
    'use strict';
    var EventMap;
    EventMap = (function() {
      function EventMap(sender) {
        this.sender = sender;
        this.events = {};
        this.validEvents = [];
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

      EventMap.prototype.on = function(eventName, eventFunction) {
        var eventDesc;
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
          type: '',
          sender: this.sender
        };
        if (!this.events[eventName]) {
          this.events[eventName] = [eventDesc];
        } else {
          this.events[eventName].push(eventDesc);
        }
        return this;
      };

      EventMap.prototype.off = function(eventName) {
        var eventType;
        if (!eventName) {
          return;
        }
        eventType = this.events[eventName].type;
        if (eventType === 'once' || eventType === 'repeat') {
          if (eventType === 'repeat') {
            root.clearInterval(this.events[eventName].id);
          }
          if (eventType === 'once') {
            root.clearTimeout(this.events[eventName].id);
          }
        }
        if (this.events[eventName]) {
          delete this.events[eventName];
        }
        return this;
      };

      EventMap.prototype.clear = function() {
        this.events = {};
        this.validEvents = [];
        return this;
      };

      EventMap.prototype.trigger = function() {
        var args, context, delay, eventName, i, interval, name, repeat, timeoutId, triggerEvent, triggerFunction, useSender, _i, _len, _ref;
        eventName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (eventName == null) {
          return;
        }
        if (typeof eventName === 'object') {
          name = eventName.name, interval = eventName.interval, repeat = eventName.repeat, context = eventName.context, delay = eventName.delay, useSender = eventName.useSender;
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
          context = this;
        }
        if (delay == null) {
          delay = 0;
        }
        triggerFunction = function(item) {
          if (useSender) {
            return item.event.apply(context, [].concat.apply([], [[item.sender], args]));
          } else {
            return item.event.apply(context, args);
          }
        };
        _ref = this.events[name];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          triggerEvent = function() {
            if (interval) {
              if (repeat) {
                i.type = 'repeat';
                i.id = root.setInterval(triggerFunction, interval);
              } else {
                i.type = 'once';
                i.id = root.setTimeout(triggerFunction, interval);
              }
            } else {
              i.type = 'direct';
              triggerFunction.call(this, i);
            }
            return null;
          };
          if (delay) {
            timeoutId = root.setTimeout(function() {
              triggerEvent.call(this, i);
              return root.clearTimeout(timeoutId);
            });
          } else {
            triggerEvent.call(this, i);
          }
        }
        return this;
      };

      return EventMap;

    })();
    if (udefine.env.browser) {
      return root.EventMap = EventMap;
    } else {
      return EventMap;
    }
  });

}).call(this);
