EventMap
========
[![Build Status](https://travis-ci.org/freezedev/eventmap.png?branch=master)](https://travis-ci.org/freezedev/eventmap)
[![Dependency Status](https://david-dm.org/freezedev/eventmap.png)](https://david-dm.org/freezedev/eventmap)
[![devDependency Status](https://david-dm.org/freezedev/eventmap/dev-status.png)](https://david-dm.org/freezedev/eventmap#info=devDependencies)

An eventmap provides a mechanism to register events and call them at a later point in time.

The event map is very similar to jQuery events in terms of its API, but it does not bind
anything to the DOM.

It can be used for publish-/subscribe-events.

In some ways, it is similar to Node's EventEmitter or Twitter's Flight, except that EventMap works in Node.js and in the browser.

Installation
------------

If you are using Node.js: `npm install eventmap`  
If you are using Bower: `bower install eventmap`  
(If you also want to save the configuration in your `package.json` or `bower.json` add `--save` to the command.)

Don't use npm or bower? Just grab `eventmap.js` from the `dist` folder and embed it in your application.

Usage in Node.js:  
Use `var EventMap = require('eventmap');` to get started.

Philosophy
----------
* jQuery-like interface
* Dynamic

How to use
----------

__Create an event map instance__  
```javascript
var myEventMap = new EventMap();
```

__Register an event__  
```javascript
myEventMap.on('myevent', function() {
  console.log('My first event');
});
```

__Trigger an event__  
```javascript
myEventMap.trigger('myevent');
// You will now see 'My first event' in the console
```

__Register another event__  
```javascript
myEventMap.on('myevent', function() {
  console.log('My second event');
});
```

__Triggering the same event again__  
```javascript
myEventMap.trigger('myevent');
// You will now see 'My first event' and 'My second event' in the console
```

__Passing arguments to an event__  
```javascript
myEventMap.on('myevent', function(eventNumber) {
  console.log('My ' + eventNumber + ' event');
});

myEventMap.trigger('myevent', 'third');
// You will now see 'My third event' in addition to the previous events
```

You can pass an unlimited amount of arguments to the function.

Advanced usage
--------------

__Using the sender__  
Every event can be triggered with a sender parameter, which is then the first
parameter in the event.
```javascript
myEventMap.on('fromwhere', function(destination) {
  console.log('Coming from ' + destination);
});

myEventMap.trigger({name: 'fromwhere', sender: 'outerSpace'});
// The first parameter is now the sender + all other parameters from .trigger follow after that
```
The sender can be anything, be it a string, number, function, object etc.


__Shorthand functions__  
If you are familiar with jQuery, you know that you ususally bind your event
with `.on('click', function() {})` and you either trigger the event with
`.trigger('click')` or `.click()`.

By default, the eventmap has the functionality:
```
myEventMap.on('coolevent', function() {
  console.log('Shorthand rocks');
});
```

We already know we can trigger a function with `.trigger`, but the shorthand
bindings also allow us to do this:

```
myEventMap.coolevent();
```

The shorthand function binding is pretty non-intrusive, so if a property with
the event name does already exists, it will not overwrite it.

Serializing and deserializing events
------------------------------------

It's as easy as calling `.serialize()` and `.deserialize()`.
The eventmap serializes into an object where the functions are strings and are being evaluated when deserializing.

TODO: Document repeatable and delayed events


Alternative API
---------------

If you prefer the Node.js Event Emitter API instead of the jQuery one, you can actually use these API calls:  
`EventMap.prototype.on` -> `EventMap.prototype.addListener`  
`EventMap.prototype.off` -> `EventMap.prototype.removeListener`  
`EventMap.prototype.trigger` -> `EventMap.prototype.emit`  
`EventMap.prototype.one` -> `EventMap.prototype.once`  