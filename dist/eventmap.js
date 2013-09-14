(function() {
  (function(name) {
    return udefine.configure(function(root) {
      this.globals[name.toLowerCase()] = root[name];
      return this.inject[name.toLowerCase()] = {
        name: name,
        root: root
      };
    });
  })('EventMap');

}).call(this);

(function() {
  'use strict';
  var defaults, flatten, hasProp,
    __slice = [].slice;

  hasProp = {}.hasOwnProperty;

  defaults = function(opts, defOpts) {
    var key, value;
    if (opts == null) {
      opts = {};
    }
    for (key in defOpts) {
      value = defOpts[key];
      if (!hasProp.call(opts, key)) {
        opts[key] = value;
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
          shorthandFunctions: true,
          shorthandFunctionContext: this
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

      EventMap.prototype.on = function(eventName, eventFunction) {
        var eventDesc,
          _this = this;
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
        if (!this.events[eventName]) {
          this.events[eventName] = [eventDesc];
        } else {
          this.events[eventName].push(eventDesc);
        }
        if (this.options.shorthandFunctions) {
          if (!hasProp.call(this.options.shorthandFunctionContext, eventName)) {
            this.options.shorthandFunctionContext[eventName] = function() {
              var args;
              args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              return _this.trigger.apply(_this, flatten(eventName, args));
            };
          }
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
        var args, context, delay, eventName, i, interval, name, repeat, sender, timeoutId, triggerEvent, triggerFunction, _i, _len, _ref;
        eventName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (eventName == null) {
          return;
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
          context = this;
        }
        if (delay == null) {
          delay = 0;
        }
        triggerFunction = function(item) {
          if (sender) {
            return item.event.apply(context, flatten([[sender], args]));
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
  });

}).call(this);
