export default function(eventName, eventFunction) {
  this.on(eventName, () => {
    eventFunction.apply(this, arguments);
    this.off(eventName, eventFunction);
  });

  return this;
};
