export default function(name) {
  if (name === '*') {
    throw new Error('* is not allowed as an event name');
  }
};
