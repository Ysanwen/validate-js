'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tooltip = require('tooltip.js');

var _tooltip2 = _interopRequireDefault(_tooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tips = {};

var positionAarea = ['top', 'top-start', 'top-end', 'right', 'right-start', 'right-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end'];

function createTip(el, tipId, info) {
  var template = '<div class="tooltip" role="tooltip"><div class="tooltip-arrow" id="arrow-' + tipId + '"></div><div class="tooltip-inner" id="inner-' + tipId + '"></div></div>';
  var placement = 'bottom-start';
  var tipsPosition = el.getAttribute('validate-tips-position');
  if (tipsPosition && positionAarea.indexOf(tipsPosition) >= 0) {
    placement = tipsPosition;
  }
  tips[tipId] = new _tooltip2.default(el, {
    placement: placement,
    title: info,
    template: template,
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
    createTip(el, tipId, info);
  }
  tips[tipId].show();
  // set style
  var innerEl = document.getElementById('inner-' + tipId);
  innerEl.style.fontSize = '12px';
  innerEl.style.color = successOrFail ? 'green' : 'red';
  innerEl.className += successOrFail ? ' tips-success' : ' tips-fail';
}
function hideTip(tipId) {
  if (tips[tipId]) return tips[tipId].dispose();
}
exports.default = showValidateResult;
module.exports = exports['default'];