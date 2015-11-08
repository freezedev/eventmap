export default function(EventMap) {
  return function(instance, Type) {
    let eventmap = new EventMap();

    instance.events = eventmap.events;

    Object.keys(Object.getPrototypeOf(eventmap)).forEach(methodName => {
      if (!Type) {
        instance[methodName] = EventMap.prototype[methodName].bind(instance);
      } else {
        Type.prototype[methodName] = EventMap.prototype[methodName];
      }
    });
  };
};
