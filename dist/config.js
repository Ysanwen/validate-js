'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var version = '0.0.1';
var eventList = ['change', 'keypress', 'keydown', 'keyup', 'blur'];
var userDefine = {};
var ruleNames = {
  contains: 'contains',
  equals: 'equals',
  afterDate: 'isAfter',
  alpha: 'isAlpha',
  alphanumeric: 'isAlphanumeric',
  ascii: 'isAscii',
  base64: 'isBase64',
  beforeDate: 'isBefore',
  boolean: 'isBoolean',
  byteLen: 'isByteLength',
  creditCard: 'isCreditCard',
  currency: 'isCurrency',
  uri: 'isDataURI',
  decimal: 'isDecimal',
  divisibleBy: 'isDivisibleBy',
  email: 'isEmail',
  domain: 'isFQDN',
  float: 'isFloat',
  withFullWidth: 'isFullWidth',
  withHalfWidth: 'isHalfWidth',
  hexColor: 'isHexColor',
  hexadecimal: 'isHexadecimal',
  empty: 'isEmpty',
  ip: 'isIP',
  isbn: 'isISBN',
  issn: 'isISSN',
  isin: 'isISIN',
  date: 'isISO8601',
  isrc: 'isISRC',
  in: 'isIn',
  int: 'isInt',
  json: 'isJSON',
  len: 'isLength',
  lowercase: 'isLowercase',
  macAdd: 'isMACAddress',
  md5: 'isMD5',
  mobile: 'isMobilePhone',
  mongoId: 'isMongoId',
  multiByte: 'isMultibyte',
  numeric: 'isNumeric',
  surrogatePair: 'isSurrogatePair',
  url: 'isURL',
  uuid: 'isUUID',
  uppercase: 'isUppercase',
  variableWidth: 'isVariableWidth',
  whiteList: 'isWhitelisted',
  matches: 'matches',
  // some sanitizers 
  doRemoveBlackList: 'blacklist',
  doEscape: 'escape',
  doUnescape: 'unescape',
  doTrimLeft: 'ltrim',
  doTrimRight: 'rtrim',
  doRemoveLowercase: 'stripLow',
  doToBoolean: 'toBoolean',
  doToDate: 'toDate',
  doToFloat: 'toFloat',
  doToInt: 'toInt',
  doTrim: 'trim',
  doToString: 'toString',
  doKeepWhiteList: 'whitelist',
  doNormalizeEmail: 'normalizeEmail'
};

function config() {
  var _this = this;

  this.version = version;
  this.eventList = eventList;
  this.userDefine = userDefine;
  this.ruleNames = ruleNames;
  this.addTrigger = function (triggerEventName) {
    _this.eventList = _this.eventList.contact(triggerEventName);
  };
  this.addRule = function (ruleName, callbackFunc) {
    if (Object.prototype.toString.call(callbackFunc) === '[object Function]') {
      _this.userDefine[ruleName] = callbackFunc;
    } else {
      throw new Error('ruleName ' + ruleName + ' should be a function');
    }
  };
}

exports.default = new config();
module.exports = exports['default'];