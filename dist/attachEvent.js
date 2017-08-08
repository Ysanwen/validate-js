'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('./config.js');

var _config2 = _interopRequireDefault(_config);

var _doValidate = require('./doValidate.js');

var _doValidate2 = _interopRequireDefault(_doValidate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function dispatchFunc(e) {
  if (e.target.className.indexOf('validate') < 0) {
    return;
  } else {
    var triggerEvent = e.target.getAttribute('validate-trigger');
    if (!triggerEvent) {
      // default trigger validate when 'onchange' event happend
      if (e.type === 'change') {
        (0, _doValidate2.default)(e.target);
      }
    } else {
      if (_config2.default.eventList.indexOf(triggerEvent) >= 0 && triggerEvent === e.type) {
        (0, _doValidate2.default)(e.target);
      }
    }
  }
}

function attachEvent() {
  if (document.addEventListener) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _config2.default.eventList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;

        document.addEventListener(item, dispatchFunc, true);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  } else if (document.attachEvent) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = _config2.default.eventList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _item = _step2.value;

        document.attachEvent('on' + _item, dispatchFunc);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }
}
exports.default = attachEvent;
module.exports = exports['default'];