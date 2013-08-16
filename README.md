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

Every eventmap has a `sender` property, which can be used from where the event
has been triggered.
```javascript
myEventMap.sender = 'outerSpace';

myEventMap.on('fromwhere', function(destination) {
  console.log('Coming from ' + destination);
});

myEventMap.trigger({name: 'fromwhere', useSender: true});
// The first parameter is now the sender + all other parameters from .trigger follow after that
```
(The sender can also be passed to constructor as a parameter.)

TODO: Document repeatable and delayed events