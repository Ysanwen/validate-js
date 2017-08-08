'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tooltip = require('tooltip.js');

var _tooltip2 = _interopRequireDefault(_tooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Tooltip from 'tooltip.js/dist/tooltip.min.js'

var tips = {};

function createTip(el, tipId) {
  var template = '<div id="arrow-' + tipId + '"></div><div id="inner-' + tipId + '"></div>';
  tips[tipId] = new _tooltip2.default(el, {
    placement: 'bottom-start',
    title: template,
    html: true,
    trigger: 'manual'
  });
}

function showValidateResult(el, validateResult) {
  var tipId = el.getAttribute('validate-tip');
  if (!tipId) {
    tipId = new Date().toISOString().replace(/[-:\.]/g, '');
    el.setAttribute('validate-tip', tipId);
  }
  var successInfo = el.getAttribute('validate-success');
  var failInfo = el.getAttribute('validate-fail') || '输入非法内容';
  if (validateResult) {
    // validate success need show success info or hide fail info
    if (successInfo) {
      showTip(el, tipId, successInfo, validateResult);
    } else {
      hideTip(tipId);
    }
  } else {
    // validate fail need show fail info
    showTip(el, tipId, failInfo, validateResult);
  }
}

function showTip(el, tipId, info, successOrFail) {
  if (!tips[tipId]) {
    createTip(el, tipId);
  }
  tips[tipId].show();
  // set style
  var innerEl = document.getElementById('inner-' + tipId);
  innerEl.innerHTML = info;
  innerEl.style.fontSize = '12px';
  innerEl.style.color = successOrFail ? 'green' : 'red';
}
function hideTip(tipId) {
  if (tips[tipId]) return tips[tipId].dispose();
}
exports.default = showValidateResult;
module.exports = exports['default'];