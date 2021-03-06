'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('./config.js');

var _config2 = _interopRequireDefault(_config);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _showInfo = require('./showInfo.js');

var _showInfo2 = _interopRequireDefault(_showInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userDefine = _config2.default.userDefine;

/* 
** parse params from validate-rule
 */
function parseParams(ruleParams) {
  var pattern = new RegExp('^\{.*\}$');
  if (pattern.test(ruleParams)) {
    var paramsList = ruleParams.replace(/\{|\}/g, '').split(',');
    var result = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = paramsList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;

        if (item.indexOf(':') > 0) {
          result[item.split(':')[0]] = item.split(':')[1];
        } else {
          throw new Error(ruleParams + ' error');
        }
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

    return result;
  } else {
    return ruleParams;
  }
}

/*
** validate the input type with validate-group: just for radio or checkbox
 */
function validateGroup(eventTarget) {
  var groupName = eventTarget.getAttribute('validate-group');
  if (['radio', 'checkbox'].indexOf(eventTarget.type) < 0) return;
  // find all the elements with the same validate-group
  var groupList = document.querySelectorAll('[validate-group=' + groupName + ']');
  // find the one with validate-rule and just only one should has the rule
  var groupListLength = groupList.length;
  var value = [];
  var elementWithRule = [];
  var successInfo = [];
  var failInfo = [];
  for (var item = 0; item < groupList.length; item++) {
    groupList[item].checked && value.push(groupList[item].value);
    groupList[item].getAttribute('validate-rule') && elementWithRule.push(groupList[item]);
    groupList[item].getAttribute('validate-success') && successInfo.push(groupList[item]);
    groupList[item].getAttribute('validate-fail') && failInfo.push(groupList[item]);
  }

  if (elementWithRule.length > 1 || successInfo.length > 1 || failInfo.length > 1) {
    (0, _showInfo2.default)(groupList[groupListLength - 1], false);
    return console.error('validate group ' + groupName + ' is error');
  }
  // no rule defined, use default required rule
  var validateResult = void 0;
  if (elementWithRule.length === 0) {
    validateResult = value.length === 0 ? false : true;
  } else {
    var rule = elementWithRule[0].getAttribute('validate-rule');
    var ruleName = void 0,
        ruleParams = void 0;
    var spliteIndex = rule.indexOf(':');
    ruleName = spliteIndex > 0 ? rule.substr(0, spliteIndex) : rule;
    ruleParams = spliteIndex > 0 ? parseParams(rule.substr(spliteIndex + 1, rule.length)) : false;

    if (ruleName in userDefine) {
      // call user define function
      value = value.join(',');
      validateResult = ruleParams ? userDefine[ruleName].apply(this, [value, ruleParams]) : userDefine[ruleName].apply(this, [value]);
    } else if (ruleName in _config2.default.ruleNames) {
      value = value.join(',');
      validateResult = ruleParams ? _validator2.default[_config2.default.ruleNames[ruleName]].apply(this, [value, ruleParams]) : _validator2.default[_config2.default.ruleNames[ruleName]].apply(this, [value]);
    } else {
      // no this validate name
      validateResult = false;
      console.error('no these validate rule: ' + ruleName);
    }
  }
  if (validateResult) {
    successInfo.length === 1 && (0, _showInfo2.default)(successInfo[0], true);
    successInfo.length === 0 && (0, _showInfo2.default)(groupList[groupListLength - 1], true);
  } else {
    failInfo.length === 1 && (0, _showInfo2.default)(failInfo[0], false);
    failInfo.length === 0 && (0, _showInfo2.default)(groupList[groupListLength - 1], false);
  }
}

function getValue(eventTarget) {
  if (eventTarget.type === 'radio' || eventTarget.type === 'checkbox') {
    if (eventTarget.checked) return eventTarget.value;
  } else if (eventTarget.type === 'file') {
    return eventTarget.files;
  } else {
    return eventTarget.value;
  }
}

function doValidate(eventTarget) {
  if (eventTarget.getAttribute('validate-group')) return validateGroup(eventTarget);
  var validateRule = eventTarget.getAttribute('validate-rule');
  var validateFail = false;
  var value = getValue(eventTarget);
  if (!validateRule) {
    // default use required rule
    if (Object.prototype.toString.call(value).indexOf('FileList') > 0) {
      validateFail = value.length <= 0;
    } else {
      value = _validator2.default.trim(value);
      validateFail = _validator2.default.isEmpty(value);
    }
    if (validateFail) {
      // validate fail
      console.error('need value');
    }
  } else {
    var validateFunctions = validateRule.split('|');
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = validateFunctions[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var item = _step2.value;

        var ruleName = void 0,
            ruleParams = void 0;
        var spliteIndex = item.indexOf(':');
        ruleName = spliteIndex > 0 ? item.substr(0, spliteIndex) : item;
        ruleParams = spliteIndex > 0 ? parseParams(item.substr(spliteIndex + 1, item.length)) : false;

        var validateResult = void 0;
        if (ruleName in _config2.default.ruleNames) {
          // call the validator function
          validateResult = ruleParams ? _validator2.default[_config2.default.ruleNames[ruleName]].apply(this, [value, ruleParams]) : _validator2.default[_config2.default.ruleNames[ruleName]].apply(this, [value]);
        } else if (ruleName in userDefine) {
          // call user define function
          validateResult = ruleParams ? userDefine[ruleName].apply(this, [value, ruleParams]) : userDefine[ruleName].apply(this, [value]);
        } else {
          // no this validate name
          (0, _showInfo2.default)(eventTarget, false);
          console.error('no these validate rule: ' + ruleName);
        }

        var pattern = new RegExp('^do.*');
        if (pattern.test(ruleName)) {
          // after do some filter function, need to set new value
          value = validateResult;
          eventTarget.value = value;
        } else {
          // validate fail
          if (!validateResult) {
            console.error('validate rule "' + ruleName + '" error');
            validateFail = true;
            break;
          } else {
            console.log('validate rule "' + ruleName + '" success');
          }
        }
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
  (0, _showInfo2.default)(eventTarget, !validateFail);
}

exports.default = doValidate;
module.exports = exports['default'];