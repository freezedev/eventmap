export default function(...names) {
  names.forEach(name => this.trigger(name));

  return this;
};
