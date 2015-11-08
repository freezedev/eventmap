export default function(eventName, context = this) {
  if (!this.events.options.shorthandFunctions.enabled) {
    return this;
  }

  const eventNames = (Array.isArray(eventName)) ? eventName : [eventName];

  const bindSingleEvent = (evName) => {
    if (!context[evName]) {
      context[evName] = (...args) => {
        args.unshift(evName);
        this.trigger.apply(this, args);
      };
    }
  };

  eventNames.forEach(bindSingleEvent);

  return this;
};
