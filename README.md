EventMap
========

An eventmap provides a mechanism to register events and call them at a later point in time.

The event map is very similar to jQuery events in terms of its API, but it does not bind
anything to the DOM.

It can be used for publish-/subscribe-events.

How to use
----------

Create an event map instance
```javascript
var myEventMap = new EventMap();
```

Register an event
```javascript
myEventMap.on('myevent', function() {
  console.log('My first event');
});
```

Trigger an event
```javascript
myEventMap.trigger('myevent');
// You will now see 'My first event' in the console
```

Register another event
```javascript
myEventMap.on('myevent', function() {
  console.log('My second event');
});
```

Triggering the same event again
```javascript
myEventMap.trigger('myevent');
// You will now see 'My first event' and 'My second event' in the console
```

Passing arguments to an event
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

Using the sender

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


Shorthand functions

If you are familiar with jQuery, you know that you ususally bind your event
with `.on('click', function() {})` and you either trigger the event with
`.trigger('click')` or `.click()`.



TODO: Document repeatable and delayed events
TODO: Shorthand functions
TODO: Serializing and deserializing