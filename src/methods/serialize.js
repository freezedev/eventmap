export default function() {
  let result = '';

  try {
    result = JSON.stringify(this.events.listeners, (key, value) => {
      return (typeof value === 'function') ? value.toString() : value;
    });
  } catch(err) {
    console.error(`Error while serializing eventmap: ${err}`);
  }

  return result;
};
