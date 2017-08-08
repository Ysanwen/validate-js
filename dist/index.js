'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate = undefined;

var _attachEvent = require('./attachEvent.js');

var _attachEvent2 = _interopRequireDefault(_attachEvent);

var _doValidate = require('./doValidate.js');

var _doValidate2 = _interopRequireDefault(_doValidate);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _config = require('./config.js');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateValidate() {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.keys(_validator2.default)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      this[item] = _validator2.default[item];
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

  this.version = _config2.default.version;
  if (typeof window !== 'undefined') {
    this.autoValidate = _attachEvent2.default;
    this.doValidate = _doValidate2.default;
    this.validateAll = function () {
      var findAllEl = document.getElementsByClassName('validate');
      if (findAllEl.length <= 0) return;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = findAllEl[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var item = _step2.value;

          (0, _doValidate2.default)(item);
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
    };
    // user define rule
    this.addRule = _config2.default.addRule;
    return this;
  }
}

exports.default = new generateValidate();
var validate = exports.validate = new generateValidate();