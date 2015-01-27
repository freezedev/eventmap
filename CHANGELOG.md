1.5.0
- Removed `EventMap.default` as it interferes with 6to5's interop modes
- Update devDependencies
- Add `EventMap.maxListeners`

1.4.1
- Fixes `EventMap` being bound to `window.EventMap` when neither a AMD loader or a CommonJS environment is present
- Add shim for `Object.getPrototypeOf`
- `sender` can now be passed in as an option when constructed an `EventMap` instance
- Fixes #6: Shorthand functions with parameters are correctly handled

1.4.0
- Removes `udefine` dependency
- `EventMap` instance only sets a single property to avoid duplicates when `EventMap` is being mixed in
- Improve ES6 module interopability by returning a default property
- Add `EventMap.mixin` to allow `EventMap` to be mixed in to plain objects and constructors

1.2.1
- `udefine` is not being distributed with EventMap any more

1.2.0
- `udefine` dependency is now being resolved through Bower

1.1.0
- `sender` can be set with each `trigger` instead of being set from the `EventMap` instance

1.0.0
- Initial release