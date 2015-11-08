export default function(string) {
  let events = {};

  try {
    events = JSON.parse(string, (key, value) => {
      return (value.indexOf('function') === 0) ? (new Function(value)()) : value;
    });
  } catch (err) {
    console.error(`Error while deserializing eventmap: ${err}`);
    return this;
  }

  this.events.listeners = events;

  return this;
};
