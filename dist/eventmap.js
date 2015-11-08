(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["EventMap"] = factory();
	else
		root["EventMap"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _methods = __webpack_require__(1);

	var _methods2 = _interopRequireDefault(_methods);

	var _statics = __webpack_require__(10);

	var _statics2 = _interopRequireDefault(_statics);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// TODO: Evaluate if we can do without a class?

	var EventMap = function EventMap(options) {
	  _classCallCheck(this, EventMap);

	  this.events = {};
	};

	// Stitch everything together
	// Instance methods first

	EventMap.maxListeners = -1;
	Object.keys(_methods2.default).forEach(function (method) {
	  EventMap.prototype[method] = function () {
	    return _methods2.default[method].apply(this, arguments);
	  };
	});

	// Static methods next
	Object.keys(_statics2.default).forEach(function (staticMethod) {
	  EventMap[staticMethod] = function () {
	    return _statics2.default[staticMethod](EventMap).apply(this, arguments);
	  };
	});

	exports.default = EventMap;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _all = __webpack_require__(2);

	var _all2 = _interopRequireDefault(_all);

	var _deserialize = __webpack_require__(3);

	var _deserialize2 = _interopRequireDefault(_deserialize);

	var _filter = __webpack_require__(4);

	var _filter2 = _interopRequireDefault(_filter);

	var _many = __webpack_require__(5);

	var _many2 = _interopRequireDefault(_many);

	var _off = __webpack_require__(6);

	var _off2 = _interopRequireDefault(_off);

	var _on = __webpack_require__(7);

	var _on2 = _interopRequireDefault(_on);

	var _serialize = __webpack_require__(8);

	var _serialize2 = _interopRequireDefault(_serialize);

	var _trigger = __webpack_require__(9);

	var _trigger2 = _interopRequireDefault(_trigger);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = { all: _all2.default, deserialize: _deserialize2.default, filter: _filter2.default, many: _many2.default, on: _on2.default, off: _off2.default, serialize: _serialize2.default, trigger: _trigger2.default };

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  this.trigger('*');

	  return this;
	};

	;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (string) {
	  var events = {};

	  try {
	    events = JSON.parse(string, function (key, value) {
	      return value.indexOf('function') === 0 ? new Function(value)() : value;
	    });
	  } catch (err) {
	    console.error('Error while deserializing eventmap: ' + err);
	    return this;
	  }

	  this.events.listeners = events;

	  return this;
	};

	;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (isFilter) {};

	;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  var _this = this;

	  for (var _len = arguments.length, names = Array(_len), _key = 0; _key < _len; _key++) {
	    names[_key] = arguments[_key];
	  }

	  names.forEach(function (name) {
	    return _this.trigger(name);
	  });

	  return this;
	};

	;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {};

	;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (eventName, eventFunction) {};

	;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  var result = '';

	  try {
	    result = JSON.stringify(this.events.listeners, function (key, value) {
	      return typeof value === 'function' ? value.toString() : value;
	    });
	  } catch (err) {
	    console.error('Error while serializing eventmap: ' + err);
	  }

	  return result;
	};

	;

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (name) {

	  return this;
	};

	;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _mixin = __webpack_require__(11);

	var _mixin2 = _interopRequireDefault(_mixin);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = { mixin: _mixin2.default };

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (EventMap) {
	  return function (instance, Type) {
	    var eventmap = new EventMap();

	    instance.events = eventmap.events;

	    Object.keys(Object.getPrototypeOf(eventmap)).forEach(function (methodName) {
	      if (!Type) {
	        instance[methodName] = EventMap.prototype[methodName].bind(instance);
	      } else {
	        Type.prototype[methodName] = EventMap.prototype[methodName];
	      }
	    });
	  };
	};

	;

/***/ }
/******/ ])
});
;