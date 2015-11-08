import methods from './methods';
import statics from './statics';

// TODO: Evaluate if we can do without a class?
class EventMap {
  constructor(options) {
    this.events = {}
  }

  static maxListeners = -1
}

// Stitch everything together
// Instance methods first
Object.keys(methods).forEach(method => {
  EventMap.prototype[method] = function() {
    return methods[method].apply(this, arguments);
  };
});

// Static methods next
Object.keys(statics).forEach(staticMethod => {
  EventMap[staticMethod] = function() {
    return statics[staticMethod](EventMap).apply(this, arguments);
  };
});

export default EventMap;
